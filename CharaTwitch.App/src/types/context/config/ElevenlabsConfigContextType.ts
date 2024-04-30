import { ElevenlabsVoice } from "../../elevenlabs/ElevenlabsVoice";

export type ElevenlabsConfigContextType = {
	elevenlabsApiKey: string;
	setElevenlabsApiKey: React.Dispatch<React.SetStateAction<string>>;
	elevenlabsVoices: Array<ElevenlabsVoice>;
	setElevenlabsVoices: React.Dispatch<React.SetStateAction<ElevenlabsVoice[]>>;
	elevenlabsSelectedVoice: string;
	setElevenlabsSelectedVoice: React.Dispatch<React.SetStateAction<string>>;
};
