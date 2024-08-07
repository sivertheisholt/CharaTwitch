import {
	getTwitchConfig,
	setItem,
	getCharacterConfig,
	getOllamaConfig,
	getOllamaParameters,
	getOpenAiConfig,
	getItem,
	getCoquiConfig,
} from "../services/config/configService";
import { Express } from "express";
import { Server } from "socket.io";
import { logger } from "../logging/logger";
import { TWITCH_AUTH, TWITCH_CONFIG, TWITCH_SELECTED_REDEEM_CHANGE } from "../../socket/TwitchEvents";
import { OLLAMA_CONFIG } from "../../socket/OllamaEvents";
import {
	CHARACTER_CONFIG,
	CHARACTER_MINIMUM_TIME_BETWEEN_TALKING_CHANGE,
	CHARACTER_RANDOM_TALKING_CHANGE,
	CHARACTER_RANDOM_TALKING_FREQUENCY_CHANGE,
	CHARACTER_VOICE_ENABLED,
	CHARACTER_VOICE_ENABLED_CHANGE,
	CHARACTER_WELCOME_NEW_VIEWERS_CHANGE,
	CHARACTER_WELCOME_RAIDERS_CHANGE,
	CHARACTER_WELCOME_STRANGERS_CHANGE,
} from "../../socket/CharacterEvents";
import { AI_CONNECT } from "../../socket/AiEvents";
import { AiConnectType } from "../../types/socket/AiConnectType";
import { TwitchAuthType } from "../../types/socket/TwitchAuthType";
import {
	OLLAMA_PARAMETERS,
	OLLAMA_PARAMETERS_ENABLE_OVERRIDE_CHANGE,
	OLLAMA_PARAMETERS_KEEP_ALIVE_CHANGE,
	OLLAMA_PARAMETERS_MIROSTAT_CHANGE,
	OLLAMA_PARAMETERS_MIROSTAT_ETA_CHANGE,
	OLLAMA_PARAMETERS_NUM_CTX_CHANGE,
	OLLAMA_PARAMETERS_NUM_PREDICT_CHANGE,
	OLLAMA_PARAMETERS_REPEAT_LAST_N_CHANGE,
	OLLAMA_PARAMETERS_REPEAT_PENALTY_CHANGE,
	OLLAMA_PARAMETERS_SEED_CHANGE,
	OLLAMA_PARAMETERS_SYSTEM_MESSAGE_CHANGE,
	OLLAMA_PARAMETERS_TEMPERATURE_CHANGE,
	OLLAMA_PARAMETERS_TFS_Z_CHANGE,
	OLLAMA_PARAMETERS_TOP_K_CHANGE,
	OLLAMA_PARAMETERS_TOP_P_CHANGE,
} from "../../socket/OllamaParametersEvents";
import { GlobalManager } from "../managers/globalManager";
import { OPENAI_API_KEY_CHANGE, OPENAI_CONFIG } from "../../socket/OpenAiEvents.";
import { COQUI_CONFIG } from "../../socket/CoquiEvents";

export class SocketServer {
	server: any;
	express: Express;
	globalManager: GlobalManager;

