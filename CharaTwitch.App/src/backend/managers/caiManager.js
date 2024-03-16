import { fetchVoices, checkServer } from "../services/cai/caiApiService";
import { setCaiConfig } from "../services/config/configService";

export const onCaiAuth = async (socket, arg) => {
	const { access_token, character_id, base_url } = arg;
	await setCaiConfig(access_token, character_id, base_url);
	console.log(base_url);
	const res = await checkServer(base_url, access_token);
	if (!res) return socket.emit("caiAuthCb", null);

	const voices = await fetchVoices(base_url, access_token);
	if (voices == null) return socket.emit("caiAuthCb", null);

	socket.emit("caiAuthCb", {
		voices: voices,
	});
	socket.emit("caiAccountStatus", true);
};
