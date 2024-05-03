import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { AiConnectType } from "../../types/socket/AiConnectType";
import { onCaiAuth } from "./caiManager";
import { onOllamaAuth } from "./ollamaManager";

export const onAiConnect = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	arg: AiConnectType
) => {
	const { cai_base_url, ollama_base_url, ollama_model_name } = arg;

	await onOllamaAuth(socket, ollama_model_name, ollama_base_url);

	await onCaiAuth(socket, cai_base_url);
};
