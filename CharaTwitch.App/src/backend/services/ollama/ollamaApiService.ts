import axios from "axios";
import { getItem } from "../config/configService";
import { logger } from "../../logging/logger";

const axiosClient = async () => {
	const caiBaseUrl = await getItem("ollama_base_url");
	return axios.create({
		baseURL: caiBaseUrl,
		timeout: 100000,
		signal: AbortSignal.timeout(105000),
		headers: {
			"Content-Type": "application/json",
		},
	});
};

export const sendChat = async (messages: Array<{ role: string; content: string }>) => {
	try {
		const modelName = await getItem("ollama_model_name");
		const client = await axiosClient();
		logger.warn(messages);
		const res = await client.post("/api/chat", {
			model: modelName,
			messages: messages,
			stream: false,
		});
		if (res.status != 200) return null;
		return res.data.message.content;
	} catch (err) {
		logger.error(err, "Could not send chat");
		return null;
	}
};
