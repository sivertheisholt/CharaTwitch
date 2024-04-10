import { init, setItem as _setItem, getItem as _getItem } from "node-persist";
import fs from "fs";

export const initStorage = () => {
	let dir =
		process.env.APPDATA ||
		(process.platform == "darwin"
			? process.env.HOME + "/Library/Preferences"
			: process.env.HOME + "/.local/share");

	dir += "/CharaTwitch/config";

	init({
		dir: dir,
	});
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
			case "character_welcome_raiders":
				initializedConfig[key] =
					configObject[key] === undefined ? false : configObject[key];
				break;
			case "character_welcome_strangers":
				initializedConfig[key] =
					configObject[key] === undefined ? false : configObject[key];
				break;
			case "character_welcome_new_viewers":
				initializedConfig[key] =
					configObject[key] === undefined ? false : configObject[key];
				break;
			case "character_random_redeems":
				initializedConfig[key] =
					configObject[key] === undefined ? false : configObject[key];
				break;
			case "character_random_talking":
				initializedConfig[key] =
					configObject[key] === undefined ? false : configObject[key];
				break;
			case "character_random_talking_frequency":
				initializedConfig[key] = configObject[key] === undefined ? 5 : configObject[key];
				break;
			case "character_random_redeems_frequency":
				initializedConfig[key] = configObject[key] === undefined ? 5 : configObject[key];
				break;
			case "character_context_parameter":
				initializedConfig[key] =
					configObject[key] === undefined
						? "This message was sent by ${username} - multiple people are using you to chat on twitch stream. You shall respond excited and express your feelings the most you can. You should remember conversations with different people. You should always reply with several sentences."
						: configObject[key];
				await _setItem("character_context_parameter", initializedConfig[key]);
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
		character_random_redeems_frequency: await _getItem(
			"character_random_redeems_frequency"
		),
		character_random_talking_frequency: await _getItem(
			"character_random_talking_frequency"
		),
		character_context_parameter: await _getItem("character_context_parameter"),
	};
	return await initializeConfig(configObject);
};
