import { Message, client as WebSocketClient, connection } from "websocket";
import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { subscribeToRaid } from "./twitchEventSubApiService";
import { getItem } from "../config/configService";
import { logger } from "../../logging/logger";

export class TwitchEventSubService {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	accessToken: string;
	connection: connection;

	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		accessToken: string
	) {
		this.socket = socket;
		this.accessToken = accessToken;
	}

	init = async () => {
		const connectResult = await this.connectToTwitchEventSub();
		if (!connectResult) {
			return;
		}
		const clientId = await getItem("twitch_client_id");
		const channelId = await getItem("twitch_broadcaster_id");
		subscribeToRaid(this.accessToken, clientId, channelId);
	};

	handlePing = () => {
		const listenJson = JSON.stringify({
			type: "PING",
		});
		this.connection.send(listenJson);
	};

	onMessage = async (message: any) => {
		try {
			console.log(message);
		} catch (err) {
			logger.error(err, "Could not handle twitch event sub message, skipping...");
		}
	};

	connectToTwitchEventSub = () => {
		const client = new WebSocketClient();
		return new Promise((resolve) => {
			try {
				client.on("connect", async (connection) => {
					this.connection = connection;
					connection.on("message", async (event) => {
						this.onMessage(event);
					});
					resolve(true);
				});
				client.connect("wss://eventsub.wss.twitch.tv/ws");
			} catch (err) {
				logger.error(err, "Could not connext to twitch event sub");
				resolve(false);
			}
		});
	};
}
