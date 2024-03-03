const storage = require("node-persist");

const initStorage = () => {
  storage.init(/* options ... */);
};

const initializeConfig = async (configObject) => {
  const initializedConfig = {};
  for (const key of Object.keys(configObject)) {
    initializedConfig[key] =
      configObject[key] === undefined ? "" : configObject[key];
  }
  return initializedConfig;
};

const setItem = async (key, data) => {
  await storage.setItem(key, data);
};

const getItem = async (key) => {
  return await storage.getItem(key);
};

const setTwitchConfig = async (
  clientId,
  clientSecret,
  triggerWord,
  listenToTriggerWord
) => {
  await storage.setItem("twitch_client_id", clientId);
  await storage.setItem("twitch_client_secret", clientSecret);
  await storage.setItem("twitch_trigger_word", triggerWord);
  await storage.setItem("twitch_listen_to_trigger_word", listenToTriggerWord);
};

const setCaiConfig = async (accessToken, characterId) => {
  await storage.setItem("cai_access_token", accessToken);
  await storage.setItem("cai_character_id", characterId);
};

const getTwitchConfig = async () => {
  const configObject = {
    client_id: await storage.getItem("twitch_client_id"),
    client_secret: await storage.getItem("twitch_client_secret"),
    trigger_word: await storage.getItem("twitch_trigger_word"),
    listen_to_trigger_word: await storage.getItem(
      "twitch_listen_to_trigger_word"
    ),
  };
  return await initializeConfig(configObject);
};
const getCaiConfig = async () => {
  const configObject = {
    access_token: await storage.getItem("cai_access_token"),
    character_id: await storage.getItem("cai_character_id"),
  };
  return await initializeConfig(configObject);
};
module.exports = {
  initStorage,
  setItem,
  getItem,
  setTwitchConfig,
  setCaiConfig,
  getTwitchConfig,
  getCaiConfig,
};
