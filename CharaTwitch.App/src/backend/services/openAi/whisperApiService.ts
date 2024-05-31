import axios from "axios";
import { getItem } from "../config/configService";

const WHISPER_API_URL = "https://api.openai.com/v1/audio/transcriptions";

const axiosClient = async () => {
	return axios.create({
		baseURL: WHISPER_API_URL,
		timeout: 16000,
		signal: AbortSignal.timeout(16500),
		headers: {
			Authorization: "Bearer ",
			"Content-Type": "multipart/form-data",
		},
	});
};

// Function to transcribe audio using Whisper
export const transcribeAudio = async (blob: Blob[]): Promise<string> => {
	try {
		// Decode the base64 audio to binary
		const audioBlob = new Blob(blob, { type: "audio/wav" });
		audioBlob
			.arrayBuffer()
			.then((buffer) => {
				const base64data = Buffer.from(buffer).toString("base64");
				console.log(base64data);
			})
			.catch((err) => {
				console.error("Error converting Blob to base64:", err);
			});
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
