import { Socket } from "socket.io/dist/socket";
import { ActionManager } from "./actionManager";
import { ChatManager } from "./chatManager";
import { RaidManager } from "./raidManager";
import { RewardManager } from "./rewardManager";
import { VoiceRecordingManager } from "./voiceRecordingManager";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { TwitchAuthType } from "../../types/socket/TwitchAuthType";
import { Express } from "express";
import { setCaiConfig, setItem, setOllamaConfig, setTwitchConfig } from "../services/config/configService";
import { authTwitch } from "../services/twitch/twitchAuthService";
import { getCustomRewards, getUserInfo } from "../services/twitch/twitchApiService";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";
import { TWITCH_ACCOUNT_STATUS, TWITCH_CUSTOM_REDEEMS } from "../../socket/TwitchEvents";
import { logger } from "../logging/logger";
import { TwitchPubSubService } from "../services/twitch/twitchPubSubService";
import { InteractionManager } from "./interactionManager";
import { authCai } from "../services/cai/caiAuthService";
import { CAI_ACCOUNT_STATUS, CAI_VOICES } from "../../socket/CaiEvents";
import { fetchVoices } from "../services/cai/caiApiService";
import { OLLAMA_STATUS } from "../../socket/OllamaEvents";

// This class handles the each manager/service and the communication between them
export class GlobalManager {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	actionManager: ActionManager;
	chatManager: ChatManager;
	raidManager: RaidManager;
	rewardManager: RewardManager;
	voiceRecordingManager: VoiceRecordingManager;
	interactionManager: InteractionManager;

	twitchIrcService: TwitchIrcService;
	twitchPubSubService: TwitchPubSubService;

	constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>) {
		this.socket = socket;
		this.interactionManager = new InteractionManager(socket);
		this.actionManager = new ActionManager(this.socket, this.interactionManager);
	}

	onTwitchAuth = async (arg: TwitchAuthType, expressApp: Express) => {
		try {
			const { twitch_client_id, twitch_client_secret } = arg;

			await setTwitchConfig(twitch_client_id, twitch_client_secret);

			const { access_token } = await authTwitch(expressApp, twitch_client_id, twitch_client_secret);
			if (access_token === null) return this.socket.emit(TWITCH_ACCOUNT_STATUS, false);

			const { preferred_username, sub } = await getUserInfo(access_token);
			if (sub === null) return this.socket.emit(TWITCH_ACCOUNT_STATUS, false);

			await setItem("twitch_preferred_username", preferred_username);
			await setItem("twitch_broadcaster_id", sub);

			const customRedeems = await getCustomRewards(sub, twitch_client_id, access_token);
			if (customRedeems === null) return this.socket.emit(TWITCH_ACCOUNT_STATUS, false);

			this.twitchIrcService = new TwitchIrcService(this.socket, access_token, preferred_username);

			this.chatManager = new ChatManager(this.socket, this.twitchIrcService, this.interactionManager);
			this.raidManager = new RaidManager(this.socket, this.twitchIrcService, this.interactionManager);
			this.rewardManager = new RewardManager(this.socket, this.twitchIrcService, this.interactionManager);
			this.voiceRecordingManager = new VoiceRecordingManager(
				this.socket,
				this.twitchIrcService,
				this.interactionManager,
				this.chatManager
			);

			this.twitchIrcService.initialize(this.chatManager.handleMessage, this.raidManager.startRaid);
			await this.twitchIrcService.connectToTwitchIrc();

			this.twitchPubSubService = new TwitchPubSubService(this.socket, access_token, this.rewardManager.onRewardCb);
			await this.twitchPubSubService.init();

			this.socket.emit(TWITCH_CUSTOM_REDEEMS, customRedeems);
			this.socket.emit(TWITCH_ACCOUNT_STATUS, true);
		} catch (err) {
			logger.error(err, "Something went wrong on authenticating twitch");
		}
	};

	onCaiAuth = async (caiBaseUrl: string) => {
		const caiAccessToken = await authCai();
		if (caiAccessToken === null) return this.socket.emit(CAI_ACCOUNT_STATUS, false);

		await setCaiConfig(caiAccessToken, caiBaseUrl);

		const voices = await fetchVoices();
		if (voices === null) return this.socket.emit(CAI_ACCOUNT_STATUS, false);

		this.socket.emit(CAI_VOICES, voices);
		this.socket.emit(CAI_ACCOUNT_STATUS, true);
	};

	onOllamaAuth = async (ollamaModelName: string, ollamaBaseUrl: string) => {
		await setOllamaConfig(ollamaModelName, ollamaBaseUrl);
		this.socket.emit(OLLAMA_STATUS, true);
	};
}
