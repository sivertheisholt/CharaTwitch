const WebSocketClient = require("websocket").client;

const handlePing = (connection, pingMessage) => {
  connection.sendUTF(`PONG ${pingMessage}`);
};

const connectToTwitchIrc = (
  accessToken,
  username,
  onConnectedCb,
  onMessageCb,
  onErrorcb
) => {
  const client = new WebSocketClient();
  client.on("connect", async (connection) => {
    onConnectedCb();
    console.log("WebSocket Client Connected");
    connection.sendUTF(`PASS oauth:${accessToken}`);
    connection.sendUTF(`NICK ${username}`);

    connection.sendUTF(`JOIN #${username}`);

    connection.on("message", async (ircMessage) => {
      try {
        ircMessage = ircMessage.utf8Data;
        const split = ircMessage.split(" ");

        if (split.length < 1) return;
        if (split[0] === "PING") {
          await handlePing(connection, split[1]);
          return;
        }

        switch (split[1]) {
          case "PRIVMSG": {
            const exclamationPointPosition = split[0].indexOf("!");
            const username = split[0].substring(
              1,
              exclamationPointPosition - 1
            );
            // Skip the first character, the first colon, then find the next colon
            const secondColonPosition = ircMessage.indexOf(":", 1); // the 1 here is what skips the first character
            const message = ircMessage.substring(secondColonPosition + 1); // Everything past the second colon
            onMessageCb(username, message);
            break;
          }
          default:
            break;
        }
      } catch (e) {
        console.log("Could not handle message, skipping... " + e);
      }
    });

    connection.on("connectFailed", function (error) {
      console.log("Connect Error: " + error.toString());
      onErrorcb();
    });

    connection.on("error", function (error) {
      console.log("Connection Error: " + error.toString());
      onErrorcb();
    });

    connection.on("close", function () {
      console.log("Connection Closed");
      console.log(`close description: ${connection.closeDescription}`);
      console.log(`close reason code: ${connection.closeReasonCode}`);
    });
  });

  client.connect("ws://irc-ws.chat.twitch.tv:80");
};

module.exports = { connectToTwitchIrc };
