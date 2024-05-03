import {
	getTwitchConfig,
	setItem,
	getCharacterConfig,
	getOllamaConfig,
	getCaiConfig,
} from "../services/config/configService";
import { onTwitchAuth } from "../managers/twitchManager";
import { init } from "../managers/audioManager";
import { Express } from "express";
import { Server } from "socket.io";

import { logger } from "../logging/logger";
import { TWITCH_AUTH, TWITCH_CONFIG, TWITCH_SELECTED_REDEEM_CHANGE } from "../../socket/TwitchEvents";
import { OLLAMA_CONFIG } from "../../socket/OllamaEvents";
import {
	CHARACTER_CONFIG,
	CHARACTER_MINIMUM_TIME_BETWEEN_TALKING_CHANGE,
	CHARACTER_RANDOM_REDEEMS_CHANGE,
	CHARACTER_RANDOM_REDEEMS_FREQUENCY_CHANGE,
	CHARACTER_RANDOM_TALKING_CHANGE,
	CHARACTER_RANDOM_TALKING_FREQUENCY_CHANGE,
	CHARACTER_WELCOME_NEW_VIEWERS_CHANGE,
	CHARACTER_WELCOME_RAIDERS_CHANGE,
	CHARACTER_WELCOME_STRANGERS_CHANGE,
} from "../../socket/CharacterEvents";
import { AI_CONNECT } from "../../socket/AiEvents";
import { AiConnectType } from "../../types/socket/AiConnectType";
import { TwitchAuthType } from "../../types/socket/TwitchAuthType";
import { onAiConnect } from "../managers/aiManager";
import { CAI_CONFIG, CAI_SELECTED_VOICE_CHANGE } from "../../socket/CaiEvents";

export const startSocketServer = (server: any, expressApp: Express) => {
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:5173",
		},
	});

	io.on("connection", async (socket: any) => {
		logger.info("Client connected");

		init(socket);

		/************************************************************
		 * config & character
		 ************************************************************/
		const twitchConfig = await getTwitchConfig();
		const characterconfig = await getCharacterConfig();
		const ollamaConfig = await getOllamaConfig();
		const caiConfig = await getCaiConfig();

		socket.emit(TWITCH_CONFIG, twitchConfig);
		socket.emit(OLLAMA_CONFIG, ollamaConfig);
		socket.emit(CHARACTER_CONFIG, characterconfig);
		socket.emit(CAI_CONFIG, caiConfig);

		/************************************************************
		 * Twitch
		 ************************************************************/
		socket.on(TWITCH_AUTH, async (arg: TwitchAuthType) => {
			onTwitchAuth(socket, arg, expressApp);
		});

		socket.on(TWITCH_SELECTED_REDEEM_CHANGE, async (arg: string) => {
			await setItem("twitch_selected_redeem", arg);
		});

		/************************************************************
		 * AI
		 ************************************************************/
		socket.on(AI_CONNECT, (arg: AiConnectType) => {
			onAiConnect(socket, arg);
		});

		/************************************************************
		 * CAI
		 ************************************************************/
		socket.on(CAI_SELECTED_VOICE_CHANGE, async (arg: string) => {
			await setItem("cai_selected_voice", arg);
		});

		/************************************************************
		 * Character
		 ************************************************************/
		socket.on(CHARACTER_WELCOME_RAIDERS_CHANGE, async (arg: boolean) => {
			await setItem("character_welcome_raiders", arg);
		});
		socket.on(CHARACTER_WELCOME_STRANGERS_CHANGE, async (arg: boolean) => {
			await setItem("character_welcome_strangers", arg);
		});
		socket.on(CHARACTER_RANDOM_REDEEMS_CHANGE, async (arg: boolean) => {
			await setItem("character_random_redeems", arg);
		});
		socket.on(CHARACTER_RANDOM_TALKING_CHANGE, async (arg: boolean) => {
			await setItem("character_random_talking", arg);
		});
		socket.on(CHARACTER_WELCOME_NEW_VIEWERS_CHANGE, async (arg: boolean) => {
			await setItem("character_welcome_new_viewers", arg);
		});
		socket.on(CHARACTER_RANDOM_REDEEMS_FREQUENCY_CHANGE, async (arg: number) => {
			await setItem("character_random_redeems_frequency", arg);
		});
		socket.on(CHARACTER_RANDOM_TALKING_FREQUENCY_CHANGE, async (arg: number) => {
			await setItem("character_random_talking_frequency", arg);
		});
		socket.on(CHARACTER_MINIMUM_TIME_BETWEEN_TALKING_CHANGE, async (arg: number) => {
			await setItem("character_minimum_time_between_talking", arg);
		});
	});

	return io;
};
