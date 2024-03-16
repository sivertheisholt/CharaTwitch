import axios from "axios";

export const getCustomRewards = async (userId, clientId, accessToken) => {
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
};

export const getUserInfo = async (accessToken) => {
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
};
