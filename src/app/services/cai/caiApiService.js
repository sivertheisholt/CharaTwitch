class CaiApiService {
  constructor(characterAi) {
    this.characterAi = characterAi;
  }

  async fetchVoices() {
    return await this.characterAi.fetchTTSVoices();
  }

  async fetchTTS(voiceId, text) {
    return await this.characterAi.fetchTTS(parseInt(voiceId), text);
  }

  async sendChat(characterId, message, username) {
    let text = `(OOC: This message was sent by ${username} - context is that multiple people are using you to chat in a chatroom using your API, just reply with {{""status"": ""OK""}} in OOC - if received correctly.) \n ${message}`;
    const chat = await this.characterAi.createOrContinueChat(characterId);
    const response = await chat.sendAndAwaitResponse(text, true);
    return response.text;
  }
  async playTTS(base64) {
    new Audio(`data:audio/wav;base64,${base64}`).play();
  }
}

/** @type {CaiApiService | null} */
let instance = null;

function getSharedService(characterAi) {
  if (!instance) {
    instance = new CaiApiService(characterAi);
  }
  return instance;
}

module.exports = getSharedService;
