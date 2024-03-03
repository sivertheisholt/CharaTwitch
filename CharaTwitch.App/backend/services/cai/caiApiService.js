const fetchVoices = async (characterAi) => {
  return await characterAi.fetchTTSVoices();
};

const fetchTTS = async (characterAi, voiceId, text) => {
  return await characterAi.fetchTTS(parseInt(voiceId), text);
};

const sendChat = async (chat, message, username) => {
  let text = `(OOC: This message was sent by ${username} - context is that multiple people are using you to chat in a chatroom using your API, just reply with {{""status"": ""OK""}} in OOC - if received correctly.) \n ${message}`;
  const response = await chat.sendAndAwaitResponse(text, true);
  return response.text;
};

const playTTS = (base64) => {
  new Audio(`data:audio/wav;base64,${base64}`).play();
};

const initChat = async (characterAi, characterId) => {
  return await characterAi.createOrContinueChat(characterId);
};

module.exports = { fetchVoices, fetchTTS, sendChat, playTTS, initChat };
