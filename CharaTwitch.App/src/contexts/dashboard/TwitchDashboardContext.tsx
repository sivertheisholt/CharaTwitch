import { createContext, useContext, useEffect, useState } from "react";
import { TwitchDashboardContextType } from "../../types/context/dashboard/TwitchDashboardContextType";
import { SocketContextType } from "../../types/context/SocketContextType";
import { SocketContext } from "../SocketContext";
import {
	TWITCH_AUTH_CB,
	TWITCH_IRC_STATUS,
	TWITCH_MESSAGE,
	TWITCH_PUB_SUB_STATUS,
	TWITCH_REDEEM,
} from "../../socket/TwitchEvents";

// Create a context for the socket
export const TwitchDashboardContext = createContext<TwitchDashboardContextType | null>(null);

const TwitchDashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [twitchAccountStatus, setTwitchAccountStatus] = useState(false);
	const [twitchMessages, setTwitchMessages] = useState<Array<any>>([]);
	const [twitchRedeems, setTwitchRedeems] = useState<Array<any>>([]);
	const [twitchIrcStatus, setTwitchIrcStatus] = useState(false);
	const [twitchPubSubStatus, setTwitchPubSubStatus] = useState(false);

	const twitchAuthCbListener = (arg: boolean) => {
		setTwitchAccountStatus(arg);
	};
	const twitchMessageListener = (arg: any) => {
		const tempArray = [...twitchMessages];
		tempArray.unshift({ username: arg.username, message: arg.message });
		setTwitchMessages(tempArray);
	};
	const twitchRedeemListener = (arg: any) => {
		const tempArray = [...twitchRedeems];
		tempArray.unshift({ username: arg.username, reward: arg.reward });
		setTwitchRedeems(tempArray);
	};
	const twitchIrcListener = (arg: any) => {
		setTwitchIrcStatus(arg as boolean);
	};
	const twitchPubSubListener = (arg: any) => {
		setTwitchPubSubStatus(arg as boolean);
	};

	useEffect(() => {
		if (socket !== null) {
			socket.on(TWITCH_AUTH_CB, twitchAuthCbListener);
			socket.on(TWITCH_MESSAGE, twitchMessageListener);
			socket.on(TWITCH_REDEEM, twitchRedeemListener);
			socket.on(TWITCH_IRC_STATUS, twitchIrcListener);
			socket.on(TWITCH_PUB_SUB_STATUS, twitchPubSubListener);
			return () => {
				// Clean up event listeners when component unmounts
				socket.off(TWITCH_AUTH_CB, twitchAuthCbListener);
				socket.off(TWITCH_MESSAGE, twitchMessageListener);
				socket.off(TWITCH_REDEEM, twitchRedeemListener);
				socket.off(TWITCH_IRC_STATUS, twitchIrcListener);
				socket.off(TWITCH_PUB_SUB_STATUS, twitchPubSubListener);
			};
		}
	}, [socket, twitchMessages, twitchRedeems]);

	return (
		<TwitchDashboardContext.Provider
			value={{
				twitchMessages,
				setTwitchMessages,
				twitchRedeems,
				setTwitchRedeems,
				twitchIrcStatus,
				setTwitchIrcStatus,
				twitchPubSubStatus,
				setTwitchPubSubStatus,
				twitchAccountStatus,
				setTwitchAccountStatus,
			}}
		>
			{children}
		</TwitchDashboardContext.Provider>
	);
};

export default TwitchDashboardProvider;
