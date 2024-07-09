import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket } from "socket.io";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";
import { getItem } from "../services/config/configService";
import { InteractionManager } from "./interactionManager";
import { PromptManager } from "./promptManager";

export class ChatManager {
	interactionManager: InteractionManager;
	promptManager: PromptManager;
	users: Map<string, string>;
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	twitchIrcService: TwitchIrcService;
	timeSinceLastTalkingMinutes: number;

	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		twitchIrcService: TwitchIrcService,
		interactionManager: InteractionManager,
		promptManager: PromptManager
	) {
		this.socket = socket;
		this.interactionManager = interactionManager;
		this.promptManager = promptManager;
		this.twitchIrcService = twitchIrcService;

		this.users = new Map<string, string>();
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
		const ollamaResponse = await this.interactionManager.startInteraction(
			`Welcome ${username} to the stream! ${username}: ${message}`
		);
		if (ollamaResponse === null) return;

		this.twitchIrcService.sendMessage(ollamaResponse, messageId);
	};

	randomReply = async (username: string, message: string, messageId: string) => {
		let ollamaResponse = await this.interactionManager.startInteraction(`${username}: ${message}`);
		if (ollamaResponse === null) return;

		ollamaResponse = ollamaResponse.trim();

		this.promptManager.addAssistantMessage(ollamaResponse);

		this.timeSinceLastTalkingMinutes = 0;
		this.twitchIrcService.sendMessage(ollamaResponse, messageId);
	};

	handleMessage = async (username: string, message: string, messageId: string) => {
		if (message.startsWith("!")) return;
		message = message.trim();

		this.promptManager.addTwitchChatMessage(username, message);

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
