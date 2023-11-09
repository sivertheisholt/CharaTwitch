const WebSocketClient = require("websocket").client;
const client = new WebSocketClient();

class TwitchPubSubService {
  constructor() {
    this.connection;
  }

  handlePing(connection, pingMessage) {
    connection.sendUTF(`PONG ${pingMessage}`);
  }

  listenToRewardRedeem(onRewardCb) {
    return new Promise((resolve, reject) => {
      try {
        this.connection.on("message", async (data) => {
          let parsedData = JSON.parse(data.utf8Data);
          if (parsedData.data != undefined) {
            const redeemDataMessage = JSON.parse(parsedData.data.message);
            onRewardCb(redeemDataMessage);
          }
        });
        resolve();
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  subscribeToChannelPoints(accessToken, channel_id) {
    return new Promise((resolve, reject) => {
      try {
        const topics = [`channel-points-channel-v1.${channel_id}`];

        let listenJson = JSON.stringify({
          type: "LISTEN",
          data: {
            topics,
            auth_token: accessToken,
          },
        });

        this.connection.send(listenJson);

        resolve();
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  connectToTwitchPubSub = () => {
    return new Promise((resolve, reject) => {
      try {
        client.on("connect", async (connection) => {
          this.connection = connection;

          resolve();
        });
        client.connect("wss://pubsub-edge.twitch.tv");
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  };
}

/** @type {TwitchPubSubService | null} */
let instance = null;

function getSharedService(onRewardCb) {
  if (!instance) {
    instance = new TwitchPubSubService(onRewardCb);
  }
  return instance;
}

module.exports = getSharedService;
