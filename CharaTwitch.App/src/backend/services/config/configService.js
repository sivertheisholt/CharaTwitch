import { init, setItem as _setItem, getItem as _getItem } from "node-persist";

export const initStorage = () => {
	let dir =
		process.env.APPDATA ||
		(process.platform == "darwin" ? process.env.HOME + "/Library/Preferences" : process.env.HOME + "/.local/share");

	dir += "/CharaTwitch/config";

	init({
		dir: dir,
	});
};

export const initializeConfig = async (configObject) => {
	const initializedConfig = {};
	for (const key of Object.keys(configObject)) {
		switch (key) {
			case "character_welcome_raiders":
				initializedConfig[key] = configObject[key] === undefined ? false : configObject[key];
				break;
			case "character_welcome_strangers":
				initializedConfig[key] = configObject[key] === undefined ? false : configObject[key];
				break;
			case "character_welcome_new_viewers":
				initializedConfig[key] = configObject[key] === undefined ? false : configObject[key];
				break;
			case "character_random_redeems":
				initializedConfig[key] = configObject[key] === undefined ? false : configObject[key];
				break;
			case "character_random_talking":
				initializedConfig[key] = configObject[key] === undefined ? false : configObject[key];
				break;
			case "character_random_talking_frequency":
				initializedConfig[key] = configObject[key] === undefined ? 5 : configObject[key];
				await _setItem("character_random_talking_frequency", initializedConfig[key]);
				break;
			case "character_random_redeems_frequency":
				initializedConfig[key] = configObject[key] === undefined ? 5 : configObject[key];
				await _setItem("character_random_redeems_frequency", initializedConfig[key]);
				break;
			case "character_minimum_time_between_talking":
				initializedConfig[key] = configObject[key] === undefined ? 0 : configObject[key];
				await _setItem("character_minimum_time_between_talking", initializedConfig[key]);
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

export const setOllamaConfig = async (modelname, baseUrl) => {
	await _setItem("ollama_model_name", modelname);
	await _setItem("ollama_base_url", baseUrl);
};

export const setTwitchConfig = async (clientId, clientSecret) => {
	await _setItem("twitch_client_id", clientId);
	await _setItem("twitch_client_secret", clientSecret);
};

export const setCaiConfig = async (accessToken, baseUrl) => {
	await _setItem("cai_access_token", accessToken);
	await _setItem("cai_base_url", baseUrl);
};

export const getCaiConfig = async () => {
	const configObject = {
		cai_selected_voice: await _getItem("cai_selected_voice"),
		cai_base_url: await _getItem("cai_base_url"),
	};
	return await initializeConfig(configObject);
};

export const getOllamaConfig = async () => {
	const configObject = {
		ollama_model_name: await _getItem("ollama_model_name"),
		ollama_base_url: await _getItem("ollama_base_url"),
	};
	return await initializeConfig(configObject);
};

export const getTwitchConfig = async () => {
	const configObject = {
		twitch_client_id: await _getItem("twitch_client_id"),
		twitch_client_secret: await _getItem("twitch_client_secret"),
		twitch_selected_redeem: await _getItem("twitch_selected_redeem"),
	};
	return await initializeConfig(configObject);
};

export const getCharacterConfig = async () => {
	const configObject = {
		character_selected_redeem: await _getItem("character_selected_redeem"),
		character_question: await _getItem("character_question"),
		character_intro_param: await _getItem("character_intro_param"),
		character_random_redeems: await _getItem("character_random_redeems"),
		character_random_talking: await _getItem("character_random_talking"),
		character_welcome_strangers: await _getItem("character_welcome_raiders"),
		character_welcome_raiders: await _getItem("character_welcome_strangers"),
		character_welcome_new_viewers: await _getItem("character_welcome_new_viewers"),
		character_random_redeems_frequency: await _getItem("character_random_redeems_frequency"),
		character_random_talking_frequency: await _getItem("character_random_talking_frequency"),
		character_minimum_time_between_talking: await _getItem("character_minimum_time_between_talking"),
	};
	return await initializeConfig(configObject);
};
