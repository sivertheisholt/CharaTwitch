import axios from "axios";
import { getItem } from "../config/configService";
import { logger } from "../../logging/logger";

const axiosClient = async () => {
	const elevenlabsBaseUrl = "https://api.elevenlabs.io/v1";
	const elevenlabsApiKey = await getItem("elevenlabs_api_key");
	return axios.create({
		baseURL: elevenlabsBaseUrl,
		timeout: 60000,
		signal: AbortSignal.timeout(65000),
		headers: {
			"Content-Type": "application/json",
			"Xi-Api-Key": elevenlabsApiKey,
		},
	});
};

export const fetchVoices = async () => {
	return "";
};

export const fetchTTS = async (text: string) => {
	return "";
};