	constructor(server: any, expressApp: Express) {
		const io = new Server(server, {
			cors: {
				origin: "http://localhost:5173",
			},
		});

		io.on("connection", async (socket: any) => {
			logger.info("Client connected");

			this.globalManager = new GlobalManager(socket);

			/************************************************************
			 * config & character
			 ************************************************************/
			const twitchConfig = await getTwitchConfig();
			const characterconfig = await getCharacterConfig();
			const ollamaConfig = await getOllamaConfig();
			const coquiConfig = await getCoquiConfig();
			const ollamaParameters = await getOllamaParameters();
			const openAiConfig = await getOpenAiConfig();
			const voiceEnabled = await getItem("character_voice_enabled");

			socket.emit(COQUI_CONFIG, coquiConfig);
			socket.emit(TWITCH_CONFIG, twitchConfig);
			socket.emit(OLLAMA_CONFIG, ollamaConfig);
			socket.emit(CHARACTER_CONFIG, characterconfig);
			socket.emit(OLLAMA_PARAMETERS, ollamaParameters);
			socket.emit(OPENAI_CONFIG, openAiConfig);
			socket.emit(CHARACTER_VOICE_ENABLED, voiceEnabled);

			/************************************************************
			 * Twitch
			 ************************************************************/
			socket.on(TWITCH_AUTH, async (arg: TwitchAuthType) => {
				this.globalManager.onTwitchAuth(arg, expressApp);
			});

			socket.on(TWITCH_SELECTED_REDEEM_CHANGE, async (arg: string) => {
				await setItem("twitch_selected_redeem", arg);
			});

			/************************************************************
			 * Ai
			 ************************************************************/
			socket.on(AI_CONNECT, (arg: AiConnectType) => {
				const { coqui_base_url, ollama_base_url, ollama_model_name } = arg;
				this.globalManager.onOllamaAuth(ollama_model_name, ollama_base_url);
				this.globalManager.onCoquiAuth(coqui_base_url);
			});
			/************************************************************
			 * OpenAi
			 ************************************************************/
			socket.on(OPENAI_API_KEY_CHANGE, async (arg: string) => {
				await setItem("openai_api_key", arg);
			});

			/************************************************************
			 * Coqui
			 ************************************************************/

			/************************************************************
			 * Character
			 ************************************************************/
			socket.on(CHARACTER_WELCOME_RAIDERS_CHANGE, async (arg: boolean) => {
				await setItem("character_welcome_raiders", arg);
			});
			socket.on(CHARACTER_WELCOME_STRANGERS_CHANGE, async (arg: boolean) => {
				await setItem("character_welcome_strangers", arg);
			});
			socket.on(CHARACTER_RANDOM_TALKING_CHANGE, async (arg: boolean) => {
				await setItem("character_random_talking", arg);
			});
			socket.on(CHARACTER_WELCOME_NEW_VIEWERS_CHANGE, async (arg: boolean) => {
				await setItem("character_welcome_new_viewers", arg);
			});
			socket.on(CHARACTER_RANDOM_TALKING_FREQUENCY_CHANGE, async (arg: number) => {
				await setItem("character_random_talking_frequency", arg);
			});
			socket.on(CHARACTER_MINIMUM_TIME_BETWEEN_TALKING_CHANGE, async (arg: number) => {
				await setItem("character_minimum_time_between_talking", arg);
			});
			socket.on(CHARACTER_VOICE_ENABLED_CHANGE, async (arg: boolean) => {
				await setItem("character_voice_enabled", arg);
			});
			/************************************************************
			 * Ollama Parameters
			 ************************************************************/
			socket.on(OLLAMA_PARAMETERS_MIROSTAT_CHANGE, async (arg: number) => {
				await setItem("ollama_parameters_mirostat", arg);
			});
			socket.on(OLLAMA_PARAMETERS_MIROSTAT_ETA_CHANGE, async (arg: number) => {
				await setItem("ollama_parameters_mirostat_eta", arg);
			});
			socket.on(OLLAMA_PARAMETERS_NUM_CTX_CHANGE, async (arg: number) => {
				await setItem("ollama_parameters_num_ctx", arg);
			});
			socket.on(OLLAMA_PARAMETERS_REPEAT_LAST_N_CHANGE, async (arg: number) => {
				await setItem("ollama_parameters_repeat_last_n", arg);
			});
			socket.on(OLLAMA_PARAMETERS_REPEAT_PENALTY_CHANGE, async (arg: number) => {
				await setItem("ollama_parameters_repeat_penalty", arg);
			});
			socket.on(OLLAMA_PARAMETERS_TEMPERATURE_CHANGE, async (arg: number) => {
				await setItem("ollama_parameters_temperature", arg);
			});
			socket.on(OLLAMA_PARAMETERS_SEED_CHANGE, async (arg: number) => {
				await setItem("ollama_parameters_seed", arg);
			});
			socket.on(OLLAMA_PARAMETERS_TFS_Z_CHANGE, async (arg: number) => {
				await setItem("ollama_parameters_tfs_z", arg);
			});
			socket.on(OLLAMA_PARAMETERS_NUM_PREDICT_CHANGE, async (arg: number) => {
				await setItem("ollama_parameters_num_predict", arg);
			});
			socket.on(OLLAMA_PARAMETERS_TOP_K_CHANGE, async (arg: number) => {
				await setItem("ollama_parameters_top_k", arg);
			});
			socket.on(OLLAMA_PARAMETERS_TOP_P_CHANGE, async (arg: number) => {
				await setItem("ollama_parameters_top_p", arg);
			});
			socket.on(OLLAMA_PARAMETERS_ENABLE_OVERRIDE_CHANGE, async (arg: boolean) => {
				await setItem("ollama_parameters_enable_override", arg);
			});
			socket.on(OLLAMA_PARAMETERS_KEEP_ALIVE_CHANGE, async (arg: number) => {
				await setItem("ollama_parameters_keep_alive", arg);
			});
			socket.on(OLLAMA_PARAMETERS_SYSTEM_MESSAGE_CHANGE, async (arg: number) => {
				await setItem("ollama_parameters_system_message", arg);
			});
		});
	}
}
