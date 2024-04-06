import { Message, client as WebSocketClient, connection } from "websocket";
import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ChatManager } from "../../managers/chatManager";

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

	sendMessage = (message: string) => {
		this.connection.sendUTF(`PRIVMSG #${this.username} :${message}`);
	};

	onMessage = async (message: Message) => {
		try {
			if (message.type != "utf8") return;

			const ircMessage = message.utf8Data;
			const split = ircMessage.split(" ");

			if (split.length < 1) return;
			if (split[0] === "PING") {
				this.handlePing(split[1]);
				return;
			}

			switch (split[1]) {
				case "PRIVMSG": {
					const exclamationPointPosition = split[0].indexOf("!");
					const username = split[0].substring(1, exclamationPointPosition - 1);
					// Skip the first character, the first colon, then find the next colon
					const secondColonPosition = ircMessage.indexOf(":", 1); // the 1 here is what skips the first character
					const message = ircMessage.substring(secondColonPosition + 1).trimEnd(); // Everything past the second colon
					this.chatManager.handleMessage(username, message);
					this.socket.emit("twitchMessage", {
						username: username,
						message: message,
					});
					break;
				}
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
