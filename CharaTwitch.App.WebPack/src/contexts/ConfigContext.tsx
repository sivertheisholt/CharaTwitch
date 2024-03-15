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
	const [twitchTriggerWord, setTwitchtriggerWord] = useState<string>("");
	const [twitchListenToTriggerWord, setTwitchListenToTriggerWord] =
		useState<boolean>(false);
	const [twitchSelectedRedeem, setTwitchSelectedRedeem] = useState<string>("");
	const [caiAccessToken, setCaiAccessToken] = useState<string>("");
	const [caiCharacterId, setCaiCharacterId] = useState<string>("");
	const [caiSelectedVoice, setCaiSelectedVoice] = useState<number>(0);

	useEffect(() => {
		if (socket != null) {
			socket.on("config", (arg) => {
				console.log(arg);
				const { twitch_config, cai_config } = arg;
				setTwitchClientId(twitch_config.client_id);
				setTwitchClientSecret(twitch_config.client_secret);
				setTwitchtriggerWord(twitch_config.trigger_word);
				setTwitchListenToTriggerWord(twitch_config.listen_to_trigger_word);
				setTwitchSelectedRedeem(twitch_config.selected_redeem);
				setCaiAccessToken(cai_config.access_token);
				setCaiCharacterId(cai_config.character_id);
				setCaiSelectedVoice(cai_config.selected_voice);
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
				twitchTriggerWord,
				setTwitchtriggerWord,
				twitchListenToTriggerWord,
				setTwitchListenToTriggerWord,
				twitchSelectedRedeem,
				setTwitchSelectedRedeem,
				caiAccessToken,
				setCaiAccessToken,
				caiCharacterId,
				setCaiCharacterId,
				caiSelectedVoice,
				setCaiSelectedVoice,
			}}
		>
			{children}
		</ConfigContext.Provider>
	);
};

export default ConfigProvider;
