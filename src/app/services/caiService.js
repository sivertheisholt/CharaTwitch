const CharacterAI = require("node_characterai");

class CaiService {
  constructor() {
    this.characterAi = new CharacterAI();
  }

  getCharacterAi() {
    return this.characterAi;
  }

  async fetchVoices(characterAi) {
    return await characterAi.fetchTTSVoices();
  }

  async playTTS(characterAi, voiceId, text) {
    try {
      var res = await characterAi.fetchTTS(parseInt(voiceId), text);
      new Audio(`data:audio/wav;base64,${res}`).play();
    } catch (error) {
      console.log(error);
    }
  }

  async sendChat(characterAi, characterId, message, username) {
    let text = `(OOC: This message was sent by ${username} - context is that multiple people are using you to chat in a chatroom using your API, just reply with {{""status"": ""OK""}} in OOC - if received correctly.) \n ${message}`;
    const chat = await characterAi.createOrContinueChat(characterId);
    const response = await chat.sendAndAwaitResponse(text, true);
    return response.text;
  }
}

let instance = null;

function getSharedService() {
  if (!instance) {
    instance = new CaiService();
  }
  return instance;
}

module.exports = getSharedService;
