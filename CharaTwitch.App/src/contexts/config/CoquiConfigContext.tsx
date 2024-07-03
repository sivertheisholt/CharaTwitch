import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";
import { CoquiContextType } from "../../types/context/config/CoquiContextType";
import { CoquiConfigType } from "../../types/socket/CoquiConfigType";
import { COQUI_CONFIG } from "../../socket/CoquiEvents";

// Create a context for the socket
export const CoquiConfigContext = createContext<CoquiContextType | null>(null);

const coquiConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [coquiBaseUrl, setCoquiBaseUrl] = useState<string>("");

	const coquiConfigListener = (arg: CoquiConfigType) => {
		const { coqui_base_url } = arg;
		setCoquiBaseUrl(coqui_base_url);
	};

	useEffect(() => {
		if (socket != null) {
			socket.on(COQUI_CONFIG, coquiConfigListener);

			return () => {
				socket.off(COQUI_CONFIG, coquiConfigListener);
			};
		}
	}, [socket]);

	return (
		<CoquiConfigContext.Provider
			value={{
				coquiBaseUrl,
				setCoquiBaseUrl,
			}}
		>
			{children}
		</CoquiConfigContext.Provider>
	);
};

export default coquiConfigProvider;
