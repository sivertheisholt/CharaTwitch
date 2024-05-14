import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { isPlaying, start } from "./audioManager";
import { isRaided } from "./raidManager";
import { sendChat } from "../services/ollama/ollamaApiService";
import { AI_MESSAGE, AI_PROCESSING_REQUEST } from "../../socket/AiEvents";
import { fetchTTS } from "../services/cai/caiApiService";
import { logger } from "../logging/logger";

export const startInteractionAudioOnly = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	text: string
) => {
	console.log("FROM BACKEND BEFORE COND: " + isPlaying());
	if (isPlaying()) return null;
	console.log("FROM BACKEND AFTER COND: " + isPlaying());
	start();
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

// Returns null if fail
// Returns undefined if audio playing
// Returns string if success
export const startInteraction = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	messages: Array<{ role: string; content: string }>,
	bypassIsRaid: boolean = false
) => {
	console.log(isPlaying());
	if (isPlaying() || (isRaided() && !bypassIsRaid)) return undefined;
	start();

	socket.emit(AI_PROCESSING_REQUEST, true);

	const ollamaResponse = await sendChat(messages);
	logger.warn(ollamaResponse);
	if (ollamaResponse === null) {
		socket.emit(AI_PROCESSING_REQUEST, false);
		return null;
	}

	const audioBase64 = await fetchTTS(ollamaResponse);
	if (audioBase64 === null) {
		socket.emit(AI_PROCESSING_REQUEST, false);
		return null;
	}

	socket.emit(AI_MESSAGE, {
		audio: audioBase64,
		message: ollamaResponse,
	});

	return ollamaResponse;
};
