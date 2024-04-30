import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";
import { OllamaDashboardContextType } from "../../types/context/dashboard/OllamaDashboardContextType";
import { AUDIO_ON_ENDED } from "../../socket/AudioEvents";
import { AI_MESSAGE, AI_PROCESSING_REQUEST } from "../../socket/AiEvents";

// Create a context for the socket
export const OllamaDashboardContext = createContext<OllamaDashboardContextType | null>(null);

const OllamaDashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [caiVoices, setCaiVoices] = useState<Array<any>>([]);
	const [aiMessages, setAiMessages] = useState<Array<string>>([]);
	const [aiProcessing, setAiProcessing] = useState(false);

	const caiMessageListener = (arg: any) => {
		const tempArray = [...aiMessages];
		tempArray.unshift(arg.message);
		setAiMessages(tempArray);
		if (arg.audio) {
			// eslint-disable-next-line prefer-const
			let audio = new Audio(`data:audio/wav;base64,${arg.audio}`);
			// Add an event listener for the 'ended' event
			audio.onended = function () {
				socket.emit(AUDIO_ON_ENDED);
				setAiProcessing(false);
			};
			audio.play();
		}
	};

	const caiProcessingRequestListener = (arg: boolean) => {
		setAiProcessing(arg);
	};

	useEffect(() => {
		if (socket !== null) {
			socket.on(AI_MESSAGE, caiMessageListener);
			socket.on(AI_PROCESSING_REQUEST, caiProcessingRequestListener);

			return () => {
				socket.off(AI_MESSAGE, caiMessageListener);
				socket.off(AI_PROCESSING_REQUEST, caiProcessingRequestListener);
			};
		}
	}, [aiMessages, socket]);

	return (
		<OllamaDashboardContext.Provider
			value={{
				caiVoices,
				setCaiVoices,
				aiMessages,
				setAiMessages,
				aiProcessing,
			}}
		>
			{children}
		</OllamaDashboardContext.Provider>
	);
};

export default OllamaDashboardProvider;
