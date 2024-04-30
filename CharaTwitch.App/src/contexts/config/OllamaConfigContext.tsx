import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";
import { OllamaConfigContextType } from "../../types/context/config/OllamaConfigContextType";
import { OLLAMA_CONFIG } from "../../socket/OllamaEvents";
import { OllamaConfig } from "../../types/socket/OllamaConfig";

// Create a context for the socket
export const OllamaConfigContext = createContext<OllamaConfigContextType | null>(null);

const OllamaConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [ollamaModelName, setOllamaModelName] = useState<string>("");
	const [ollamaBaseUrl, setOllamaBaseUrl] = useState<string>("");

	const ollamaConfigListener = (arg: OllamaConfig) => {
		const { ollama_model_name, ollama_base_url } = arg;
		setOllamaModelName(ollama_model_name);
		setOllamaBaseUrl(ollama_base_url);
	};

	useEffect(() => {
		if (socket != null) {
			socket.on(OLLAMA_CONFIG, ollamaConfigListener);

			return () => {
				socket.off(OLLAMA_CONFIG, ollamaConfigListener);
			};
		}
	}, [socket]);

	return (
		<OllamaConfigContext.Provider
			value={{
				ollamaModelName,
				setOllamaModelName,
				ollamaBaseUrl,
				setOllamaBaseUrl,
			}}
		>
			{children}
		</OllamaConfigContext.Provider>
	);
};

export default OllamaConfigProvider;
