import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { AiConnectType } from "../../types/socket/AiConnectType";
import { onOllamaSave } from "./ollamaManager";
import { AI_CONNECTED } from "../../socket/AiEvents";
import { onAuthCai } from "../services/cai/caiAuthService";
import { fetchVoices } from "../services/cai/caiApiService";
import { getItem, setCaiConfig } from "../services/config/configService";
import { CAI_VOICES } from "../../socket/CaiEvents";

export const onAiConnect = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	arg: AiConnectType
) => {
	const { cai_base_url, ollama_base_url, ollama_model_name } = arg;

	await onOllamaSave(ollama_model_name, ollama_base_url);

	const cai_access_token = await onAuthCai();
	if (cai_access_token == null) return;

	await setCaiConfig(cai_access_token, cai_base_url);

	const test = await getItem("cai_base_url");
	console.log(test);

	const voices = await fetchVoices();

	socket.emit(CAI_VOICES, voices);
	socket.emit(AI_CONNECTED, true);
};
