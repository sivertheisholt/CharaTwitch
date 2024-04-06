import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { sendChat, fetchTTS } from "../services/cai/caiApiService";
import { Socket } from "socket.io";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";
import { getItem } from "../services/config/configService";
import { isPlaying, start } from "./audioManager";

export class ChatManager {
	messages: Array<string>;
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	twitchIrcService: TwitchIrcService;

	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		twitchIrcService: TwitchIrcService
	) {
		this.messages = [];
		this.socket = socket;
		this.twitchIrcService = twitchIrcService;
	}
	eventOccurs = (probability: number): boolean => {
		const randomNumber = Math.random();
		return randomNumber < probability;
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
		const randomTalking = await getItem("character_random_talking");
		if (randomTalking) {
			const randomTalkingFrequency = await getItem("character_random_talking_frequency");
			if (this.eventOccurs(randomTalkingFrequency / 100)) {
				this.randomReply(username, message);
			}
		}
	};
}
