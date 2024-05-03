import { Message, client as WebSocketClient, client, connection } from "websocket";
import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ChatManager } from "../../managers/chatManager";
import { parseMessage } from "../../helpers/twitchIrcMessageParser";
import { RaidManager } from "../../managers/raidManager";
import { logger } from "../../logging/logger";
import { TWITCH_IRC_STATUS } from "../../../socket/TwitchEvents";

export class TwitchIrcService {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	accessToken: string;
	username: string;
	connection: connection;
	chatManager: ChatManager;
	raidManager: RaidManager;
	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		accessToken: string,
		username: string
	) {
		this.socket = socket;
		this.accessToken = accessToken;
		this.username = username;
		this.chatManager = new ChatManager(socket, this);
		this.raidManager = new RaidManager(socket, this);
	}

	handlePing = (pingMessage: string) => {
		this.connection.sendUTF(`PONG ${pingMessage}`);
	};

	sendMessage = (message: string, messageId: string = "") => {
		if (message.length > 490) {
			message = message.substring(0, 490);
			message += "...";
		}

		if (messageId === "") {
			this.connection.sendUTF(`PRIVMSG #${this.username} :${message}`);
		} else {
			this.connection.sendUTF(`@reply-parent-msg-id=${messageId} PRIVMSG #${this.username} :${message}`);
		}
	};

	onMessage = async (message: Message) => {
		try {
			if (message.type != "utf8") return;

			const ircMessage = message.utf8Data;
			const parsedMessage = parseMessage(ircMessage);

			if (parsedMessage.command == null || parsedMessage.command.command == null) return;

			switch (parsedMessage.command.command) {
				case "PRIVMSG": {
					if (
						parsedMessage.tags["display-name"] == "Streamlabs" ||
						parsedMessage.tags["display-name"] == this.username ||
						"custom-reward-id" in parsedMessage.tags
					)
						break;
					this.chatManager.handleMessage(parsedMessage.source.nick, parsedMessage.parameters, parsedMessage.tags.id);
					this.socket.emit("twitchMessage", {
						username: parsedMessage.source.nick,
						message: parsedMessage.parameters,
					});
					break;
				}
				case "USERNOTICE":
					if (parsedMessage.tags == null) break;
					if (parsedMessage.tags["msg-id"] == "raid") this.raidManager.startRaid(parsedMessage.tags["display-name"]);
					break;
				case "PING":
					this.handlePing(parsedMessage.parameters);
					break;
				case "RECONNECT":
					this.connection.close();
					this.connectToTwitchIrc();
					break;
				default:
					break;
			}
		} catch (err) {
			logger.error(err, "Could not handle twitch irc message, skipping...");
		}
	};

	connectToTwitchIrc = async () => {
		const client = new WebSocketClient();
		client.on("connect", async (connection) => {
			logger.info("WebSocket Client Connected");
			this.connection = connection;

			connection.sendUTF(`PASS oauth:${this.accessToken}`);
			connection.sendUTF(`NICK ${this.username}`);
			connection.sendUTF(`JOIN #${this.username}`);
			connection.sendUTF("CAP REQ :twitch.tv/commands twitch.tv/tags");

			connection.on("message", async (ircMessage) => {
				this.onMessage(ircMessage);
			});

			connection.on("error", function (err) {
				logger.error(err, "Could not connect to twitch irc");
				this.socket.emit(TWITCH_IRC_STATUS, false);
			});

			connection.on("close", function () {
				logger.info("Connection Closed");
				logger.info(`close description: ${connection.closeDescription}`);
				logger.info(`close reason code: ${connection.closeReasonCode}`);
				this.socket.emit(TWITCH_IRC_STATUS, false);
			});

			this.socket.emit(TWITCH_IRC_STATUS, true);
		});

		client.connect("ws://irc-ws.chat.twitch.tv:80");
	};
}
