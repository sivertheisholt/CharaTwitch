async function playTTS(characterAi, voiceId, text) {
  try {
    var res = await characterAi.fetchTTS(parseInt(voiceId), text);
    new Audio(`data:audio/wav;base64,${res}`).play();
  } catch (error) {
    console.log(error);
  }
}

async function sendChat(characterAi, characterId, message, username) {
  let text = `(OOC: This message was sent by ${username} - context is that multiple people are using you to chat in a chatroom using your API, just reply with {{""status"": ""OK""}} in OOC - if received correctly.) \n ${message}`;
  const chat = await characterAi.createOrContinueChat(characterId);
  const response = await chat.sendAndAwaitResponse(text, true);
  return response.text;
}

async function fetchVoices(characterAi)
{
  return await characterAi.fetchTTSVoices();
}

module.exports = { playTTS, sendChat, fetchVoices };
