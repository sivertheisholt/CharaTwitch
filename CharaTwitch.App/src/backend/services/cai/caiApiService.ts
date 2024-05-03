import axios from "axios";
import { getItem } from "../config/configService";
import { logger } from "../../logging/logger";

const axiosClient = async () => {
	const caiAccessToken = await getItem("cai_access_token");
	const caiBaseUrl = await getItem("cai_base_url");
	return axios.create({
		baseURL: caiBaseUrl,
		timeout: 30000,
		signal: AbortSignal.timeout(35000),
		headers: {
			"Content-Type": "application/json",
			Authorization: caiAccessToken,
		},
	});
};

export const checkServer = async () => {
	try {
		const client = await axiosClient();
		const res = await client.get("/health");
		if (res.status != 200) return false;
		return true;
	} catch (err) {
		logger.error(err, "Could not check server");
		return false;
	}
};

export const fetchVoices = async () => {
	try {
		const client = await axiosClient();
		const res = await client.get("/voices");
		if (res.status != 200) return null;
		return res.data;
	} catch (err) {
		logger.error(err, "Could not fetch voices");
		return null;
	}
};

export const fetchTTS = async (text: string) => {
	try {
		const selectedVoice = await getItem("cai_selected_voice");
		const client = await axiosClient();
		const res = await client.post("/tts", {
			voice_id: parseInt(selectedVoice),
			text: text,
		});
		if (res.status != 200) return null;
		return res.data;
	} catch (err) {
		logger.error(err, "Could not fetch TTS");
		return null;
	}
};
