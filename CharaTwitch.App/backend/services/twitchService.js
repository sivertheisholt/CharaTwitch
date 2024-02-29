const twitchIrcService = require("./twitchIrcService");

const twitchApiService = require("./twitchApiService");

const twitchPubSubService = require("./twitchPubSubService");

class TwitchService {
  constructor(onMessageCb, onRewardCb) {
    this.twitchcIrcService = twitchIrcService(onMessageCb);
    this.twitchPubSubService = twitchPubSubService(onRewardCb);
    this.twitchApiService = twitchApiService();
    this.onRewardCb = onRewardCb;
  }

  async authTwitch(accessToken, clientId) {
    const userInfo = await this.twitchApiService.getUserInfo(accessToken);

    this.twitchcIrcService.connectToTwitchIrc(
      accessToken,
      userInfo.preferred_username
    );

    const rewards = await this.twitchApiService.getCustomRewards(
      userInfo.sub,
      clientId,
      accessToken
    );

    await this.twitchPubSubService.connectToTwitchPubSub();
    await this.twitchPubSubService.subscribeToChannelPoints(
      accessToken,
      userInfo.sub
    );
    await this.twitchPubSubService.listenToRewardRedeem((redeemData) =>
      this.onRewardCb(redeemData)
    );

    return {
      rewards: rewards,
    };
  }
}

/** @type {TwitchService | null} */
let instance = null;

function getSharedService(onMessageCb, onRewardCb) {
  if (!instance) {
    instance = new TwitchService(onMessageCb, onRewardCb);
  }
  return instance;
}

module.exports = getSharedService;
