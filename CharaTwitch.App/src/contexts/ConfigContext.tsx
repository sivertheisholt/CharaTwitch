import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "./SocketContext";
import { SocketContextType } from "../types/SocketContextType";
import { ConfigContextType } from "../types/ConfigContextType";

// Create a context for the socket
export const ConfigContext = createContext<ConfigContextType | null>(null);

const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [twitchClientSecret, setTwitchClientSecret] = useState<string>("");
	const [twitchClientId, setTwitchClientId] = useState<string>("");
	const [twitchSelectedRedeem, setTwitchSelectedRedeem] = useState<string>("");
	const [caiCharacterId, setCaiCharacterId] = useState<string>("");
	const [caiSelectedVoice, setCaiSelectedVoice] = useState<number>(0);
	const [caiBaseUrl, setCaiBaseUrl] = useState<string>("");

	useEffect(() => {
		if (socket != null) {
			socket.on("config", (arg) => {
				const { twitch_config, cai_config } = arg;
				setTwitchClientId(twitch_config.client_id);
				setTwitchClientSecret(twitch_config.client_secret);
				setTwitchSelectedRedeem(twitch_config.selected_redeem);
				setCaiCharacterId(cai_config.character_id);
				setCaiSelectedVoice(cai_config.selected_voice);
				setCaiBaseUrl(cai_config.base_url);
			});
		}
	}, [socket]);

	return (
		<ConfigContext.Provider
			value={{
				twitchClientSecret,
				setTwitchClientSecret,
				twitchClientId,
				setTwitchClientId,
				twitchSelectedRedeem,
				setTwitchSelectedRedeem,
				caiCharacterId,
				setCaiCharacterId,
				caiSelectedVoice,
				setCaiSelectedVoice,
				caiBaseUrl,
				setCaiBaseUrl,
			}}
		>
			{children}
		</ConfigContext.Provider>
	);
};

export default ConfigProvider;
