import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";
import { AUDIO_ON_ENDED } from "../../socket/AudioEvents";
import { AI_MESSAGE, AI_PROCESSING_REQUEST } from "../../socket/AiEvents";
import { AiDashboardContextType } from "../../types/context/dashboard/AiDashboardContextType";

// Create a context for the socket
export const AiDashboardContext = createContext<AiDashboardContextType | null>(null);

const AiDashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [aiMessages, setAiMessages] = useState<Array<string>>([]);
	const [aiProcessing, setAiProcessing] = useState(false);

	const aiMessageListener = (arg: any) => {
		const tempArray = [...aiMessages];
		tempArray.unshift(arg.message);
		setAiMessages(tempArray);
		if (arg.audio) {
			// eslint-disable-next-line prefer-const
			let audio = new Audio(`data:audio/wav;base64,${arg.audio}`);
			// Add an event listener for the 'ended' event
			audio.onended = function () {
				console.log("yoyo?");
				socket.emit(AUDIO_ON_ENDED);
				setAiProcessing(false);
			};
			audio.play();
		}
	};

	const aiProcessingRequestListener = (arg: boolean) => {
		setAiProcessing(arg);
	};

	useEffect(() => {
		if (socket !== null) {
			socket.on(AI_MESSAGE, aiMessageListener);
			socket.on(AI_PROCESSING_REQUEST, aiProcessingRequestListener);

			return () => {
				socket.off(AI_MESSAGE, aiMessageListener);
				socket.off(AI_PROCESSING_REQUEST, aiProcessingRequestListener);
			};
		}
	}, [aiMessages, socket]);

	return (
		<AiDashboardContext.Provider
			value={{
				aiMessages,
				setAiMessages,
				aiProcessing,
				setAiProcessing,
			}}
		>
			{children}
		</AiDashboardContext.Provider>
	);
};

export default AiDashboardProvider;
