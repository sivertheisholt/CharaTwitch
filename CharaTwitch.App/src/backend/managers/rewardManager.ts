import { Socket } from "socket.io/dist/socket";
import { getItem } from "../services/config/configService";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";
import { startInteraction } from "./caiManager";

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

			const caiResponse = await startInteraction(
				this.socket,
				rewardData.data.redemption.user.display_name,
				rewardData.data.redemption.user_input
			);
			if (caiResponse == null) return;

			this.twitchIrcService.sendMessage(caiResponse);
		}
	};
}
