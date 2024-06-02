import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket } from "socket.io";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";
import { getItem } from "../services/config/configService";
import { InteractionManager } from "./interactionManager";

export class ChatManager {
	interactionManager: InteractionManager;
	messagesUsers: Array<{ username: string; content: string }>;
	messagesAssistant: Array<string>;
	users: Map<string, string>;
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	twitchIrcService: TwitchIrcService;
	timeSinceLastTalkingMinutes: number;

	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		twitchIrcService: TwitchIrcService,
		interactionManager: InteractionManager
	) {
		this.interactionManager = interactionManager;

		this.messagesUsers = [];
		this.messagesAssistant = [];
		this.users = new Map<string, string>();
		this.socket = socket;
		this.twitchIrcService = twitchIrcService;
		this.timeSinceLastTalkingMinutes = 0;

		setInterval(() => {
			this.timeSinceLastTalkingMinutes++;
		}, 60000);
	}

	addUserMessage = (username: string, message: string) => {
		let messagesLength = this.messagesUsers.push({ username: username, content: message });
		if (messagesLength > 20) this.messagesUsers.shift();
	};

	addAssistantMessage = (message: string) => {
		let messagesLength = this.messagesAssistant.push(message);
		if (messagesLength > 5) this.messagesAssistant.shift();
	};

	getChatHistory = () => {
		let chatHistoryContext = "CONTEXT:\n";
		let userMessages = "USER MESSAGES:\n";
		let assistantMessages = "ASSISTANT MESSAGES:\n";
		this.messagesUsers.forEach((message) => {
			userMessages += `${message.username}: ${message.content} \n`;
		});
		this.messagesAssistant.forEach((message) => {
			assistantMessages += `${message}\n`;
		});

		chatHistoryContext += userMessages;
		chatHistoryContext += assistantMessages;

		return chatHistoryContext;
	};

	eventOccurs = (probability: number): boolean => {
		const randomNumber = Math.random();
		return randomNumber < probability;
	};

	newViewer = async (username: string, message: string, messageId: string) => {
		const ollamaResponse = await this.interactionManager.startInteraction(
			this.socket,
			`Welcome ${username} to the stream! ${username}: ${message}`
		);
		if (ollamaResponse === null) return;

		this.twitchIrcService.sendMessage(ollamaResponse, messageId);
	};

	randomReply = async (username: string, message: string, messageId: string) => {
		const finalMessage = this.getChatHistory() + `PROMPT:\n${username}: ${message}`;

		let ollamaResponse = await this.interactionManager.startInteraction(this.socket, finalMessage);
		if (ollamaResponse === null) return;

		ollamaResponse = ollamaResponse.trim();

		this.addAssistantMessage(ollamaResponse);

		this.timeSinceLastTalkingMinutes = 0;
		this.twitchIrcService.sendMessage(ollamaResponse, messageId);
	};

	handleMessage = async (username: string, message: string, messageId: string) => {
		if (message.startsWith("!")) return;
		message = message.trim();

		this.addUserMessage(username, message);

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
