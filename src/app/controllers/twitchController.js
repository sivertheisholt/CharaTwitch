/**
 * @typedef {import("../services/twitch/TwitchService")} TwitchService
 */
const twitchService = require("../services/twitch/TwitchService");
/**
 * @typedef {import("../services/cai/caiService")} CaiService
 */
const caiService = require("../services/cai/caiService");
/**
 * @typedef {import("../services/authService")} AuthService
 */
const authService = require("../services/authService");
/**
 * @typedef {import("../services/configService")} ConfigService
 */
const configService = require("../services/configService");
/**
 * @typedef {import("../services/expressService")} ExpressService
 */
const expressService = require("../services/expressService");

class TwitchController {
  /**
   * @typedef {import("../views/twitchView")} TwitchView
   * @param {TwitchView} twitchView
   * @typedef {import("../views/caiView")} CaiView
   * @param {CaiView} caiView
   */
  constructor(twitchView, caiView) {
    this.twitchView = twitchView;

    this.caiView = caiView;

    this.authService = authService();
    this.configService = configService();
    this.expressService = expressService();
    this.caiService = caiService();
    this.twitchService = twitchService(
      (username, message) => {
        this.onMessageHandler(username, message);
      },
      (data) => this.onRewardHandler(data)
    );

    this.init();
  }

  init() {
    this.twitchView.twitchBtn.addEventListener("click", () => {
      const twitchConfig = this.twitchView.getTwitchAuthInputs();
      this.authService.authTwitch(
        this.expressService.app,
        twitchConfig.clientSecret,
        twitchConfig.clientId,
        (success, token) => this.authCallback(success, token)
      );
    });
  }

  async authCallback(success, tokenObj) {
    if (!success) return console.log("Could not auth twitch");

    const accessToken = tokenObj.access_token;
    const twitchInputs = this.twitchView.getTwitchInputs();

    const authResult = await this.twitchService.authTwitch(
      accessToken,
      twitchInputs.clientId
    );

    this.twitchView.fillRewards(authResult.rewards);

    this.configService.setTwitchConfig(
      twitchInputs.clientSecret,
      twitchInputs.clientId,
      twitchInputs.triggerWord,
      twitchInputs.listenToTriggerWord
    );

    this.twitchView.updateTwitchAuthSuccess();
  }

  async onMessageHandler(username, message) {
    this.twitchView.addTwitchChat(username, message);

    message = message.toLowerCase();

    if (message.indexOf(this.twitchView.twitchTriggerWord.value) === -1) return;

    const result = await this.caiService.sendChat(
      message,
      username,
      this.caiView.caiCharacterIdInput.value
    );

    const resultTTS = await this.caiService.getTTS(
      result,
      this.caiView.caiSelectedVoice
    );

    await this.caiService.playTTS(resultTTS);

    this.caiView.addCaiChat(result);
  }

  async onRewardHandler(redeemData) {
    if (redeemData.type !== "reward-redeemed") return;

    const redemption = redeemData.data.redemption;
    const reward = redemption.reward;

    if (redemption.user_input == undefined) return;

    if (reward.id !== this.twitchView.twitchSelectedReward) return;

    const userDisplayName = redemption.user.display_name;
    const userInput = redemption.user_input;

    const result = await this.caiService.sendChat(
      userInput,
      userDisplayName,
      this.caiView.caiCharacterIdInput.value
    );

    const resultTTS = await this.caiService.getTTS(
      result,
      this.caiView.caiSelectedVoice
    );

    await this.caiService.playTTS(resultTTS);

    this.caiView.addCaiChat(result);
  }
}

module.exports = TwitchController;
