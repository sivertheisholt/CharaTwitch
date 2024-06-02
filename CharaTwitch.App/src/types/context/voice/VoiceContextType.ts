export type VoiceContextType = {
	transcript: string;
	voiceEnabled: boolean;
	handleVoiceEnabled: (voiceEnabled: boolean) => void;
};
