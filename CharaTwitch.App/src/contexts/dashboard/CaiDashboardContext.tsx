import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";
import { CaiDashboardContextType } from "../../types/context/dashboard/CaiDashboardContextType";
import { CAI_ACCOUNT_STATUS } from "../../socket/CaiEvents";

export const CaiDashboardContext = createContext<CaiDashboardContextType | null>(null);

const CaiDashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [caiAccountStatus, setCaiAccountStatus] = useState<boolean>();

	const caiAccountStatusListener = (arg: boolean) => {
		setCaiAccountStatus(arg);
	};

	useEffect(() => {
		if (socket !== null) {
			socket.on(CAI_ACCOUNT_STATUS, caiAccountStatusListener);

			return () => {
				socket.off(CAI_ACCOUNT_STATUS, caiAccountStatusListener);
			};
		}
	}, [socket]);

	return (
		<CaiDashboardContext.Provider
			value={{
				caiAccountStatus,
				setCaiAccountStatus,
			}}
		>
			{children}
		</CaiDashboardContext.Provider>
	);
};

export default CaiDashboardProvider;
