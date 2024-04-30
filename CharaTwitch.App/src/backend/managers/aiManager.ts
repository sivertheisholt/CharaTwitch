import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { AiConnectType } from "../../types/socket/AiConnectType";
import { onElevenlabsConnect } from "./elevenlabsManager";
import { onOllamaSave } from "./ollamaManager";
import { AI_CONNECTED } from "../../socket/AiEvents";
import { ELEVENLABS_VOICES } from "../../socket/ElevenlabsEvents";

export const onAiConnect = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	arg: AiConnectType
) => {
	const { elevenlabs_api_key, ollama_base_url, ollama_model_name } = arg;

	await onOllamaSave(ollama_model_name, ollama_base_url);

	const voices = await onElevenlabsConnect(elevenlabs_api_key);

	socket.emit(ELEVENLABS_VOICES, voices);
	socket.emit(AI_CONNECTED, true);
};
