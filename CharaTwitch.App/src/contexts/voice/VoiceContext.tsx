import { createContext, useContext, useEffect, useRef, useState } from "react";
import { VoiceContextType } from "../../types/context/voice/VoiceContextType";
import hark from "hark";
import { VOICE_RECORDING_TRANSCRIPT, VOICE_RECORDING_BLOBARRAY } from "../../socket/VoiceRecordingEvents";
import { SocketContextType } from "../../types/context/SocketContextType";
import { SocketContext } from "../SocketContext";
import { CHARACTER_VOICE_ENABLED } from "../../socket/CharacterEvents";

export const VoiceContext = createContext<VoiceContextType | null>(null);

const VoiceContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const initialized = useRef(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const voiceEnabledRef = useRef<boolean>(false);
	const [recording, setRecording] = useState<boolean>(false);
	const [transcript, setTranscript] = useState<string>("");
	const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);

	const handleVoiceRecordingTranscript = (transcript: string) => {
		setTranscript(transcript);
	};

	const handleVoiceEnabled = (voiceEnabled: boolean) => {
		setVoiceEnabled(voiceEnabled);
		voiceEnabledRef.current = voiceEnabled;
	};

	useEffect(() => {
		if (socket !== null) {
			socket.on(CHARACTER_VOICE_ENABLED, handleVoiceEnabled);
			socket.on(VOICE_RECORDING_TRANSCRIPT, handleVoiceRecordingTranscript);

			return () => {
				socket.off(CHARACTER_VOICE_ENABLED, handleVoiceEnabled);
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
						const harkthing = hark(stream, { interval: 50 });

						const mediaRecorder = new MediaRecorder(stream);
						mediaRecorderRef.current = mediaRecorder;

						mediaRecorder.ondataavailable = (event) => {
							audioChunksRef.current.push(event.data);
						};

						mediaRecorder.onstop = () => {
							if (voiceEnabledRef.current) {
								socket.emit(VOICE_RECORDING_BLOBARRAY, audioChunksRef.current);
							}
							audioChunksRef.current = [];
						};

						let stopTimeout: NodeJS.Timeout | null = null;

						harkthing.on("speaking", () => {
							console.log("speaking");
							if (mediaRecorder.state !== "recording") {
								mediaRecorder.start();
								setRecording(true);
							}
							if (stopTimeout) {
								clearTimeout(stopTimeout);
								stopTimeout = null;
							}
						});

						harkthing.on("stopped_speaking", () => {
							console.log("stopped_speaking");
							if (mediaRecorder.state === "recording") {
								// Add a delay before stopping the recording
								stopTimeout = setTimeout(() => {
									mediaRecorder.stop();
									setRecording(false);
								}, 1500); // 2 seconds delay
							}
						});
					})
					.catch((err) => {
						console.error("Error accessing media devices.", err);
					});
			}
		}
	}, [recording, socket]);
	return (
		<VoiceContext.Provider value={{ transcript, voiceEnabled, handleVoiceEnabled }}>{children}</VoiceContext.Provider>
	);
};

export default VoiceContextProvider;
