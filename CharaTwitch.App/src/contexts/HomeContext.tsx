import { createContext, useContext, useEffect, useState } from "react";
import { HomeContextType } from "../types/HomeContextType";
import { SocketContext } from "./SocketContext";
import { SocketContextType } from "../types/SocketContextType";
import { CustomRedeem } from "../types/twitch/CustomRedeem";
import { CAI_PROCESSING_REQUEST } from "../Socket/Events";

// Create a context for the socket
export const HomeContext = createContext<HomeContextType | null>(null);

const HomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [twitchAccountStatus, setTwitchAccountStatus] = useState(false);
	const [twitchMessages, setTwitchMessages] = useState<Array<any>>([]);
	const [twitchRedeems, setTwitchRedeems] = useState<Array<any>>([]);
	const [twitchIrcStatus, setTwitchIrcStatus] = useState(false);
	const [twitchPubSubStatus, setTwitchPubSubStatus] = useState(false);
	const [twitchCustomRedeems, setTwitchCustomRedeems] = useState<Array<any>>([]);
	const [caiAccountStatus, setCaiAccountStatus] = useState(false);
	const [caiVoices, setCaiVoices] = useState<Array<any>>([]);
	const [caiMessages, setCaiMessages] = useState<Array<string>>([]);
	const [caiProcessing, setCaiProcessing] = useState(false);

	useEffect(() => {
		if (socket !== null) {
			const twitchAuthCbListener = (arg: any) => {
				setTwitchAccountStatus(true);
				const customRedeemsWithUserInput = arg.custom_redeems.filter(
					(redeem: CustomRedeem) => redeem.is_user_input_required === true
				);
				setTwitchCustomRedeems(customRedeemsWithUserInput);
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
			const caiAccountStatusListener = (arg: any) => {
				setCaiAccountStatus(arg as boolean);
			};
			const caiAuthCbListener = (arg: any) => {
				setCaiVoices(arg.voices);
			};
			const caiMessageListener = (arg: any) => {
				const tempArray = [...caiMessages];
				tempArray.unshift(arg.message);
				setCaiMessages(tempArray);
				if (arg.audio) {
					// eslint-disable-next-line prefer-const
					let audio = new Audio(`data:audio/wav;base64,${arg.audio}`);
					// Add an event listener for the 'ended' event
					audio.onended = function () {
						console.log("Audio playback finished.");
						socket.emit("audioOnEnded");
						setCaiProcessing(false);
					};
					audio.play();
				}
			};

			const caiProcessingRequestListener = (arg: boolean) => {
				setCaiProcessing(arg);
			};

			socket.on("twitchAuthCb", twitchAuthCbListener);
			socket.on("twitchMessage", twitchMessageListener);
			socket.on("twitchRedeem", twitchRedeemListener);
			socket.on("twitchIrc", twitchIrcListener);
			socket.on("twitchPubSub", twitchPubSubListener);
			socket.on("caiMessage", caiMessageListener);
			socket.on("caiAccountStatus", caiAccountStatusListener);
			socket.on("caiAuthCb", caiAuthCbListener);
			socket.on(CAI_PROCESSING_REQUEST, caiProcessingRequestListener);
			return () => {
				// Clean up event listeners when component unmounts
				socket.off("twitchAuthCb", twitchAuthCbListener);
				socket.off("twitchMessage", twitchMessageListener);
				socket.off("twitchRedeem", twitchRedeemListener);
				socket.off("twitchIrc", twitchIrcListener);
				socket.off("twitchPubSub", twitchPubSubListener);
				socket.off("caiMessage", caiMessageListener);
				socket.off("caiAccountStatus", caiAccountStatusListener);
				socket.off("caiAuthCb", caiAuthCbListener);
				socket.off(CAI_PROCESSING_REQUEST, caiProcessingRequestListener);
			};
		}
	}, [caiMessages, socket, twitchMessages, twitchRedeems]);

	return (
		<HomeContext.Provider
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
				twitchCustomRedeems,
				setTwitchCustomRedeems,
				caiAccountStatus,
				setCaiAccountStatus,
				caiVoices,
				setCaiVoices,
				caiMessages,
				setCaiMessages,
				caiProcessing,
			}}
		>
			{children}
		</HomeContext.Provider>
	);
};

export default HomeProvider;
