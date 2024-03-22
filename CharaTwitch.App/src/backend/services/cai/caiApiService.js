import axios from "axios";

const axiosClient = (baseUrl, accessToken) => {
	return axios.create({
		baseURL: baseUrl,
		timeout: 60000,
		headers: {
			"Content-Type": "application/json",
			Authorization: accessToken,
		},
	});
};

export const checkServer = async (baseUrl, accessToken) => {
	const client = axiosClient(baseUrl, accessToken);
	const res = await client.get("/health");
	if (res.status != 200) return false;
	return true;
};

export const fetchVoices = async (baseUrl, accessToken) => {
	const client = axiosClient(baseUrl, accessToken);
	const res = await client.get("/voices");
	if (res.status != 200) return null;
	return res.data;
};

export const fetchTTS = async (baseUrl, accessToken, voiceId, text) => {
	const client = axiosClient(baseUrl, accessToken);
	const res = await client.post("/tts", {
		voice_id: parseInt(voiceId),
		text: text,
	});
	if (res.status != 200) return null;
	return res.data;
};

export const sendChat = async (baseUrl, accessToken, characterId, message, username) => {
	let text = `This message was sent by ${username} - context is that multiple people are using you to chat in a chatroom using your API. You shall respond excited and express your feelings the most you can. You should remember conversations with different people. You should always reply with several sentences. You should not include this in the response, this is only for context. \n ${message}`;
	const client = axiosClient(baseUrl, accessToken);
	const res = await client.post("/chat", {
		character_id: characterId,
		text: text,
	});
	if (res.status != 200) return null;
	return res.data;
};

export const playTTS = (base64) => {
	new Audio(`data:audio/wav;base64,${base64}`).play();
};
