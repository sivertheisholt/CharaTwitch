const axios = require("axios");

class TwitchApiService {
  async getCustomRewards(userId, clientId, accessToken) {
    try {
      return await axios
        .get(
          `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Client-Id": clientId,
            },
          }
        )
        .then((res) => {
          return res.data.data;
        });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getUserInfo(accessToken) {
    try {
      return await axios
        .get("https://id.twitch.tv/oauth2/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => {
          return res.data;
        });
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

let instance = null;

function getSharedService() {
  if (!instance) {
    instance = new TwitchApiService();
  }
  return instance;
}

module.exports = getSharedService;
