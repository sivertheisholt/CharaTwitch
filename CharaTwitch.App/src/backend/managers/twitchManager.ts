import { authTwitch } from "../services/twitch/twitchAuthService";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";
import { TwitchPubSubService } from "../services/twitch/twitchPubSubService";
import { getUserInfo, getCustomRewards } from "../services/twitch/twitchApiService";
import { setItem, setTwitchConfig } from "../services/config/configService";
import { RewardManager } from "./rewardManager";
import { Express } from "express";
import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ActionManager } from "./actionManager";
import { logger } from "../logging/logger";
import { TWITCH_AUTH_CB, TWITCH_CUSTOM_REDEEMS } from "../../socket/TwitchEvents";

export const onTwitchAuth = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	arg: any,
	expressApp: Express
) => {
	try {
		const { client_id, client_secret } = arg;

		await setTwitchConfig(client_id, client_secret);

		const { access_token } = await authTwitch(expressApp, client_id, client_secret);
		if (access_token == null) return socket.emit(TWITCH_AUTH_CB, false);

		const { preferred_username, sub } = await getUserInfo(access_token);
		if (sub == null) return socket.emit(TWITCH_AUTH_CB, false);

		await setItem("twitch_preferred_username", preferred_username);
		await setItem("twitch_broadcaster_id", sub);

		const customRedeems = await getCustomRewards(sub, client_id, access_token);
		if (customRedeems == null) return socket.emit(TWITCH_AUTH_CB, false);

		const twitchIrc = new TwitchIrcService(socket, access_token, preferred_username);

		await twitchIrc.connectToTwitchIrc();

		const rewardManager = new RewardManager(socket, twitchIrc);

		const twitchPubSubService = new TwitchPubSubService(socket, access_token, rewardManager.onRewardCb);
		await twitchPubSubService.init();

		const actionManager = new ActionManager(socket);

		socket.emit(TWITCH_CUSTOM_REDEEMS, customRedeems);
		socket.emit(TWITCH_AUTH_CB, true);
	} catch (err) {
		logger.error(err, "Something went wrong on onTwitchAuth");
	}
};
