import axios from "axios";
import { getItem } from "../config/configService";
import { logger } from "../../logging/logger";
import { Buffer } from "buffer";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
	const binary = Buffer.from(buffer).toString("base64");
	return binary;
}

const axiosClient = async () => {
	const coquiBaseUrl = await getItem("coqui_base_url");

	const source = axios.CancelToken.source();
	setTimeout(() => {
		source.cancel("Operation timed out");
	}, 65000);

	return axios.create({
		baseURL: coquiBaseUrl,
		timeout: 60000,
		responseType: "arraybuffer",
		cancelToken: source.token,
	});
};

export const fetchTTS = async (text: string) => {
	try {
		const client = await axiosClient();
		const response = await client.get(`/api/tts?text=${encodeURIComponent(text)}&speaker_id=p376`);
		const base64String = arrayBufferToBase64(response.data);
		return base64String;
	} catch (err) {
		logger.error(err, "Could not fetch TTS");
		return null;
	}
};
