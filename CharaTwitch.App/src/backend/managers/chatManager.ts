import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket } from "socket.io";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";
import { getItem } from "../services/config/configService";
import { stop } from "./audioManager";
import { startInteraction } from "./interactionManager";

export class ChatManager {
	messages: Array<{ username: string; content: string }>;
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
		const ollamaResponse = await startInteraction(this.socket, [
			{
				role: "user",
				content: `Welcome ${username} to the stream! ${username}: ${message}`,
			},
		]);
		if (ollamaResponse === undefined) return;
		if (ollamaResponse === null) return stop();

		this.twitchIrcService.sendMessage(ollamaResponse, messageId);
	};

	randomReply = async (username: string, message: string, messageId: string) => {
		const historyUser = { role: "user", content: "\n" };
		const historyAssistant = { role: "assistant", content: "\n" };
		this.messages.forEach((message) => {
			if (message.username === "assistant") historyAssistant.content += `${message.username}: ${message.content} \n`;
			else historyUser.content += `${message.content} \n`;
		});

		const finalArray = [historyUser, historyAssistant, { role: "user", content: `${username}: ${message}` }];

		let ollamaResponse = await startInteraction(this.socket, finalArray);
		if (ollamaResponse === undefined) return;
		if (ollamaResponse === null) return stop();

		ollamaResponse = ollamaResponse.trim();

		let messagesLength = this.messages.push({ username: "assistant", content: ollamaResponse });
		if (messagesLength > 20) this.messages.shift();

		this.timeSinceLastTalkingMinutes = 0;
		this.twitchIrcService.sendMessage(ollamaResponse, messageId);
	};

	handleMessage = async (username: string, message: string, messageId: string) => {
		if (message.startsWith("!")) return;
		message = message.trim();

		let messagesLength = this.messages.push({ username: username, content: message });
		if (messagesLength > 20) this.messages.shift();

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
