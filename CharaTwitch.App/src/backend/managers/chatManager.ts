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
	newViewer = async (username: string) => {
		if (isPlaying()) return;
		start();
		this.socket.emit("caiProcessingRequest");

		const chatResponse = await sendChat(
			username,
			`Leah, welcome ${username} to the stream! They just popped in.`,
			"Respond with a warm welcome to the new viewer. You should not include this in the response, this is only for context."
		);
		const ttsResponse = await fetchTTS(chatResponse);

		this.socket.emit("caiMessage", {
			audio: ttsResponse,
			message: chatResponse,
		});

		this.twitchIrcService.sendMessage(chatResponse);
	};
	greeting = () => {};
	randomRedeem = () => {};
	randomReply = async (username: string, message: string) => {
		if (isPlaying()) return;
		start();
		this.socket.emit("caiProcessingRequest");

		const chatResponse = await sendChat(username, message);
		const ttsResponse = await fetchTTS(chatResponse);

		this.socket.emit("caiMessage", {
			audio: ttsResponse,
			message: chatResponse,
		});

		this.twitchIrcService.sendMessage(chatResponse);
	};
	handleMessage = async (username: string, message: string) => {
		this.messages.push(message);
		const welcomeNewViewers = await getItem("character_welcome_new_viewers");
		if (welcomeNewViewers && !this.users.has(username)) {
			this.users.set(username, username);
			this.newViewer(username);
			return;
		}
		const randomTalking = await getItem("character_random_talking");
		if (randomTalking) {
			const randomTalkingFrequency = await getItem("character_random_talking_frequency");
			if (this.eventOccurs(randomTalkingFrequency / 100)) {
				this.randomReply(username, message);
			}
		}
	};
}
