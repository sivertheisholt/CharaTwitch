import { init, setItem as _setItem, getItem as _getItem } from "node-persist";

export const initStorage = () => {
	init(/* options ... */);
};

export const initializeConfig = async (configObject) => {
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

export const setItem = async (key, data) => {
	await _setItem(key, data);
};

export const getItem = async (key) => {
	return await _getItem(key);
};

export const setTwitchConfig = async (clientId, clientSecret) => {
	await _setItem("twitch_client_id", clientId);
	await _setItem("twitch_client_secret", clientSecret);
};

export const getTwitchConfig = async () => {
	const configObject = {
		client_id: await _getItem("twitch_client_id"),
		client_secret: await _getItem("twitch_client_secret"),
		listen_to_trigger_word: await _getItem("twitch_listen_to_trigger_word"),
		selected_redeem: await _getItem("twitch_selected_redeem"),
	};
	return await initializeConfig(configObject);
};

export const setCaiConfig = async (accessToken, characterId, baseUrl) => {
	await _setItem("cai_access_token", accessToken);
	await _setItem("cai_character_id", characterId);
	await _setItem("cai_base_url", baseUrl);
};

export const getCaiConfig = async () => {
	const configObject = {
		access_token: await _getItem("cai_access_token"),
		character_id: await _getItem("cai_character_id"),
		use_plus: await _getItem("cai_use_plus"),
		selected_voice: await _getItem("cai_selected_voice"),
		base_url: await _getItem("cai_base_url"),
	};
	return await initializeConfig(configObject);
};
