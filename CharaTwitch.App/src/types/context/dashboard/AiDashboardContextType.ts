export type AiDashboardContextType = {
	aiMessages: Array<string>;
	setAiMessages: React.Dispatch<React.SetStateAction<string[]>>;
	aiProcessing: boolean;
	setAiProcessing: React.Dispatch<React.SetStateAction<boolean>>;
	aiConnectedStatus: boolean;
	setAiConnectedStatus: React.Dispatch<React.SetStateAction<boolean>>;
};
