import { Socket } from "socket.io/dist/socket";
import { fetchVoices } from "../services/cai/caiApiService";
import { authCai } from "../services/cai/caiAuthService";
import { setCaiConfig } from "../services/config/configService";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { CAI_ACCOUNT_STATUS, CAI_VOICES } from "../../socket/CaiEvents";

export const onCaiAuth = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	caiBaseUrl: string
) => {
	const caiAccessToken = await authCai();
	if (caiAccessToken == null) return socket.emit(CAI_ACCOUNT_STATUS, false);

	await setCaiConfig(caiAccessToken, caiBaseUrl);

	const voices = await fetchVoices();
	if (voices == null) return socket.emit(CAI_ACCOUNT_STATUS, false);

	socket.emit(CAI_VOICES, voices);
	socket.emit(CAI_ACCOUNT_STATUS, true);
};
