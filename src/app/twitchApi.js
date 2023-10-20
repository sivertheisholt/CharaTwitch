const createRedeem = async (broadcaster_id) => {
  fetch(
    `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcaster_id}`,
    {
      method: "POST",
    }
  );
};
