import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { getItem, setItem } from "../services/config/configService";
import { CHARACTER_ASK_QUESTION, CHARACTER_TTS } from "../../socket/CharacterEvents";
import { startInteraction, startInteractionAudioOnly } from "./interactionManager";

export class ActionManager {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>) {
		this.socket = socket;
		socket.on(CHARACTER_TTS, (arg) => {
			this.tts(arg);
		});
		socket.on(CHARACTER_ASK_QUESTION, (arg) => {
			this.askQuestion(arg);
		});
	}
	tts = async (text: string) => {
		await setItem("character_tts", text);
		startInteractionAudioOnly(this.socket, text);
	};
	askQuestion = async (question: string) => {
		await setItem("character_question", question);
		const username = await getItem("twitch_preferred_username");
		startInteraction(this.socket, [{ role: "user", content: `${username}: ${question}` }]);
	};
}
