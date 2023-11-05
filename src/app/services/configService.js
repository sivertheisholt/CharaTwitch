const localdb = require("node-persist");

class ConfigService {
  constructor() {
    this.storage = localdb;
    this.init = localdb.init();
  }

  setCaiConfig(caiAccessToken, caiCharacterId, caiUsePlus, caiSelectedVoice) {
    this.storage.setItem("cai_access_token", caiAccessToken);
    this.storage.setItem("cai_character_id", caiCharacterId);
    this.storage.setItem("cai_use_plus", caiUsePlus);
    this.storage.setItem("cai_selected_voice", caiSelectedVoice);
  }

  setCaiSelectedVoice(caiSelectedVoice) {
    this.storage.setItem("cai_selected_voice", caiSelectedVoice);
  }

  async getCaiConfig() {
    await this.init;
    const accessTokenPromise = this.storage.getItem("cai_access_token");
    const characterIdPromise = this.storage.getItem("cai_character_id");
    const usePlusPromise = this.storage.getItem("cai_use_plus");
    const selectedVoicePromise = this.storage.getItem("cai_selected_voice");

    const [accessToken, characterId, usePlus, selectedVoice] =
      await Promise.all([
        accessTokenPromise,
        characterIdPromise,
        usePlusPromise,
        selectedVoicePromise,
      ]);

    return {
      accessToken,
      characterId,
      usePlus,
      selectedVoice,
    };
  }

  setTwitchConfig(
    twitchClientSecret,
    twitchClientId,
    twitchTriggerWord,
    twitchListenToTrigger,
    twitchSelectedReward
  ) {
    this.storage.setItem("twitch_client_secret", twitchClientSecret);
    this.storage.setItem("twitch_client_id", twitchClientId);
    this.storage.setItem("twitch_trigger_word", twitchTriggerWord);
    this.storage.setItem("twich_listen_to_trigger", twitchListenToTrigger);
    this.storage.setItem("twitch_selected_reward", twitchSelectedReward);
  }

  setTwitchSelectedReward(twitchSelectedReward) {
    this.storage.setItem("twitch_selected_reward", twitchSelectedReward);
  }

  async getTwitchConfig() {
    await this.init;
    const clientSecretPromise = this.storage.getItem("twitch_client_secret");
    const clientIdPromise = this.storage.getItem("twitch_client_id");
    const triggerWordPromise = this.storage.getItem("twitch_trigger_word");
    const listenToTriggerWordPromise = this.storage.getItem(
      "twich_listen_to_trigger"
    );
    const selectedRewardPromise = this.storage.getItem(
      "twitch_selected_reward"
    );

    const [
      clientSecret,
      clientId,
      triggerWord,
      listenToTriggerWord,
      selectedReward,
    ] = await Promise.all([
      clientSecretPromise,
      clientIdPromise,
      triggerWordPromise,
      listenToTriggerWordPromise,
      selectedRewardPromise,
    ]);

    return {
      clientSecret,
      clientId,
      triggerWord,
      listenToTriggerWord,
      selectedReward,
    };
  }
}

let instance = null;

function getSharedService() {
  if (!instance) {
    instance = new ConfigService();
  }
  return instance;
}

module.exports = getSharedService;
