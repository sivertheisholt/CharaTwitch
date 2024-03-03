const { Server } = require("socket.io");
const { authTwitch } = require("../services/twitchAuthService");
const { connectToTwitchIrc } = require("../services/twitchIrcService");
const {
  connectToTwitchPubSub,
  subscribeToChannelPoints,
  listenToRewardRedeem,
} = require("../services/twitchPubSubService");
const {
  getUserInfo,
  getCustomRewards,
} = require("../services/twitchApiService");
const { authCai } = require("../services/cai/caiAuthService");
const CharacterAI = require("node_characterai");
const {
  initChat,
  sendChat,
  fetchVoices,
} = require("../services/cai/caiApiService");
const {
  setTwitchConfig,
  getTwitchConfig,
  getCaiConfig,
  setCaiConfig,
} = require("../services/config/configService");

const startSocketServer = (server, expressApp) => {
  const cai = new CharacterAI();
  let caiChat = null;
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", async (socket) => {
    console.log("Client connected");
    /************************************************************
     * Send config
     ************************************************************/
    const twitchConfig = await getTwitchConfig();
    const caiConfig = await getCaiConfig();

    socket.emit("config", {
      twitch_config: twitchConfig,
      cai_config: caiConfig,
    });

    /************************************************************
     * Authenticate twitch
     ************************************************************/
    socket.on("authTwitch", async (arg) => {
      const { client_id, client_secret, trigger_word, listen_to_trigger_word } =
        arg;

      await setTwitchConfig(
        client_id,
        client_secret,
        trigger_word,
        listen_to_trigger_word
      );

      const { access_token } = await authTwitch(
        expressApp,
        client_id,
        client_secret
      );
      if (access_token == null) return socket.emit("authTwitchCb", null);

      const { preferred_username, sub } = await getUserInfo(access_token);
      if (sub == null) return socket.emit("authTwitchCb", null);

      const customRedeemms = await getCustomRewards(
        sub,
        client_id,
        access_token
      );
      if (customRedeemms == null) return socket.emit("authTwitchCb", null);

      connectToTwitchIrc(
        access_token,
        preferred_username,
        () => {
          socket.emit("twitchIrc", true);
        },
        (username, message) => {
          socket.emit("twitchMessage", {
            username: username,
            message: message,
          });
        },
        () => {
          socket.emit("authTwitchCb", null);
        }
      );

      const pubSubConnection = await connectToTwitchPubSub();
      const subResult = await subscribeToChannelPoints(
        pubSubConnection,
        access_token,
        "228957703"
      );
      if (subResult) socket.emit("twitchPubSub", true);

      listenToRewardRedeem(pubSubConnection, async (rewardData) => {
        const chatResponse = await sendChat(
          caiChat,
          "Hello there",
          rewardData.data.redemption.user.display_name
        );

        const speechBase64 = socket.emit("twitchRedeem", {
          username: rewardData.data.redemption.user.display_name,
          reward: rewardData.data.redemption.reward.title,
        });
      });

      socket.emit("twitchAuthCb", {
        custom_redeems: customRedeemms,
      });
      socket.emit("caiAccountStatus", true);
    });

    /************************************************************
     * Authenticate cai
     ************************************************************/
    socket.on("authCai", async (arg) => {
      const { access_token, character_id } = arg;
      await setCaiConfig(access_token, character_id);

      const res = await authCai(cai);
      if (!res) return socket.emit("caiAuthCb", null);

      caiChat = await initChat(cai, character_id);
      const voices = await fetchVoices(cai);

      socket.emit("caiAuthCb", {
        voices: voices,
      });
    });
  });

  return io;
};

module.exports = { startSocketServer };
