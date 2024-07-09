import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket } from "socket.io/dist/socket";
import { getItem } from "../services/config/configService";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";
import { InteractionManager } from "./interactionManager";

let isRaid: boolean = false;

export class RaidManager {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	twitchIrcService: TwitchIrcService;
	interactionManager: InteractionManager;

	timeout: NodeJS.Timeout;
	queueInterval: NodeJS.Timeout;
	queue: Array<string>;

	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		twitchIrcService: TwitchIrcService,
		interactionManager: InteractionManager
	) {
		this.socket = socket;
		this.twitchIrcService = twitchIrcService;
		this.interactionManager = interactionManager;
		this.queue = [];
	}

	startRaid = async (raidedBy: string) => {
		if (isRaid) {
			clearTimeout(this.timeout);
		}

		this.timeout = setTimeout(() => {
			isRaid = false;
		}, 20000);

		isRaid = true;

		const username = await getItem("twitch_preferred_username");
		this.queue.push(
			`${username} is currently being raided! Give everyone a warm welcome to the stream and an introduction of yourself and ${username}.`
		);

		this.queueInterval = setInterval(async () => {
			const raid = this.queue.pop();
			if (!raid) return clearInterval(this.queueInterval);

			const ollamaResponse = await this.interactionManager.startInteraction(
				`${username} is currently being raided by ${raidedBy}! Give everyone a warm welcome to the stream and an introduction of yourself and ${username}.`,
				true
			);

			if (ollamaResponse === null) {
				this.queue.push(
					`${username} is currently being raided by ${raidedBy}! Give everyone a warm welcome to the stream and an introduction of yourself and ${username}.`
				);
				return;
			}

			this.twitchIrcService.sendMessage(ollamaResponse);
			clearInterval(this.queueInterval);
		}, 5000);
	};
}

export const isRaided = () => {
	return isRaid;
};
