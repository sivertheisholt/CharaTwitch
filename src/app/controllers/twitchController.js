const twitchIrcService = require("../../app/services/twitchIrcService");
const twitchApiService = require("../../app/services/twitchApiService");
const caiService = require("../../app/services/caiService");
const authService = require("../../app/services/authService");
const configService = require("../../app/services/configService");
const expressService = require("../../app/services/expressService");
const twitchPubSubService = require("../../app/services/twitchPubSubService");

class TwitchController {
  constructor(twitchView, caiView) {
    this.twitchView = twitchView;
    this.caiView = caiView;

    this.twitchcIrcService = twitchIrcService((username, message) =>
      this.onMessageHandler(username, message)
    );
    this.twitchPubSubService = twitchPubSubService((data) =>
      this.onRewardHandler(data)
    );

    this.authService = authService();
    this.configService = configService();
    this.expressService = expressService();
    this.caiService = caiService();
    this.twitchApiService = twitchApiService();

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
    const userInfo = await this.twitchApiService.getUserInfo(accessToken);

    const twitchInputs = this.twitchView.getTwitchInputs();
    this.configService.setTwitchConfig(
      twitchInputs.clientSecret,
      twitchInputs.clientId,
      twitchInputs.triggerWord,
      twitchInputs.listenToTriggerWord
    );

    this.twitchcIrcService.connectToTwitchIrc(
      accessToken,
      userInfo.preferred_username
    );

    const rewards = await this.twitchApiService.getCustomRewards(
      userInfo.sub,
      twitchInputs.clientId,
      accessToken
    );
    this.twitchView.fillRewards(rewards);

    await this.twitchPubSubService.connectToTwitchPubSub();
    await this.twitchPubSubService.subscribeToChannelPoints(
      accessToken,
      userInfo.sub
    );
    await this.twitchPubSubService.listenToRewardRedeem((redeemData) =>
      this.onRewardHandler(redeemData)
    );

    this.twitchView.updateTwitchAuthSuccess();
  }

  async onMessageHandler(username, message) {
    this.twitchView.addTwitchChat(username, message);

    message = message.toLowerCase();

    if (message.indexOf(this.twitchView.twitchTriggerWord.value) === -1) return;

    let result = await this.caiService.sendChat(
      this.caiService.characterAi,
      this.caiView.caiCharacterIdInput.value,
      message,
      username
    );

    this.caiView.addCaiChat(result);

    await this.caiService.playTTS(
      this.caiService.characterAi,
      this.caiView.caiSelectedVoice,
      result
    );
  }

  async onRewardHandler(redeemData) {
    console.log(redeemData);
    if (redeemData.type !== "reward-redeemed") return;

    const redemption = redeemData.data.redemption;
    const reward = redemption.reward;

    console.log(this.twitchView.twitchSelectedReward);
    console.log(reward.id);

    if (redemption.user_input == undefined) return;

    if (reward.id !== this.twitchView.twitchSelectedReward) return;

    const userDisplayName = redemption.user.display_name;
    const userInput = redemption.user_input;

    console.log(userInput);

    let result = await this.caiService.sendChat(
      this.caiService.characterAi,
      this.caiView.caiCharacterIdInput.value,
      userInput,
      userDisplayName
    );

    this.caiView.addCaiChat(result);

    await this.caiService.playTTS(
      this.caiService.characterAi,
      this.caiView.caiSelectedVoice,
      result
    );
  }
}

module.exports = TwitchController;
