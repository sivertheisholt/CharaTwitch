import axios from "axios";
import { getItem, getOllamaParameters } from "../config/configService";
import { logger } from "../../logging/logger";

const axiosClient = async () => {
	const ollamaBaseUrl = await getItem("ollama_base_url");
	return axios.create({
		baseURL: ollamaBaseUrl,
		timeout: 120000,
		signal: AbortSignal.timeout(125000),
		headers: {
			"Content-Type": "application/json",
		},
	});
};

export const sendChat = async (message: string, systemPrompt: string) => {
	try {
		const modelName = await getItem("ollama_model_name");
		const client = await axiosClient();
		const ollama_parameters: any = await getOllamaParameters();
		logger.warn(message);
		logger.warn(systemPrompt);
		const res = await client.post("/api/chat", {
			model: modelName,
			messages: [
				{
					role: "system",
					content: systemPrompt,
				},
				{
					role: "user",
					content: message,
				},
			],
			stream: false,
			options: ollama_parameters.enable_override ? ollama_parameters : {},
			keep_alive: ollama_parameters.keep_alive,
		});
		if (res.status != 200) return null;
		return res.data.message.content;
	} catch (err) {
		logger.error(err, "Could not send chat");
		return null;
	}
};
