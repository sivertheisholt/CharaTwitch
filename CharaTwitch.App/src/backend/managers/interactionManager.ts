import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { isRaided } from "./raidManager";
import { sendChat } from "../services/ollama/ollamaApiService";
import { AI_MESSAGE, AI_PROCESSING_REQUEST } from "../../socket/AiEvents";
import { fetchTTS } from "../services/cai/caiApiService";
import { AUDIO_ON_ENDED } from "../../socket/AudioEvents";

export class InteractionManager {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	audioPlaying: boolean;

	constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>) {
		this.socket = socket;
		this.audioPlaying = false;

		socket.on(AUDIO_ON_ENDED, () => {
			this.audioPlaying = false;
		});
	}

	removePrefix(text: string): string {
		const colonIndex = text.indexOf(":");
		if (colonIndex !== -1) {
			return text.slice(colonIndex + 1).trim();
		}
		return text;
	}

	startInteraction = async (
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		message: string,
		bypassIsRaid: boolean = false
	) => {
		if (this.audioPlaying || (isRaided() && !bypassIsRaid)) return null;
		this.audioPlaying = true;

		socket.emit(AI_PROCESSING_REQUEST, true);

		const ollamaResponse = await sendChat(message);
		if (ollamaResponse === null) {
			socket.emit(AI_PROCESSING_REQUEST, false);
			this.audioPlaying = false;
			return null;
		}

		const cleanedResponse = this.removePrefix(ollamaResponse);

		const audioBase64 = await fetchTTS(cleanedResponse);
		if (audioBase64 === null) {
			socket.emit(AI_PROCESSING_REQUEST, false);
			this.audioPlaying = false;
			return null;
		}

		socket.emit(AI_MESSAGE, {
			audio: audioBase64,
			message: cleanedResponse,
		});

		return cleanedResponse;
	};

	startInteractionAudioOnly = async (
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		text: string
	) => {
		if (this.audioPlaying) return null;
		this.audioPlaying = true;

		socket.emit(AI_PROCESSING_REQUEST, true);

		const audioBase64 = await fetchTTS(text);
		if (audioBase64 === null) {
			socket.emit(AI_PROCESSING_REQUEST, false);
			return null;
		}

		socket.emit(AI_MESSAGE, {
			audio: audioBase64,
			message: text,
		});

		return text;
	};
}
