import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { setOllamaConfig } from "../services/config/configService";
import { Socket } from "socket.io/dist/socket";
import { OLLAMA_CONFIG_SAVED } from "../../socket/OllamaEvents";

export const onOllamaSave = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	arg: any
) => {
	const { ollama_model_name, ollama_base_url } = arg;

	await setOllamaConfig(ollama_model_name, ollama_base_url);

	socket.emit(OLLAMA_CONFIG_SAVED);
};
