async function playTTS(characterAi, text) {
  try {
    var res = await characterAi.fetchTTS(22, text);
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

module.exports = { playTTS, sendChat };
