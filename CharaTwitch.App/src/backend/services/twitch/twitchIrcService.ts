import { Message, client as WebSocketClient, client, connection } from "websocket";
import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ChatManager } from "../../managers/chatManager";
import { parseMessage } from "../../helpers/twitchIrcMessageParser";

export class TwitchIrcService {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	accessToken: string;
	username: string;
	connection: connection;
	chatManager: ChatManager;
	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		accessToken: string,
		username: string
	) {
		this.socket = socket;
		this.accessToken = accessToken;
		this.username = username;
		this.chatManager = new ChatManager(socket, this);
	}

	handlePing = (pingMessage: string) => {
		this.connection.sendUTF(`PONG ${pingMessage}`);
	};

	sendMessage = (message: string, messageId: string = "") => {
		if (messageId === "") {
			this.connection.sendUTF(`PRIVMSG #${this.username} :${message}`);
		} else {
			this.connection.sendUTF(
				`@reply-parent-msg-id=${messageId} PRIVMSG #${this.username} :${message}`
			);
		}
	};

	onMessage = async (message: Message) => {
		try {
			if (message.type != "utf8") return;

			const ircMessage = message.utf8Data;
			const parsedMessage = parseMessage(ircMessage);

			switch (parsedMessage.command.command) {
				case "PRIVMSG": {
					if (this.username === parsedMessage.source.nick) break;
					this.chatManager.handleMessage(
						parsedMessage.source.nick,
						parsedMessage.parameters,
						parsedMessage.tags.id
					);
					this.socket.emit("twitchMessage", {
						username: parsedMessage.source.nick,
						message: parsedMessage.parameters,
					});
					break;
				}
				case "PING":
					console.log(parsedMessage);
					this.handlePing(parsedMessage.parameters);
					break;
				case "RECONNECT":
					this.connection.close();
					this.connectToTwitchIrc();
					break;
				default:
					break;
			}
		} catch (e) {
			console.log("Could not handle message, skipping... " + e);
		}
	};

	connectToTwitchIrc = async () => {
		const client = new WebSocketClient();
		client.on("connect", async (connection) => {
			console.log("WebSocket Client Connected");
			this.connection = connection;

			connection.sendUTF(`PASS oauth:${this.accessToken}`);
			connection.sendUTF(`NICK ${this.username}`);
			connection.sendUTF(`JOIN #${this.username}`);
			connection.sendUTF("CAP REQ :twitch.tv/commands twitch.tv/tags");

			connection.on("message", async (ircMessage) => {
				this.onMessage(ircMessage);
			});

			connection.on("error", function (error) {
				console.log("Connection Error: " + error.toString());
				this.socket.emit("twitchIrc", false);
			});

			connection.on("close", function () {
				console.log("Connection Closed");
				console.log(`close description: ${connection.closeDescription}`);
				console.log(`close reason code: ${connection.closeReasonCode}`);
				this.socket.emit("twitchIrc", false);
			});

			this.socket.emit("twitchIrc", true);
		});

		client.connect("ws://irc-ws.chat.twitch.tv:80");
	};
}
