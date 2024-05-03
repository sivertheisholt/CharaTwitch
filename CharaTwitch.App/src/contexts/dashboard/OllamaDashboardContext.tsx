import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";
import { OllamaDashboardContextType } from "../../types/context/dashboard/OllamaDashboardContextType";
import { OLLAMA_STATUS } from "../../socket/OllamaEvents";

export const OllamaDashboardContext = createContext<OllamaDashboardContextType | null>(null);

const OllamaDashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [ollamaStatus, setOllamaStatus] = useState<boolean>();

	const ollamaStatusListener = (arg: boolean) => {
		setOllamaStatus(arg);
	};

	useEffect(() => {
		if (socket !== null) {
			socket.on(OLLAMA_STATUS, ollamaStatusListener);

			return () => {
				socket.off(OLLAMA_STATUS, ollamaStatusListener);
			};
		}
	}, [socket]);

	return (
		<OllamaDashboardContext.Provider
			value={{
				ollamaStatus,
				setOllamaStatus,
			}}
		>
			{children}
		</OllamaDashboardContext.Provider>
	);
};

export default OllamaDashboardProvider;
