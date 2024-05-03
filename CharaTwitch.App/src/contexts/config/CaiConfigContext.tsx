import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";
import { CaiConfigContextType } from "../../types/context/config/CaiConfigContextType";
import { CaiConfigType } from "../../types/socket/CaiConfigType";
import { CaiVoice } from "../../types/cai/CaiVoice";
import { CAI_CONFIG, CAI_VOICES } from "../../socket/CaiEvents";

// Create a context for the socket
export const CaiConfigContext = createContext<CaiConfigContextType | null>(null);

const CaiConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [caiVoices, setCaiVoices] = useState<Array<CaiVoice>>([]);
	const [caiSelectedVoice, setCaiSelectedVoice] = useState<number>(0);
	const [caiBaseUrl, setCaiBaseUrl] = useState<string>("");

	const caiVoicesListener = (arg: Array<CaiVoice>) => {
		setCaiVoices(arg);
	};
	const caiConfigListener = (arg: CaiConfigType) => {
		const { cai_base_url, cai_selected_voice } = arg;
		console.log(cai_base_url);
		setCaiBaseUrl(cai_base_url);
		setCaiSelectedVoice(cai_selected_voice);
	};

	useEffect(() => {
		if (socket != null) {
			socket.on(CAI_CONFIG, caiConfigListener);
			socket.on(CAI_VOICES, caiVoicesListener);

			return () => {
				socket.off(CAI_VOICES, caiVoicesListener);
				socket.off(CAI_CONFIG, caiConfigListener);
			};
		}
	}, [socket]);

	return (
		<CaiConfigContext.Provider
			value={{
				caiVoices,
				setCaiVoices,
				caiSelectedVoice,
				setCaiSelectedVoice,
				caiBaseUrl,
				setCaiBaseUrl,
			}}
		>
			{children}
		</CaiConfigContext.Provider>
	);
};

export default CaiConfigProvider;
