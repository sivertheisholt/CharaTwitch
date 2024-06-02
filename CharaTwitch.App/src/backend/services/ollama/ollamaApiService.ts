import axios from "axios";
import { getItem, getOllamaParameters } from "../config/configService";
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

export const sendChat = async (message: string) => {
	try {
		const modelName = await getItem("ollama_model_name");
		const client = await axiosClient();
		const ollama_parameters = await getOllamaParameters();
		const res = await client.post("/api/generate", {
			model: modelName,
			prompt: message,
			stream: false,
			options: ollama_parameters,
		});
		if (res.status != 200) return null;
		return res.data.response;
	} catch (err) {
		logger.error(err, "Could not send chat");
		return null;
	}
};
