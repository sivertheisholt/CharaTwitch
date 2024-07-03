import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";
import { CoquiDashboardContextType } from "../../types/context/dashboard/CoquiDashboardContextType";
import { COQUI_STATUS } from "../../socket/CoquiEvents";

export const CoquiDashboardContext = createContext<CoquiDashboardContextType | null>(null);

const CoquiDashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [coquiStatus, setCoquiStatus] = useState<boolean>();

	const coquiAccountStatusListener = (arg: boolean) => {
		setCoquiStatus(arg);
	};

	useEffect(() => {
		if (socket !== null) {
			socket.on(COQUI_STATUS, coquiAccountStatusListener);

			return () => {
				socket.off(COQUI_STATUS, coquiAccountStatusListener);
			};
		}
	}, [socket]);

	return (
		<CoquiDashboardContext.Provider
			value={{
				coquiStatus,
				setCoquiStatus,
			}}
		>
			{children}
		</CoquiDashboardContext.Provider>
	);
};

export default CoquiDashboardProvider;
