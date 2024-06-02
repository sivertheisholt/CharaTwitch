import axios from "axios";
import { getItem } from "../config/configService";

const WHISPER_API_URL = "https://api.openai.com/v1/audio/transcriptions";

const axiosClient = async () => {
	let apiKey = await getItem("openai_api_key");
	return axios.create({
		baseURL: WHISPER_API_URL,
		timeout: 16000,
		signal: AbortSignal.timeout(16500),
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "multipart/form-data",
		},
	});
};

// Function to transcribe audio using Whisper
export const transcribeAudio = async (blob: Blob[]): Promise<string> => {
	try {
		// Decode the base64 audio to binary
		const audioBlob = new Blob(blob, { type: "audio/wav" });
		const client = await axiosClient();

		const form = new FormData();

		form.append("file", audioBlob, "audio.wav");
		form.append("model", "whisper-1");
		form.append("language", "en");

		// Send the audio file to the Whisper API as binary data
		const response = await client.post(WHISPER_API_URL, form);

		if (response.status !== 200) {
			return null;
		}

		return response.data.text;
	} catch (error) {
		console.error("Error transcribing audio:", error);
		return null;
	}
};
