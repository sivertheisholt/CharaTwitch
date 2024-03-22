export type ConfigContextType = {
	twitchClientSecret: string;
	setTwitchClientSecret: React.Dispatch<React.SetStateAction<string>>;
	twitchClientId: string;
	setTwitchClientId: React.Dispatch<React.SetStateAction<string>>;
	twitchSelectedRedeem: string;
	setTwitchSelectedRedeem: React.Dispatch<React.SetStateAction<string>>;
	caiAccessToken: string;
	setCaiAccessToken: React.Dispatch<React.SetStateAction<string>>;
	caiCharacterId: string;
	setCaiCharacterId: React.Dispatch<React.SetStateAction<string>>;
	caiSelectedVoice: number;
	setCaiSelectedVoice: React.Dispatch<React.SetStateAction<number>>;
	caiBaseUrl: string;
	setCaiBaseUrl: React.Dispatch<React.SetStateAction<string>>;
};
