import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { CHARACTER_ASK_QUESTION, CHARACTER_DO_INTRO } from "../../socket/Events";
import { setItem } from "../services/config/configService";
import { startInteraction, startInteractionAudioOnly } from "./caiManager";

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
		startInteractionAudioOnly(this.socket, introParam);
	};
	askQuestion = async (question: string) => {
		await setItem("character_question", question);
		startInteraction(this.socket, "host", question);
	};
}
