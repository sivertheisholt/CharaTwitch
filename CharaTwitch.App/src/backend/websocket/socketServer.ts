import { getTwitchConfig, getCaiConfig, setItem } from "../services/config/configService";
import { onTwitchAuth } from "../managers/twitchManager";
import { onCaiAuth } from "../managers/caiManager";
import { init } from "../managers/audioManager";
import { Express } from "express";
import { Server } from "socket.io";

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
		 * config
		 ************************************************************/
		const twitchConfig = await getTwitchConfig();
		const caiConfig = await getCaiConfig();

		socket.emit("config", {
			twitch_config: twitchConfig,
			cai_config: caiConfig,
		});

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
	});

	return io;
};
