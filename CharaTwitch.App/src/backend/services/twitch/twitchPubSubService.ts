import { Message, client as WebSocketClient, connection } from "websocket";
import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { getItem } from "../config/configService";
import { logger } from "../../logging/logger";
import { TWITCH_PUB_SUB_STATUS } from "../../../socket/TwitchEvents";

export class TwitchPubSubService {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	accessToken: string;
	connection: connection;
	onRewardCb: (redeemDataMessage: any) => void;
	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		accessToken: string,
		onRewardCb: (redeemDataMessage: any) => void
	) {
		this.socket = socket;
		this.accessToken = accessToken;
		this.onRewardCb = onRewardCb;
	}

	init = async () => {
		const connectResult = await this.connectToTwitchPubSub();
		if (!connectResult) {
			this.socket.emit(TWITCH_PUB_SUB_STATUS, false);
			return;
		}

		const channelId = await getItem("twitch_broadcaster_id");

		const subResult = await this.subscribeToChannelPoints(this.connection, this.accessToken, channelId);
		if (!subResult) {
			this.socket.emit(TWITCH_PUB_SUB_STATUS, false);
			return;
		}

		this.listenToRewardRedeem();

		this.socket.emit(TWITCH_PUB_SUB_STATUS, true);
	};

	handlePing = () => {
		const listenJson = JSON.stringify({
			type: "PING",
		});
		this.connection.send(listenJson);
	};

	connectToTwitchPubSub = () => {
		const client = new WebSocketClient();
		return new Promise((resolve) => {
			try {
				client.on("connect", async (connection) => {
					this.connection = connection;
					setInterval(() => {
						this.handlePing();
					}, 4 * 60 * 1000);
					resolve(true);
				});
				client.connect("wss://pubsub-edge.twitch.tv");
			} catch (err) {
				logger.error(err, "Could not connect to twitch pub sub");
				resolve(false);
			}
		});
	};
	listenToRewardRedeem = () => {
		try {
			this.connection.on("message", async (message: Message) => {
				if (message.type !== "utf8") return;

				const parsedMessage = JSON.parse(message.utf8Data);
				if (parsedMessage.data === undefined) return;

				const redeemDataMessage = JSON.parse(parsedMessage.data.message);
				this.onRewardCb(redeemDataMessage);
			});
		} catch (err) {
			logger.error(err, "Could not listen to reward redeem");
		}
	};
	subscribeToChannelPoints = (connection: connection, accessToken: string, channel_id: string) => {
		return new Promise((resolve) => {
			try {
				const topics = [`channel-points-channel-v1.${channel_id}`];

				const listenJson = JSON.stringify({
					type: "LISTEN",
					data: {
						topics,
						auth_token: accessToken,
					},
				});

				connection.send(listenJson);

				resolve(true);
			} catch (err) {
				logger.error(err, "Could not subscribe to channel points");
				resolve(false);
			}
		});
	};
}
