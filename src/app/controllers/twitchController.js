const twitchIrcService = require("../../app/services/twitchIrcService");
const caiService = require("../../app/services/caiService");
const authService = require("../../app/services/authService");
const configService = require("../../app/services/configService");
const expressService = require("../../app/services/expressService");

class TwitchController {
  constructor(twitchView, caiView) {
    this.twitchView = twitchView;
    this.caiView = caiView;

    this.twitchcIrcService = twitchIrcService();
    this.authService = authService();
    this.configService = configService();
    this.expressService = expressService();
    this.caiService = caiService();
  }

  initActions() {
    const twitchConfig = this.twitchView.getTwitchAuthInputs;
    this.twitchView.twitchBtn.addEventListener("click", () => {
      this.authService.authTwitch(
        this.expressService.getApp(),
        twitchConfig.clientSecret,
        twitchConfig.clientId,
        this.authCallback
      );
    });
  }

  authCallback(success, tokenObj) {
    if (success) {
      this.configService.setTwitchConfig(
        this.twitchClientSecretInput.value,
        this.twitchClientIdInput.value,
        this.twitchUsername.value,
        this.twitchTriggerWord.value,
        this.twitchListenToTrigger.checked
      );
      this.twitchcIrcService.connectToTwitchIrc(
        tokenObj.access_token,
        this.twitchUsername.value
      );
    } else {
      console.log("Twitch auth failure");
    }
  }

  async onMessageHandler(username, message) {
    if (message.toLowerCase().indexOf(this.twitchView.getTriggerWord) !== -1) {
      let result = await this.cai.sendChat(
        this.caiService.characterAi,
        this.caiView.getCharacterId(),
        message,
        username
      );

      //await caiHandler.playTTS(characterAi, caiSelectedVoice, result);
    }
  }
}

module.exports = TwitchController;
