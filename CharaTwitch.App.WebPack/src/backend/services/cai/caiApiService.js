export const fetchVoices = async (characterAi) => {
	return await characterAi.fetchTTSVoices();
};

export const fetchTTS = async (characterAi, voiceId, text) => {
	return await characterAi.fetchTTS(parseInt(voiceId), text);
};

export const sendChat = async (chat, message, username) => {
	let text = `(OOC: This message was sent by ${username} - context is that multiple people are using you to chat in a chatroom using your API, just reply with {{""status"": ""OK""}} in OOC - if received correctly.) \n ${message}`;
	const response = await chat.sendAndAwaitResponse(text, true);
	return response.text;
};

export const playTTS = (base64) => {
	new Audio(`data:audio/wav;base64,${base64}`).play();
};

export const initChat = async (characterAi, characterId) => {
	return await characterAi.createOrContinueChat(characterId);
};
