import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";
import { OpenAiConfigContextType } from "../../types/context/config/OpenAiConfigContextType";
import { OpenAiConfigType } from "../../types/socket/OpenAiConfigType";
import { OPENAI_CONFIG } from "../../socket/OpenAiEvents.";

// Create a context for the socket
export const OpenAiConfigContext = createContext<OpenAiConfigContextType | null>(null);

const OpenAiConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [openAiApiKey, setOpenAiApiKey] = useState<string>("");

	const openAiConfigListener = (arg: OpenAiConfigType) => {
		const { openai_api_key } = arg;
		setOpenAiApiKey(openai_api_key);
	};

	useEffect(() => {
		if (socket != null) {
			socket.on(OPENAI_CONFIG, openAiConfigListener);

			return () => {
				socket.off(OPENAI_CONFIG, openAiConfigListener);
			};
		}
	}, [socket]);

	return (
		<OpenAiConfigContext.Provider
			value={{
				openAiApiKey,
				setOpenAiApiKey,
			}}
		>
			{children}
		</OpenAiConfigContext.Provider>
	);
};

export default OpenAiConfigProvider;
