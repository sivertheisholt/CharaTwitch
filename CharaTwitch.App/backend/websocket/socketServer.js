const { Server } = require("socket.io");

const CharacterAI = require("node_characterai");
const {
	getTwitchConfig,
	getCaiConfig,
	setItem,
} = require("../services/config/configService");
const { onTwitchAuth } = require("../managers/twitchManager");
const { onCaiAuth } = require("../managers/caiManager");

const startSocketServer = (server, expressApp) => {
	const cai = new CharacterAI();
	const caiObject = {
		cai: cai,
		caiChat: null,
	};
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:3000",
		},
	});

	io.on("connection", async (socket) => {
		console.log("Client connected");
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
			onTwitchAuth(socket, arg, expressApp, caiObject);
		});

		socket.on("twitchSelectRedeem", async (arg) => {
			await setItem("twitch_selected_redeem", arg);
		});

		/************************************************************
		 * Cai
		 ************************************************************/
		socket.on("caiAuth", async (arg) => {
			onCaiAuth(socket, arg, cai, caiObject);
		});

		socket.on("caiSelectVoice", async (arg) => {
			await setItem("cai_selected_voice", arg);
		});
	});

	return io;
};

module.exports = { startSocketServer };
