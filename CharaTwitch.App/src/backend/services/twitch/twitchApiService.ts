import axios from "axios";

export const getCustomRewards = async (
	userId: string,
	clientId: string,
	accessToken: string
) => {
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

export const getUserInfo = async (accessToken: string) => {
	try {
		return await axios
			.get("https://id.twitch.tv/oauth2/userinfo", {
				headers: { Authorization: `Bearer ${accessToken}` },
			})
			.then((res) => {
				console.log(res.data);
				return res.data;
			});
	} catch (error) {
		console.log(error);
		return null;
	}
};
