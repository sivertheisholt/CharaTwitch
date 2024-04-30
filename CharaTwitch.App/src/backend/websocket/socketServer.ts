import {
	getTwitchConfig,
	setItem,
	getCharacterConfig,
	getOllamaConfig,
	getElevenlabsConfig,
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
import { ELEVENLABS_CONFIG } from "../../socket/ElevenlabsEvents";

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
		const elevenlabsConfig = await getElevenlabsConfig();

		socket.emit(TWITCH_CONFIG, twitchConfig);
		socket.emit(OLLAMA_CONFIG, ollamaConfig);
		socket.emit(CHARACTER_CONFIG, characterconfig);
		socket.emit(ELEVENLABS_CONFIG, elevenlabsConfig);

		/************************************************************
		 * Twitch
		 ************************************************************/
		socket.on(TWITCH_AUTH, async (arg) => {
			onTwitchAuth(socket, arg, expressApp);
		});

		socket.on(TWITCH_SELECTED_REDEEM_CHANGE, async (arg) => {
			await setItem("twitch_selected_redeem", arg);
		});

		/************************************************************
		 * Elevenlabs
		 ************************************************************/

		/************************************************************
		 * Character
		 ************************************************************/
		socket.on(CHARACTER_WELCOME_RAIDERS_CHANGE, async (arg) => {
			await setItem("character_welcome_raiders", arg);
		});
		socket.on(CHARACTER_WELCOME_STRANGERS_CHANGE, async (arg) => {
			await setItem("character_welcome_strangers", arg);
		});
		socket.on(CHARACTER_RANDOM_REDEEMS_CHANGE, async (arg) => {
			await setItem("character_random_redeems", arg);
		});
		socket.on(CHARACTER_RANDOM_TALKING_CHANGE, async (arg) => {
			await setItem("character_random_talking", arg);
		});
		socket.on(CHARACTER_RANDOM_REDEEMS_FREQUENCY_CHANGE, async (arg) => {
			await setItem("character_random_redeems_frequency", arg);
		});
		socket.on(CHARACTER_RANDOM_TALKING_FREQUENCY_CHANGE, async (arg) => {
			await setItem("character_random_talking_frequency", arg);
		});
		socket.on(CHARACTER_WELCOME_NEW_VIEWERS_CHANGE, async (arg) => {
			await setItem("character_welcome_new_viewers", arg);
		});
		socket.on(CHARACTER_MINIMUM_TIME_BETWEEN_TALKING_CHANGE, async (arg) => {
			await setItem("character_minimum_time_between_talking", arg);
		});
	});

	return io;
};
