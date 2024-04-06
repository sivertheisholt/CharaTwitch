import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { fetchVoices, checkServer } from "../services/cai/caiApiService";
import { setCaiConfig } from "../services/config/configService";
import { Socket } from "socket.io/dist/socket";

export const onCaiAuth = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	arg: any
) => {
	const { access_token, character_id, base_url } = arg;
	await setCaiConfig(access_token, character_id, base_url);
	const res = await checkServer();
	if (!res) return socket.emit("caiAuthCb", null);

	const voices = await fetchVoices();
	if (voices == null) return socket.emit("caiAuthCb", null);

	socket.emit("caiAuthCb", {
		voices: voices,
	});
	socket.emit("caiAccountStatus", true);
};
