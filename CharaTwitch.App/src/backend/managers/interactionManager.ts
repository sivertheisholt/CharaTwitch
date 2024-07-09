import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { isRaided } from "./raidManager";
import { sendChat } from "../services/ollama/ollamaApiService";
import { AI_MESSAGE, AI_PROCESSING_REQUEST } from "../../socket/AiEvents";
import { AUDIO_ON_ENDED } from "../../socket/AudioEvents";
import { fetchTTS } from "../services/coqui/coquiApiService";
import { PromptManager } from "./promptManager";

export class InteractionManager {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	promptManager: PromptManager;
	audioPlaying: boolean;

	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		promptManager: PromptManager
	) {
		this.socket = socket;
		this.promptManager = promptManager;
		this.audioPlaying = false;

		socket.on(AUDIO_ON_ENDED, () => {
			this.audioPlaying = false;
		});
	}

	stopInteraction = (): null => {
		this.socket.emit(AI_PROCESSING_REQUEST, false);
		this.audioPlaying = false;
		return null;
	};

	startInteraction = async (message: string, bypassIsRaid: boolean = false) => {
		if (this.audioPlaying || (isRaided() && !bypassIsRaid)) return null;
		this.audioPlaying = true;
		this.socket.emit(AI_PROCESSING_REQUEST, true);

		const systemPrompt = await this.promptManager.getPrompt();
		if (systemPrompt == null) return this.stopInteraction();

		const ollamaResponse = await sendChat(message, systemPrompt);
		if (ollamaResponse === null) return this.stopInteraction();

		const audioBase64 = await fetchTTS(ollamaResponse);
		if (audioBase64 === null) return this.stopInteraction();

		this.socket.emit(AI_MESSAGE, {
			audio: audioBase64,
			message: ollamaResponse,
		});

		return ollamaResponse;
	};

	startInteractionAudioOnly = async (text: string) => {
		if (this.audioPlaying) return null;
		this.audioPlaying = true;
		this.socket.emit(AI_PROCESSING_REQUEST, true);

		const audioBase64 = await fetchTTS(text);
		if (audioBase64 === null) return this.stopInteraction();

		this.socket.emit(AI_MESSAGE, {
			audio: audioBase64,
			message: text,
		});

		return text;
	};
}
