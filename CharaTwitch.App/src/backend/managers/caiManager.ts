import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
	fetchVoices,
	checkServer,
	sendChat,
	fetchTTS,
} from "../services/cai/caiApiService";
import { setCaiConfig } from "../services/config/configService";
import { Socket } from "socket.io/dist/socket";
import { isPlaying, start } from "./audioManager";
import { CAI_PROCESSING_REQUEST } from "../../socket/Events";
import { authCai } from "../services/cai/caiAuthService";
import { isRaided } from "./raidManager";

export const onCaiAuth = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	arg: any
) => {
	const { character_id, base_url } = arg;

	const access_token = await authCai();
	if (access_token == null) return socket.emit("caiAuthCb", null);

	await setCaiConfig(access_token, character_id, base_url);

	const res = await checkServer();
	if (!res) return socket.emit("caiAuthCb", null);

	const voices = await fetchVoices();
	if (voices == null) return socket.emit("caiAuthCb", null);

	socket.emit("caiAuthCb", {
		voices: voices,
	});
	socket.emit("caiAccountStatus", true);
};

export const startInteractionAudioOnly = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	message: string
) => {
	if (isPlaying()) return;
	start();
	socket.emit(CAI_PROCESSING_REQUEST, true);

	const audioBase64 = await fetchTTS(message);
	if (audioBase64 == null) {
		socket.emit(CAI_PROCESSING_REQUEST, false);
		return;
	}

	socket.emit("caiMessage", {
		audio: audioBase64,
		message: message,
	});
};

export const startInteraction = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	message: string,
	bypassIsRaid: boolean = false
) => {
	console.log("Running interaction");
	if (isPlaying() || (isRaided() && !bypassIsRaid)) return null;
	start();
	socket.emit(CAI_PROCESSING_REQUEST, true);

	const caiResponse = await sendChat(message);
	if (caiResponse == null) {
		socket.emit(CAI_PROCESSING_REQUEST, false);
		return null;
	}

	const audioBase64 = await fetchTTS(caiResponse);
	if (audioBase64 == null) {
		socket.emit(CAI_PROCESSING_REQUEST, false);
		return null;
	}

	socket.emit("caiMessage", {
		audio: audioBase64,
		message: caiResponse,
	});

	return caiResponse;
};
