const WebSocketClient = require("websocket").client;

const handlePing = (connection) => {
  const listenJson = JSON.stringify({
    type: "PING",
  });
  connection.send(listenJson);
};

const connectToTwitchPubSub = () => {
  const client = new WebSocketClient();
  return new Promise((resolve, reject) => {
    try {
      client.on("connect", async (connection) => {
        setInterval(function () {
          handlePing(connection);
        }, 4 * 60 * 1000);
        resolve(connection);
      });
      client.connect("wss://pubsub-edge.twitch.tv");
    } catch (err) {
      reject(null);
    }
  });
};

const listenToRewardRedeem = (connection, onRewardCb) => {
  try {
    connection.on("message", async (data) => {
      let parsedData = JSON.parse(data.utf8Data);
      if (parsedData.data !== undefined) {
        const redeemDataMessage = JSON.parse(parsedData.data.message);
        onRewardCb(redeemDataMessage);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const subscribeToChannelPoints = (connection, accessToken, channel_id) => {
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

      connection.send(listenJson);

      resolve(true);
    } catch (err) {
      console.log(err);
      resolve(false);
    }
  });
};

module.exports = {
  subscribeToChannelPoints,
  connectToTwitchPubSub,
  listenToRewardRedeem,
};
