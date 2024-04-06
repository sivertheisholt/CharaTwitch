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

export const sendChat = async (username: string, message: string) => {
	const caiCharacterId = await getItem("cai_character_id");
	const text = `This message was sent by ${username} - context is that multiple people are using you to chat in a chatroom using your API. You shall respond excited and express your feelings the most you can. You should remember conversations with different people. You should always reply with several sentences. You should not include this in the response, this is only for context. \n ${message}`;
	const client = await axiosClient();
	const res = await client.post("/chat", {
		character_id: caiCharacterId,
		text: text,
	});
	if (res.status != 200) return null;
	return res.data;
};
