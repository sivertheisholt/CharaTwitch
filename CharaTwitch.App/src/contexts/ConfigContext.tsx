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
	const [caiAccessToken, setCaiAccessToken] = useState<string>("");
	const [caiCharacterId, setCaiCharacterId] = useState<string>("");

	useEffect(() => {
		if (socket != null) {
			socket.on("config", (arg) => {
				console.log(arg);
				const { twitch_config, cai_config } = arg;
				setTwitchClientId(twitch_config.client_id);
				setTwitchClientSecret(twitch_config.client_secret);
				setTwitchtriggerWord(twitch_config.trigger_word);
				setTwitchListenToTriggerWord(twitch_config.listen_to_trigger_word);
				setCaiAccessToken(cai_config.access_token);
				setCaiCharacterId(cai_config.character_id);
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
				caiAccessToken,
				setCaiAccessToken,
				caiCharacterId,
				setCaiCharacterId,
			}}
		>
			{children}
		</ConfigContext.Provider>
	);
};

export default ConfigProvider;
