import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";
import { TwitchConfigContextType } from "../../types/context/config/TwitchConfigContextType";
import { TWITCH_CONFIG, TWITCH_CUSTOM_REDEEMS } from "../../socket/TwitchEvents";
import { CustomRedeemType } from "../../types/twitch/CustomRedeemType";
import { TwitchConfigType } from "../../types/socket/TwitchConfigType";

// Create a context for the socket
export const TwitchConfigContext = createContext<TwitchConfigContextType | null>(null);

const TwitchConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [twitchClientSecret, setTwitchClientSecret] = useState<string>("");
	const [twitchClientId, setTwitchClientId] = useState<string>("");
	const [twitchSelectedRedeem, setTwitchSelectedRedeem] = useState<string>("");
	const [twitchCustomRedeems, setTwitchCustomRedeems] = useState<Array<CustomRedeemType>>([]);

	const twitchRedeemsListener = (arg: Array<CustomRedeemType>) => {
		const customRedeemsWithUserInput = arg.filter((redeem: CustomRedeemType) => redeem.is_user_input_required === true);
		setTwitchCustomRedeems(customRedeemsWithUserInput);
	};

	const twitchConfigListener = (arg: TwitchConfigType) => {
		const { twitch_client_id, twitch_client_secret, twitch_selected_redeem } = arg;
		setTwitchClientId(twitch_client_id);
		setTwitchClientSecret(twitch_client_secret);
		setTwitchSelectedRedeem(twitch_selected_redeem);
	};

	useEffect(() => {
		if (socket != null) {
			socket.on(TWITCH_CONFIG, twitchConfigListener);
			socket.on(TWITCH_CUSTOM_REDEEMS, twitchRedeemsListener);

			return () => {
				// Clean up event listeners when component unmounts
				socket.off(TWITCH_CUSTOM_REDEEMS, twitchRedeemsListener);
				socket.off(TWITCH_CONFIG, twitchConfigListener);
			};
		}
	}, [socket]);

	return (
		<TwitchConfigContext.Provider
			value={{
				twitchClientSecret,
				setTwitchClientSecret,
				twitchClientId,
				setTwitchClientId,
				twitchSelectedRedeem,
				setTwitchSelectedRedeem,
				twitchCustomRedeems,
				setTwitchCustomRedeems,
			}}
		>
			{children}
		</TwitchConfigContext.Provider>
	);
};

export default TwitchConfigProvider;
