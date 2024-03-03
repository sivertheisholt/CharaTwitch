const { authCai } = require("../services/cai/caiAuthService");
const { initChat, fetchVoices } = require("../services/cai/caiApiService");
const { setCaiConfig } = require("../services/config/configService");

const onCaiAuth = async (socket, arg, cai, caiObject) => {
	const { access_token, character_id } = arg;
	await setCaiConfig(access_token, character_id);

	const res = await authCai(cai, access_token);
	if (!res) return socket.emit("caiAuthCb", null);

	caiObject.caiChat = await initChat(cai, character_id);
	const voices = await fetchVoices(cai);

	socket.emit("caiAuthCb", {
		voices: voices,
	});
	socket.emit("caiAccountStatus", true);
};

module.exports = { onCaiAuth };
