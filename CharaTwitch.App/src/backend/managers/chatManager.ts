import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { sendChat, fetchTTS } from "../services/cai/caiApiService";
import { Socket } from "socket.io";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";

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
		console.log(message);
		if (message === "Can you redeem something leah?") {
			const chatResponse = await sendChat(username, message);
			const ttsResponse = await fetchTTS(chatResponse);
			this.socket.emit("caiMessage", {
				audio: ttsResponse,
				message: chatResponse,
			});
			this.twitchIrcService.sendMessage(chatResponse);
		}

		// Random chance of replying to message
		if (this.eventOccurs(0.01)) {
			this.randomReply(username, message);
		}
	};
}
