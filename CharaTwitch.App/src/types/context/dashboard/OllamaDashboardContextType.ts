export type OllamaDashboardContextType = {
	caiVoices: Array<any>;
	setCaiVoices: React.Dispatch<React.SetStateAction<any[]>>;
	aiMessages: Array<string>;
	setAiMessages: React.Dispatch<React.SetStateAction<string[]>>;
	aiProcessing: boolean;
};
