import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";
import { ElevenlabsConfigContextType } from "../../types/context/config/ElevenlabsConfigContextType";
import { ElevenlabsVoice } from "../../types/elevenlabs/ElevenlabsVoice";
import { ELEVENLABS_CONFIG, ELEVENLABS_VOICES } from "../../socket/ElevenlabsEvents";
import { ElevenlabsConfig } from "../../types/socket/ElevenlabsConfig";

// Create a context for the socket
export const ElevenlabsConfigContext = createContext<ElevenlabsConfigContextType | null>(null);

const ElevenlabsConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [elevenlabsApiKey, setElevenlabsApiKey] = useState<string>("");
	const [elevenlabsVoices, setElevenlabsVoices] = useState<Array<ElevenlabsVoice>>([]);
	const [elevenlabsSelectedVoice, setElevenlabsSelectedVoice] = useState<string>("");

	const elevenlabsVoicesListener = (arg: Array<ElevenlabsVoice>) => {
		setElevenlabsVoices(arg);
	};
	const elevenlabsConfigListener = (arg: ElevenlabsConfig) => {
		const { elevenlabs_api_key, elevenlabs_selected_voice } = arg;
		setElevenlabsApiKey(elevenlabs_api_key);
		setElevenlabsSelectedVoice(elevenlabs_selected_voice);
	};

	useEffect(() => {
		if (socket != null) {
			socket.on(ELEVENLABS_CONFIG, elevenlabsConfigListener);
			socket.on(ELEVENLABS_VOICES, elevenlabsVoicesListener);

			return () => {
				socket.off(ELEVENLABS_VOICES, elevenlabsVoicesListener);
				socket.off(ELEVENLABS_CONFIG, elevenlabsConfigListener);
			};
		}
	}, [socket]);

	return (
		<ElevenlabsConfigContext.Provider
			value={{
				elevenlabsApiKey,
				setElevenlabsApiKey,
				elevenlabsVoices,
				setElevenlabsVoices,
				elevenlabsSelectedVoice,
				setElevenlabsSelectedVoice,
			}}
		>
			{children}
		</ElevenlabsConfigContext.Provider>
	);
};

export default ElevenlabsConfigProvider;
