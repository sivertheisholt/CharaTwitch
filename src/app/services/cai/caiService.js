const CharacterAI = require("node_characterai");
/**
 * @typedef {import("./caiApiService")} CaiApiService
 */
const caiApiService = require("./caiApiService");
/**
 * @typedef {import("../authService")} AuthService
 */
const authService = require("../authService");

class CaiService {
  constructor() {
    this.characterAi = new CharacterAI();
    this.characterAi.requester.puppeteerPath = "./chrome-win32/chrome";
    this.caiApiService = caiApiService(this.characterAi);
    this.authService = authService();
  }

  authCai(accessToken, usePlus, authCb) {
    this.authService.authCai(this.characterAi, accessToken, usePlus, authCb);
  }

  async sendChat(message, username, characterId) {
    return await this.caiApiService.sendChat(characterId, message, username);
  }

  async getTTS(message, voiceId) {
    return await this.caiApiService.fetchTTS(voiceId, message);
  }

  async getVoices() {
    return await this.caiApiService.fetchVoices();
  }

  playTTS(base64) {
    this.caiApiService.playTTS(base64);
  }
}

/** @type {CaiService | null} */
let instance = null;

function getSharedService() {
  if (!instance) {
    instance = new CaiService();
  }
  return instance;
}

module.exports = getSharedService;
