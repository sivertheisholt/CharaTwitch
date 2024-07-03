import { Socket } from "socket.io/dist/socket";
import { getItem } from "../services/config/configService";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";
import { TWITCH_REDEEM } from "../../socket/TwitchEvents";
import { InteractionManager } from "./interactionManager";
import { RewardQueueItemType } from "../../types/RewardQueueItemType";

export class RewardManager {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	twitchIrcService: TwitchIrcService;
	interactionManager: InteractionManager;
	queue: Array<RewardQueueItemType> = [];
	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		twitchIrcService: TwitchIrcService,
		interactionManager: InteractionManager
	) {
		this.socket = socket;
		this.twitchIrcService = twitchIrcService;
		this.interactionManager = interactionManager;

		setInterval(async () => {
			const reward = this.removeQueue();
			if (!reward) return;

			const ollamaResponse = await this.interactionManager.startInteraction(
				this.socket,
				`${reward.username}: ${reward.message}`
			);

			if (ollamaResponse === null) {
				this.addQueue(reward.username, reward.message);
				return;
			}

			this.twitchIrcService.sendMessage(ollamaResponse);
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
			this.socket.emit(TWITCH_REDEEM, {
				username: rewardData.data.redemption.user.display_name,
				reward: rewardData.data.redemption.reward.title,
			});

			const ollamaResponse = await this.interactionManager.startInteraction(
				this.socket,
				`### Task:\n ${username}: ${userInput}`
			);
			if (ollamaResponse === null) {
				this.addQueue(username, userInput);
				return;
			}

			this.twitchIrcService.sendMessage(ollamaResponse);
		}
	};
	removeQueue = () => {
		return this.queue.pop();
	};
	addQueue = (username: string, message: string) => {
		this.queue.push({ username: username, message: message });
	};
}
