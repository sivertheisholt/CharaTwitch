import { CaiVoice } from "../../cai/CaiVoice";

export type CaiConfigContextType = {
	caiVoices: Array<CaiVoice>;
	setCaiVoices: React.Dispatch<React.SetStateAction<CaiVoice[]>>;
	caiSelectedVoice: number;
	setCaiSelectedVoice: React.Dispatch<React.SetStateAction<number>>;
	caiBaseUrl: string;
	setCaiBaseUrl: React.Dispatch<React.SetStateAction<string>>;
};
