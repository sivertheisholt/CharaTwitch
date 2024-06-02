export type CharacterContextType = {
	characterSelectedRedeem: string;
	setCharacterSelectedRedeem: React.Dispatch<React.SetStateAction<string>>;
	characterQuestion: string;
	setCharacterQuestion: React.Dispatch<React.SetStateAction<string>>;
	characterTTS: string;
	setCharacterTTS: React.Dispatch<React.SetStateAction<string>>;
	characterRandomTalking: boolean;
	setCharacterRandomTalking: React.Dispatch<React.SetStateAction<boolean>>;
	characterWelcomeStrangers: boolean;
	setCharacterWelcomeStrangers: React.Dispatch<React.SetStateAction<boolean>>;
	characterWelcomeRaiders: boolean;
	setCharacterWelcomeRaiders: React.Dispatch<React.SetStateAction<boolean>>;
	characterRandomTalkingFrequency: number;
	setCharacterRandomTalkingFrequency: React.Dispatch<React.SetStateAction<number>>;
	characterWelcomeNewViewers: boolean;
	setCharacterWelcomeNewViewers: React.Dispatch<React.SetStateAction<boolean>>;
	characterMinimumTimeBetweenTalking: number;
	setCharacterMinimumTimeBetweenTalking: React.Dispatch<React.SetStateAction<number>>;
};
