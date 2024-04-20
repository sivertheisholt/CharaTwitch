import {
	getTwitchConfig,
	getCaiConfig,
	setItem,
	getCharacterConfig,
} from "../services/config/configService";
import { onTwitchAuth } from "../managers/twitchManager";
import { onCaiAuth } from "../managers/caiManager";
import { init } from "../managers/audioManager";
import { Express } from "express";
import { Server } from "socket.io";
import {
	CHARACTER_WELCOME_RAIDERS_CHANGE,
	CHARACTER_WELCOME_STRANGERS_CHANGE,
	CHARACTER_RANDOM_REDEEMS_CHANGE,
	CHARACTER_RANDOM_TALKING_CHANGE,
	CHARACTER_RANDOM_TALKING_FREQUENCY_CHANGE,
	CHARACTER_RANDOM_REDEEMS_FREQUENCY_CHANGE,
	CHARACTER_CONFIG,
	CHARACTER_WELCOME_NEW_VIEWERS_CHANGE,
	CHARACTER_MINIMUM_TIME_BETWEEN_TALKING_CHANGE,
} from "../../socket/Events";

export const startSocketServer = (server: any, expressApp: Express) => {
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:5173",
		},
	});

	io.on("connection", async (socket) => {
		console.log("Client connected");

		init(socket);

		/************************************************************
		 * config & character
		 ************************************************************/
		const twitchConfig = await getTwitchConfig();
		const caiConfig = await getCaiConfig();
		const characterconfig = await getCharacterConfig();

		socket.emit("config", {
			twitch_config: twitchConfig,
			cai_config: caiConfig,
		});

		socket.emit(CHARACTER_CONFIG, characterconfig);

		/************************************************************
		 * Twitch
		 ************************************************************/
		socket.on("twitchAuth", async (arg) => {
			onTwitchAuth(socket, arg, expressApp);
		});

		socket.on("twitchSelectRedeem", async (arg) => {
			await setItem("twitch_selected_redeem", arg);
		});

		/************************************************************
		 * Cai
		 ************************************************************/
		socket.on("caiAuth", async (arg) => {
			onCaiAuth(socket, arg);
		});

		socket.on("caiSelectVoice", async (arg) => {
			await setItem("cai_selected_voice", arg);
		});

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
