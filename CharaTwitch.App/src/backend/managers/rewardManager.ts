import { Socket } from "socket.io/dist/socket";
import { getItem } from "../services/config/configService";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { fetchTTS, sendChat } from "../services/cai/caiApiService";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";
import { isPlaying, start } from "./audioManager";

export class RewardManager {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	twitchIrcService: TwitchIrcService;
	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		twitchIrcService: TwitchIrcService
	) {
		this.socket = socket;
		this.twitchIrcService = twitchIrcService;
	}
	onRewardCb = async (rewardData: any) => {
		const selectedRedeem = await getItem("twitch_selected_redeem");

		if (
			selectedRedeem === rewardData.data.redemption.reward.id &&
			rewardData.data.redemption.reward.is_user_input_required
		) {
			this.socket.emit("twitchRedeem", {
				username: rewardData.data.redemption.user.display_name,
				reward: rewardData.data.redemption.reward.title,
			});

			if (isPlaying()) return;
			start();

			this.socket.emit("caiProcessingRequest");

			const chatResponse = await sendChat(
				rewardData.data.redemption.user.display_name,
				rewardData.data.redemption.user_input
			);
			const audioBase64 = await fetchTTS(chatResponse);

			this.socket.emit("caiMessage", {
				audio: audioBase64,
				message: chatResponse,
			});

			this.twitchIrcService.sendMessage(chatResponse);
		}
	};
}
