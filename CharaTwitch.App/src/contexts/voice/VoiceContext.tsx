import { createContext, useContext, useEffect, useRef, useState } from "react";
import { VoiceContextType } from "../../types/context/voice/VoiceContextType";
import hark from "hark";
import { VOICE_RECORDING_TRANSCRIPT, VOICE_RECORDING_BLOBARRAY } from "../../socket/VoiceRecordingEvents";
import { SocketContextType } from "../../types/context/SocketContextType";
import { SocketContext } from "../SocketContext";

export const VoiceContext = createContext<VoiceContextType | null>(null);

const VoiceContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const initialized = useRef(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const [recording, setRecording] = useState<boolean>(false);
	const [transcript, setTranscript] = useState<string>("");

	const handleVoiceRecordingTranscript = (transcript: string) => {
		console.log(transcript);
		setTranscript(transcript);
	};

	useEffect(() => {
		if (socket !== null) {
			socket.on(VOICE_RECORDING_TRANSCRIPT, handleVoiceRecordingTranscript);

			return () => {
				socket.off(VOICE_RECORDING_TRANSCRIPT, handleVoiceRecordingTranscript);
			};
		}
	}, [socket]);

	useEffect(() => {
		if (socket !== null) {
			if (!initialized.current) {
				initialized.current = true;
				navigator.mediaDevices
					.getUserMedia({ audio: true })
					.then((stream) => {
						const harkthing = hark(stream);

						const mediaRecorder = new MediaRecorder(stream);
						mediaRecorderRef.current = mediaRecorder;

						mediaRecorder.ondataavailable = (event) => {
							audioChunksRef.current.push(event.data);
						};

						mediaRecorder.onstop = () => {
							socket.emit(VOICE_RECORDING_BLOBARRAY, audioChunksRef.current);
							audioChunksRef.current = [];
						};

						harkthing.on("speaking", () => {
							console.log("speaking");
							if (mediaRecorder.state !== "recording") {
								mediaRecorder.start();
								setRecording(true);
							}
						});

						harkthing.on("stopped_speaking", () => {
							console.log("stopped_speaking");
							if (mediaRecorder.state === "recording") {
								mediaRecorder.stop();
								setRecording(false);
							}
						});
					})
					.catch((err) => {
						console.error("Error accessing media devices.", err);
					});
			}
		}
	}, [recording, socket]);
	return <VoiceContext.Provider value={{}}>{children}</VoiceContext.Provider>;
};

export default VoiceContextProvider;
