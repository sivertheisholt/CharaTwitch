import { authTwitch } from "../services/twitchAuthService";
import { connectToTwitchIrc } from "../services/twitchIrcService";
import {
	connectToTwitchPubSub,
	subscribeToChannelPoints,
	listenToRewardRedeem,
} from "../services/twitchPubSubService";
import { getUserInfo, getCustomRewards } from "../services/twitchApiService";
import { setTwitchConfig, getItem } from "../services/config/configService";
import { sendChat, fetchTTS } from "../services/cai/caiApiService";

export const onTwitchAuth = async (socket, arg, expressApp, caiObject) => {
	const { client_id, client_secret, trigger_word, listen_to_trigger_word } = arg;

	await setTwitchConfig(client_id, client_secret, trigger_word, listen_to_trigger_word);

	const { access_token } = await authTwitch(expressApp, client_id, client_secret);
	if (access_token == null) return socket.emit("twitchAuthCb", null);

	const { preferred_username, sub } = await getUserInfo(access_token);
	if (sub == null) return socket.emit("twitchAuthCb", null);

	const customRedeems = await getCustomRewards(sub, client_id, access_token);
	if (customRedeems == null) return socket.emit("twitchAuthCb", null);

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
			socket.emit("twitchIrc", false);
		}
	);

	const pubSubConnection = await connectToTwitchPubSub();
	const subResult = await subscribeToChannelPoints(
		pubSubConnection,
		access_token,
		"228957703"
	);
	if (subResult) socket.emit("twitchPubSub", true);
	else socket.emit("twitchPubSub", false);

	listenToRewardRedeem(pubSubConnection, async (rewardData) => {
		const selectedRedeem = await getItem("twitch_selected_redeem");
		const selectedVoice = await getItem("cai_selected_voice");
		console.log(selectedVoice);
		console.log(rewardData.data.redemption.reward.id);
		if (
			selectedRedeem === rewardData.data.redemption.reward.id &&
			rewardData.data.redemption.reward.is_user_input_required
		) {
			const chatResponse = await sendChat(
				caiObject.caiChat,
				rewardData.data.user_input,
				rewardData.data.redemption.user.display_name
			);
			const audioBase64 = await fetchTTS(caiObject.cai, selectedVoice, chatResponse);

			socket.emit("caiMessage", {
				audio: audioBase64,
				message: chatResponse,
			});
		}

		socket.emit("twitchRedeem", {
			username: rewardData.data.redemption.user.display_name,
			reward: rewardData.data.redemption.reward.title,
		});
	});

	socket.emit("twitchAuthCb", {
		custom_redeems: customRedeems,
	});
};
