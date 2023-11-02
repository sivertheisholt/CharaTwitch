const storage = require("node-persist");

class ConfigService {
  constructor() {
    storage.init();
  }

  setCaiConfig(caiAccessToken, caiCharacterId, caiUsePlus, caiSelectedVoice) {
    storage.setItem("cai_access_token", caiAccessToken);
    storage.setItem("cai_character_id", caiCharacterId);
    storage.setItem("cai_use_plus", caiUsePlus);
    storage.setItem("cai_selected_voice", caiSelectedVoice);
  }
  getCaiAccessToken() {
    return storage.getItem("cai_access_token");
  }
  getCaiCharacterId() {
    return storage.getItem("cai_character_id");
  }
  getCaiUsePlus() {
    return storage.getItem("cai_use_plus");
  }
  getCaiSelectedVoice() {
    return storage.getItem("cai_selected_voice");
  }
  setTwitchConfig(
    twitchClientSecret,
    twitchClientId,
    twitchUsername,
    twitchTriggerWord,
    twitchListenToTrigger
  ) {
    storage.setItem("twitch_client_secret", twitchClientSecret);
    storage.setItem("twitch_client_id", twitchClientId);
    storage.setItem("twitch_username", twitchUsername);
    storage.setItem("twitch_trigger_word", twitchTriggerWord);
    storage.setItem("twich_listen_to_trigger", twitchListenToTrigger);
  }
  getTwitchClientSecret() {
    return storage.getItem("twitch_client_secret");
  }
  getTwitchClientId() {
    return storage.getItem("twitch_client_id");
  }
  getTwitchUsername() {
    return storage.getItem("twitch_username");
  }
  getTwitchTriggerWord() {
    return storage.getItem("twitch_trigger_word");
  }
  getTwitchListenToTrigger() {
    return storage.getItem("twich_listen_to_trigger");
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
