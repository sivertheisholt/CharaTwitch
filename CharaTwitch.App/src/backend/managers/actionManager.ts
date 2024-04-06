import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { CHARACTER_ASK_QUESTION, CHARACTER_DO_INTRO } from "../../Socket/Events";
import { setItem } from "../services/config/configService";
import { isPlaying, start } from "./audioManager";
import { fetchTTS, sendChat } from "../services/cai/caiApiService";

export class ActionManager {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>
	) {
		this.socket = socket;
		socket.on(CHARACTER_DO_INTRO, (arg) => {
			this.doIntro(arg);
		});
		socket.on(CHARACTER_ASK_QUESTION, (arg) => {
			this.askQuestion(arg);
		});
	}
	doIntro = async (introParam: string) => {
		await setItem("character_intro_param", introParam);
		if (isPlaying()) return;
		start();

		this.socket.emit("caiProcessingRequest");

		const audioBase64 = await fetchTTS(introParam);

		this.socket.emit("caiMessage", {
			audio: audioBase64,
			message: introParam,
		});
	};
	askQuestion = async (question: string) => {
		await setItem("character_question", question);
		if (isPlaying()) return;
		start();

		this.socket.emit("caiProcessingRequest");

		const chatResponse = await sendChat("host", question);
		const audioBase64 = await fetchTTS(chatResponse);

		this.socket.emit("caiMessage", {
			audio: audioBase64,
			message: chatResponse,
		});
	};
}
