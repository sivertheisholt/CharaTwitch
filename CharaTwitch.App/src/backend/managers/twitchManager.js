import { authTwitch } from "../services/twitchAuthService";
import { TwitchIrc } from "../services/twitchIrcService";
import {
	connectToTwitchPubSub,
	subscribeToChannelPoints,
	listenToRewardRedeem,
} from "../services/twitchPubSubService";
import { getUserInfo, getCustomRewards } from "../services/twitchApiService";
import { setTwitchConfig, getItem } from "../services/config/configService";
import { sendChat, fetchTTS } from "../services/cai/caiApiService";

export const onTwitchAuth = async (socket, arg, expressApp) => {
	const { client_id, client_secret, trigger_word, listen_to_trigger_word } = arg;

	await setTwitchConfig(client_id, client_secret, trigger_word, listen_to_trigger_word);

	const { access_token } = await authTwitch(expressApp, client_id, client_secret);
	if (access_token == null) return socket.emit("twitchAuthCb", null);

	const { preferred_username, sub } = await getUserInfo(access_token);
	if (sub == null) return socket.emit("twitchAuthCb", null);

	const customRedeems = await getCustomRewards(sub, client_id, access_token);
	if (customRedeems == null) return socket.emit("twitchAuthCb", null);

	const twitchIrc = new TwitchIrc(
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

	twitchIrc.connectToTwitchIrc();

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
		const caiAccessToken = await getItem("cai_access_token");
		const caiBaseUrl = await getItem("cai_base_url");
		const caiCharacterId = await getItem("cai_character_id");
		if (
			selectedRedeem === rewardData.data.redemption.reward.id &&
			rewardData.data.redemption.reward.is_user_input_required
		) {
			socket.emit("twitchRedeem", {
				username: rewardData.data.redemption.user.display_name,
				reward: rewardData.data.redemption.reward.title,
			});

			const chatResponse = await sendChat(
				caiBaseUrl,
				caiAccessToken,
				caiCharacterId,
				rewardData.data.redemption.user_input,
				rewardData.data.redemption.user.display_name
			);
			const audioBase64 = await fetchTTS(
				caiBaseUrl,
				caiAccessToken,
				selectedVoice,
				chatResponse
			);

			socket.emit("caiMessage", {
				audio: audioBase64,
				message: chatResponse,
			});

			twitchIrc.sendMessage(chatResponse);
		}
	});

	socket.emit("twitchAuthCb", {
		custom_redeems: customRedeems,
	});
};
