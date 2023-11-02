class TwitchApiService {
  async createRedeem(broadcaster_id) {
    fetch(
      `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcaster_id}`,
      {
        method: "POST",
      }
    );
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
