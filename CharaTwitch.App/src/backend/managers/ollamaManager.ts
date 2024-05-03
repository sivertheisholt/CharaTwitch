import { Socket } from "socket.io/dist/socket";
import { setOllamaConfig } from "../services/config/configService";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { OLLAMA_STATUS } from "../../socket/OllamaEvents";

export const onOllamaAuth = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	ollamaModelName: string,
	ollamaBaseUrl: string
) => {
	await setOllamaConfig(ollamaModelName, ollamaBaseUrl);
	socket.emit(OLLAMA_STATUS, true);
};
