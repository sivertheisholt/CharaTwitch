import axios from "axios";
import { getItem } from "../config/configService";
import { logger } from "../../logging/logger";
import { Body } from "react-bootstrap/lib/Media";

const axiosClient = async () => {
	const elevenlabsBaseUrl = "https://api.elevenlabs.io/v1";
	const elevenlabsApiKey = await getItem("elevenlabs_api_key");
	return axios.create({
		baseURL: elevenlabsBaseUrl,
		timeout: 60000,
		signal: AbortSignal.timeout(65000),
		headers: {
			"Content-Type": "application/json",
			"xi-api-key": elevenlabsApiKey,
		},
	});
};

export const fetchVoices = async () => {
	const client = await axiosClient();
	const res = await client.get("/voices");
	if (res.status != 200) return null;
	console.log(res);
	return res.data.voices;
};

export const fetchTTSBase64 = async (text: string) => {
	const client = await axiosClient();
	const voiceId = await getItem("elevenlabs_selected_voice");
	return client
		.post(
			`/text-to-speech/${voiceId}`,
			{ text: text },
			{
				responseType: "arraybuffer", // to receive response as ArrayBuffer
			}
		)
		.then((response) => {
			if (response.status != 200) return null;
			const audioBuffer = Buffer.from(response.data, "binary");
			const base64String = audioBuffer.toString("base64");
			console.log(base64String);
			return base64String;
		})
		.catch((error) => {
			console.error("Error:", error);
			return null;
		});
};
