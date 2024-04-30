import { setOllamaConfig } from "../services/config/configService";

export const onOllamaSave = async (ollamaModelName: string, ollamaBaseUrl: string) => {
	await setOllamaConfig(ollamaModelName, ollamaBaseUrl);
};
