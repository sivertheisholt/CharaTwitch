import { authTwitch, authTwitchRaid } from "../services/twitch/twitchAuthService";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";
import { TwitchPubSubService } from "../services/twitch/twitchPubSubService";
import { getUserInfo, getCustomRewards } from "../services/twitch/twitchApiService";
import { setItem, setTwitchConfig } from "../services/config/configService";
import { RewardManager } from "./rewardManager";
import { Express } from "express";
import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ActionManager } from "./actionManager";
import { TwitchEventSubService } from "../services/twitch/twitchEventSubService";
import { logger } from "../logging/logger";

export const onTwitchAuth = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	arg: any,
	expressApp: Express
) => {
	try {
		const { client_id, client_secret } = arg;

		await setTwitchConfig(client_id, client_secret);

		const { access_token } = await authTwitch(expressApp, client_id, client_secret);
		if (access_token == null) return socket.emit("twitchAuthCb", null);

		const { access_token: access_token_raid } = await authTwitchRaid(
			expressApp,
			client_id,
			client_secret
		);
		await setItem("twitch_access_token_raid");

		const { preferred_username, sub } = await getUserInfo(access_token);
		if (sub == null) return socket.emit("twitchAuthCb", null);

		await setItem("twitch_broadcaster_id", sub);

		const customRedeems = await getCustomRewards(sub, client_id, access_token);
		if (customRedeems == null) return socket.emit("twitchAuthCb", null);

		const twitchIrc = new TwitchIrcService(socket, access_token, preferred_username);

		await twitchIrc.connectToTwitchIrc();

		const rewardManager = new RewardManager(socket, twitchIrc);

		const twitchPubSubService = new TwitchPubSubService(
			socket,
			access_token,
			rewardManager.onRewardCb
		);
		await twitchPubSubService.init();

		/*
		const twitchEventSubService = new TwitchEventSubService(socket, access_token_raid);
		await twitchEventSubService.init();
		*/
		const actionManager = new ActionManager(socket);

		socket.emit("twitchAuthCb", {
			custom_redeems: customRedeems,
		});
	} catch (err) {
		logger.error(err, "Something went wrong on onTwitchAuth");
	}
};
