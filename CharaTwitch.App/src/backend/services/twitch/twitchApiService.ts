import axios from "axios";
import { logger } from "../../logging/logger";

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
	} catch (err) {
		logger.error(err, "Something went wrong when getting custom rewards");
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
				return res.data;
			});
	} catch (err) {
		logger.error(err, "Something went wrong when getting user info");
		return null;
	}
};
