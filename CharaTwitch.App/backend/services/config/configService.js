const storage = require("node-persist");

const initStorage = () => {
	storage.init(/* options ... */);
};

const initializeConfig = async (configObject) => {
	const initializedConfig = {};
	for (const key of Object.keys(configObject)) {
		switch (key) {
			case "cai_use_plus":
				initializedConfig[key] =
					configObject[key] === undefined ? false : configObject[key];
				break;
			case "cai_selected_voice":
				initializedConfig[key] = configObject[key] === undefined ? 0 : configObject[key];
				break;
			default:
				initializedConfig[key] = configObject[key] === undefined ? "" : configObject[key];
		}
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

const getTwitchConfig = async () => {
	const configObject = {
		client_id: await storage.getItem("twitch_client_id"),
		client_secret: await storage.getItem("twitch_client_secret"),
		trigger_word: await storage.getItem("twitch_trigger_word"),
		listen_to_trigger_word: await storage.getItem("twitch_listen_to_trigger_word"),
		selected_redeem: await storage.getItem("twitch_selected_redeem"),
	};
	return await initializeConfig(configObject);
};

const setCaiConfig = async (accessToken, characterId, usePlus) => {
	await storage.setItem("cai_access_token", accessToken);
	await storage.setItem("cai_character_id", characterId);
	await storage.setItem("cai_use_plus", usePlus);
};

const getCaiConfig = async () => {
	const configObject = {
		access_token: await storage.getItem("cai_access_token"),
		character_id: await storage.getItem("cai_character_id"),
		use_plus: await storage.getItem("cai_use_plus"),
		selected_voice: await storage.getItem("cai_selected_voice"),
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
