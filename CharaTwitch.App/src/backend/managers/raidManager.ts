import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { startInteraction } from "./caiManager";
import { Socket } from "socket.io/dist/socket";
import { getItem } from "../services/config/configService";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";

let isRaid: boolean = false;

export class RaidManager {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	twitchIrcService: TwitchIrcService;
	timeout: NodeJS.Timeout;
	queueInterval: NodeJS.Timeout;
	queue: Array<string>;
	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		twitchIrcService: TwitchIrcService
	) {
		this.socket = socket;
		this.twitchIrcService = twitchIrcService;
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

		if (this.queueInterval == undefined) return;

		this.queueInterval = setInterval(async () => {
			const reward = this.queue.pop();
			if (!reward) return clearInterval(this.queueInterval);

			const caiResponse = await startInteraction(
				this.socket,
				username,
				"",
				`${username} is currently being raided by ${raidedBy}! Give everyone a warm welcome to the stream and an introduction of yourself and ${username}.`,
				true
			);
			if (caiResponse == null) {
				this.queue.push(
					`${username} is currently being raided by ${raidedBy}! Give everyone a warm welcome to the stream and an introduction of yourself and ${username}.`
				);
				return;
			}

			this.twitchIrcService.sendMessage(caiResponse);
			clearInterval(this.queueInterval);
		}, 5000);
	};
}

export const isRaided = () => {
	return isRaid;
};
