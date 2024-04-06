import axios from "axios";
import { getItem } from "../config/configService";

const axiosClient = async () => {
	const caiAccessToken = await getItem("cai_access_token");
	const caiBaseUrl = await getItem("cai_base_url");
	return axios.create({
		baseURL: caiBaseUrl,
		timeout: 60000,
		headers: {
			"Content-Type": "application/json",
			Authorization: caiAccessToken,
		},
	});
};

export const checkServer = async () => {
	const client = await axiosClient();
	const res = await client.get("/health");
	if (res.status != 200) return false;
	return true;
};

export const fetchVoices = async () => {
	const client = await axiosClient();
	const res = await client.get("/voices");
	if (res.status != 200) return null;
	return res.data;
};

export const fetchTTS = async (text: string) => {
	const selectedVoice = await getItem("cai_selected_voice");
	const client = await axiosClient();
	const res = await client.post("/tts", {
		voice_id: parseInt(selectedVoice),
		text: text,
	});
	if (res.status != 200) return null;
	return res.data;
};

export const sendChat = async (
	username: string,
	message: string,
	context: string = ""
) => {
	const caiCharacterId = await getItem("cai_character_id");
	if (context == "") {
		context = await getItem("character_context_parameter");
		context = context.replace("${username}", username);
	}
	const text = `${context} \n ${message}`;
	console.log(text);
	const client = await axiosClient();
	const res = await client.post("/chat", {
		character_id: caiCharacterId,
		text: text,
	});
	if (res.status != 200) return null;
	return res.data;
};
