import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { isPlaying, start } from "./audioManager";
import { fetchTTS } from "../services/elevenlabs/elevenlabsApiService";
import { isRaided } from "./raidManager";
import { sendChat } from "../services/ollama/ollamaApiService";
import { AI_MESSAGE, AI_PROCESSING_REQUEST } from "../../socket/AiEvents";

export const startInteractionAudioOnly = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	text: string
) => {
	if (isPlaying()) return;
	start();
	socket.emit(AI_PROCESSING_REQUEST, true);

	const audioBase64 = await fetchTTS(text);
	if (audioBase64 == null) {
		socket.emit(AI_PROCESSING_REQUEST, false);
		return;
	}

	socket.emit(AI_MESSAGE, {
		audio: audioBase64,
		message: text,
	});
};

export const startInteraction = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	text: string,
	username: string,
	bypassIsRaid: boolean = false
) => {
	if (isPlaying() || (isRaided() && !bypassIsRaid)) return null;
	start();
	socket.emit(AI_PROCESSING_REQUEST, true);

	const ollamaResponse = await sendChat(`This message was sent by ${username}: ${text}`);
	if (ollamaResponse == null) {
		socket.emit(AI_PROCESSING_REQUEST, false);
		return null;
	}

	const audioBase64 = await fetchTTS(ollamaResponse);
	if (audioBase64 == null) {
		socket.emit(AI_PROCESSING_REQUEST, false);
		return null;
	}

	socket.emit(AI_MESSAGE, {
		audio: audioBase64,
		message: ollamaResponse,
	});

	return ollamaResponse;
};
