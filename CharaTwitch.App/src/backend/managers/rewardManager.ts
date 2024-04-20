import { Socket } from "socket.io/dist/socket";
import { getItem } from "../services/config/configService";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";
import { startInteraction } from "./caiManager";
import { add, remove } from "./rewardQueueManager";

export class RewardManager {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	twitchIrcService: TwitchIrcService;
	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		twitchIrcService: TwitchIrcService
	) {
		this.socket = socket;
		this.twitchIrcService = twitchIrcService;
		setInterval(async () => {
			const reward = remove();
			if (!reward) return;

			const finalMessage = `This message was sent by ${reward.username}: ${reward.message}`;

			const caiResponse = await startInteraction(this.socket, finalMessage);
			if (caiResponse == null) {
				add(reward.username, reward.message);
				return;
			}

			this.twitchIrcService.sendMessage(caiResponse);
		}, 10000);
	}
	onRewardCb = async (rewardData: any) => {
		const selectedRedeem = await getItem("twitch_selected_redeem");

		if (
			selectedRedeem === rewardData.data.redemption.reward.id &&
			rewardData.data.redemption.reward.is_user_input_required
		) {
			const username = rewardData.data.redemption.user.display_name;
			const userInput = rewardData.data.redemption.user_input;
			this.socket.emit("twitchRedeem", {
				username: rewardData.data.redemption.user.display_name,
				reward: rewardData.data.redemption.reward.title,
			});

			const finalMessage = `This message was sent by ${username}: ${userInput}`;

			const caiResponse = await startInteraction(this.socket, finalMessage);
			if (caiResponse == null) {
				add(username, userInput);
				return;
			}

			this.twitchIrcService.sendMessage(caiResponse);
		}
	};
}
