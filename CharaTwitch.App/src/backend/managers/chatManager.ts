import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket } from "socket.io";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";
import { getItem } from "../services/config/configService";
import { stop } from "./audioManager";
import { startInteraction } from "./interactionManager";

export class ChatManager {
	messages: Array<string>;
	users: Map<string, string>;
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	twitchIrcService: TwitchIrcService;
	timeSinceLastTalkingMinutes: number;

	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		twitchIrcService: TwitchIrcService
	) {
		this.messages = [];
		this.users = new Map<string, string>();
		this.socket = socket;
		this.twitchIrcService = twitchIrcService;
		this.timeSinceLastTalkingMinutes = 0;
		setInterval(() => {
			this.timeSinceLastTalkingMinutes++;
		}, 60000);
	}
	eventOccurs = (probability: number): boolean => {
		const randomNumber = Math.random();
		return randomNumber < probability;
	};
	newViewer = async (username: string, message: string, messageId: string) => {
		const caiResponse = await startInteraction(
			this.socket,
			`Welcome ${username} to the stream! They just popped in with message: ${message}`,
			username
		);
		if (caiResponse == null) return stop();

		this.twitchIrcService.sendMessage(caiResponse, messageId);
	};
	randomReply = async (username: string, message: string, messageId: string) => {
		let finalMessaage = "Previous messages:\n";
		const lastTenMessages: string[] = this.messages.slice(Math.max(this.messages.length - 10, 0));
		lastTenMessages.forEach((message) => {
			finalMessaage += `${message}`;
		});
		finalMessaage += `\n${message}`;

		const caiResponse = await startInteraction(this.socket, finalMessaage, username);
		if (caiResponse == null) return stop();

		this.timeSinceLastTalkingMinutes = 0;
		this.twitchIrcService.sendMessage(caiResponse, messageId);
	};
	handleMessage = async (username: string, message: string, messageId: string) => {
		if (message.startsWith("!")) return;
		this.messages.push(`${username}: ${message}`);
		const welcomeNewViewers = await getItem("character_welcome_new_viewers");
		if (welcomeNewViewers && !this.users.has(username)) {
			this.users.set(username, username);
			this.newViewer(username, message, messageId);
			return;
		}

		if (message.trim().split(/\s+/).length < 3) return;

		const randomTalking = await getItem("character_random_talking");
		if (!randomTalking) return;

		const randomTalkingFrequency = await getItem("character_random_talking_frequency");
		const minimumTimeBetweenTalking = await getItem("character_minimum_time_between_talking");
		if (this.eventOccurs(randomTalkingFrequency / 100) && this.timeSinceLastTalkingMinutes >= minimumTimeBetweenTalking)
			this.randomReply(username, message, messageId);
	};
}
