import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { sendChat, fetchTTS } from "../services/cai/caiApiService";
import { Socket } from "socket.io";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";
import { getItem } from "../services/config/configService";
import { isPlaying, start } from "./audioManager";

export class ChatManager {
	messages: Array<string>;
	users: Map<string, string>;
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	twitchIrcService: TwitchIrcService;

	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		twitchIrcService: TwitchIrcService
	) {
		this.messages = [];
		this.users = new Map<string, string>();
		this.socket = socket;
		this.twitchIrcService = twitchIrcService;
	}
	eventOccurs = (probability: number): boolean => {
		const randomNumber = Math.random();
		return randomNumber < probability;
	};
	newViewer = async (username: string, message: string, messageId: string) => {
		if (isPlaying()) return;
		start();
		this.socket.emit("caiProcessingRequest");

		const chatResponse = await sendChat(
			username,
			`Leah, welcome ${username} to the stream! They just popped in.`,
			`Respond with a quick welcome message to the new viewer ${username}. This was ${username} message: ${message}. You should not include this in the response, this is only for context.`
		);
		const ttsResponse = await fetchTTS(chatResponse);

		this.socket.emit("caiMessage", {
			audio: ttsResponse,
			message: chatResponse,
		});

		this.twitchIrcService.sendMessage(chatResponse, messageId);
	};
	greeting = () => {};
	randomRedeem = () => {};
	randomReply = async (username: string, message: string, messageId: string) => {
		if (isPlaying()) return;
		start();
		this.socket.emit("caiProcessingRequest");
		let context = await getItem("character_context_parameter");
		context += `Previous messages for context: `;

		const lastTenMessages: string[] = this.messages.slice(
			Math.max(this.messages.length - 10, 0)
		);
		lastTenMessages.forEach((message) => {
			context += message;
		});

		const chatResponse = await sendChat(username, message, context);
		const ttsResponse = await fetchTTS(chatResponse);

		this.socket.emit("caiMessage", {
			audio: ttsResponse,
			message: chatResponse,
		});

		this.twitchIrcService.sendMessage(chatResponse, messageId);
	};
	handleMessage = async (username: string, message: string, messageId: string) => {
		if (message.startsWith("!")) return;
		this.messages.push(`username: ${username}, message: ${message}`);
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
		if (this.eventOccurs(randomTalkingFrequency / 100))
			this.randomReply(username, message, messageId);
	};
}
