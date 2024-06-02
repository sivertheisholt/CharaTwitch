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
			case "character_random_talking":
				initializedConfig[key] = configObject[key] === undefined ? false : configObject[key];
				break;
			case "character_voice_enabled":
				initializedConfig[key] = configObject[key] === undefined ? false : configObject[key];
				break;
			case "character_minimum_time_between_talking":
				initializedConfig[key] = configObject[key] === undefined ? 0 : configObject[key];
				await _setItem("character_minimum_time_between_talking", initializedConfig[key]);
				break;
			case "mirostat":
				initializedConfig[key] = configObject[key] === undefined ? 0 : configObject[key];
				await _setItem("ollama_parameters_mirostat", 1);
				break;
			case "mirostat_eta":
				initializedConfig[key] = configObject[key] === undefined ? 0 : configObject[key];
				await _setItem("ollama_parameters_mirostat_eta", 0.1);
				break;
			case "num_ctx":
				initializedConfig[key] = configObject[key] === undefined ? 0 : configObject[key];
				await _setItem("ollama_parameters_num_ctx", 2048);
				break;
			case "repeat_last_n":
				initializedConfig[key] = configObject[key] === undefined ? 0 : configObject[key];
				await _setItem("ollama_parameters_repeat_last_n", 64);
				break;
			case "repeat_penalty":
				initializedConfig[key] = configObject[key] === undefined ? 0 : configObject[key];
				await _setItem("ollama_parameters_repeat_penalty", 1.1);
				break;
			case "temperature":
				initializedConfig[key] = configObject[key] === undefined ? 0 : configObject[key];
				await _setItem("ollama_parameters_temperature", 0.8);
				break;
			case "seed":
				initializedConfig[key] = configObject[key] === undefined ? 0 : configObject[key];
				await _setItem("ollama_parameters_seed", 0);
				break;
			case "tfs_z":
				initializedConfig[key] = configObject[key] === undefined ? 0 : configObject[key];
				await _setItem("ollama_parameters_tfs_z", 1);
				break;
			case "num_predict":
				initializedConfig[key] = configObject[key] === undefined ? 0 : configObject[key];
				await _setItem("ollama_parameters_num_predict", 128);
				break;
			case "top_k":
				initializedConfig[key] = configObject[key] === undefined ? 0 : configObject[key];
				await _setItem("ollama_parameters_top_k", 40);
				break;
			case "top_p":
				initializedConfig[key] = configObject[key] === undefined ? 0 : configObject[key];
				await _setItem("ollama_parameters_top_p", 0.9);
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
		character_tts: await _getItem("character_tts"),
		character_random_talking: await _getItem("character_random_talking"),
		character_welcome_strangers: await _getItem("character_welcome_raiders"),
		character_welcome_raiders: await _getItem("character_welcome_strangers"),
		character_welcome_new_viewers: await _getItem("character_welcome_new_viewers"),
		character_random_talking_frequency: await _getItem("character_random_talking_frequency"),
		character_minimum_time_between_talking: await _getItem("character_minimum_time_between_talking"),
		character_voice_enabled: await _getItem("character_voice_enabled"),
	};
	return await initializeConfig(configObject);
};

export const getOllamaParameters = async () => {
	const configObject = {
		mirostat: await _getItem("ollama_parameters_mirostat"),
		mirostat_eta: await _getItem("ollama_parameters_mirostat_eta"),
		num_ctx: await _getItem("ollama_parameters_num_ctx"),
		repeat_last_n: await _getItem("ollama_parameters_repeat_last_n"),
		repeat_penalty: await _getItem("ollama_parameters_repeat_penalty"),
		temperature: await _getItem("ollama_parameters_temperature"),
		seed: await _getItem("ollama_parameters_seed"),
		tfs_z: await _getItem("ollama_parameters_tfs_z"),
		num_predict: await _getItem("ollama_parameters_num_predict"),
		top_k: await _getItem("ollama_parameters_top_k"),
		top_p: await _getItem("ollama_parameters_top_p"),
	};
	return await initializeConfig(configObject);
};

export const getOpenAiConfig = async () => {
	const configObject = {
		openai_api_key: await _getItem("openai_api_key"),
	};
	return await initializeConfig(configObject);
};
