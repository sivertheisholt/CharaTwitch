import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";
import { CharacterContextType } from "../../types/context/character/CharacterContextType";
import { CHARACTER_CONFIG } from "../../socket/CharacterEvents";

// Create a context for the socket
export const CharacterContext = createContext<CharacterContextType | null>(null);

const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [characterSelectedRedeem, setCharacterSelectedRedeem] = useState<string>("");
	const [characterQuestion, setCharacterQuestion] = useState<string>("");
	const [characterTTS, setCharacterTTS] = useState<string>("");
	const [characterRandomTalking, setCharacterRandomTalking] = useState<boolean>(false);
	const [characterWelcomeStrangers, setCharacterWelcomeStrangers] = useState<boolean>(false);
	const [characterWelcomeRaiders, setCharacterWelcomeRaiders] = useState<boolean>(false);
	const [characterRandomTalkingFrequency, setCharacterRandomTalkingFrequency] = useState<number>(0);
	const [characterWelcomeNewViewers, setCharacterWelcomeNewViewers] = useState<boolean>(false);
	const [characterMinimumTimeBetweenTalking, setCharacterMinimumTimeBetweenTalking] = useState<number>(0);

	useEffect(() => {
		if (socket != null) {
			socket.on(CHARACTER_CONFIG, (arg) => {
				const {
					character_selected_redeem,
					character_question,
					character_tts,
					character_random_talking,
					character_welcome_strangers,
					character_welcome_raiders,
					character_random_talking_frequency,
					character_welcome_new_viewers,
					character_minimum_time_between_talking,
				} = arg;
				setCharacterSelectedRedeem(character_selected_redeem);
				setCharacterQuestion(character_question);
				setCharacterTTS(character_tts);
				setCharacterRandomTalking(character_random_talking);
				setCharacterWelcomeStrangers(character_welcome_strangers);
				setCharacterWelcomeRaiders(character_welcome_raiders);
				setCharacterRandomTalkingFrequency(character_random_talking_frequency);
				setCharacterWelcomeNewViewers(character_welcome_new_viewers);
				setCharacterMinimumTimeBetweenTalking(character_minimum_time_between_talking);
			});
		}
	}, [socket]);

	return (
		<CharacterContext.Provider
			value={{
				characterSelectedRedeem,
				setCharacterSelectedRedeem,
				characterQuestion,
				setCharacterQuestion,
				characterTTS,
				setCharacterTTS,
				characterRandomTalking,
				setCharacterRandomTalking,
				characterWelcomeStrangers,
				setCharacterWelcomeStrangers,
				characterWelcomeRaiders,
				setCharacterWelcomeRaiders,
				characterRandomTalkingFrequency,
				setCharacterRandomTalkingFrequency,
				characterWelcomeNewViewers,
				setCharacterWelcomeNewViewers,
				characterMinimumTimeBetweenTalking,
				setCharacterMinimumTimeBetweenTalking,
			}}
		>
			{children}
		</CharacterContext.Provider>
	);
};

export default CharacterProvider;
