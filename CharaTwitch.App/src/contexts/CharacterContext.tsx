import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "./SocketContext";
import { SocketContextType } from "../types/SocketContextType";
import { CharacterContextType } from "../types/CharacterContextType";
import { CHARACTER_CONFIG } from "../Socket/Events";

// Create a context for the socket
export const CharacterContext = createContext<CharacterContextType | null>(null);

const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [characterSelectedRedeem, setCharacterSelectedRedeem] = useState<string>("");
	const [characterQuestion, setCharacterQuestion] = useState<string>("");
	const [characterIntroParam, setCharacterIntroParam] = useState<string>("");
	const [characterRandomRedeems, setCharacterRandomRedeems] = useState<boolean>(false);
	const [characterRandomTalking, setCharacterRandomTalking] = useState<boolean>(false);
	const [characterWelcomeStrangers, setCharacterWelcomeStrangers] =
		useState<boolean>(false);
	const [characterWelcomeRaiders, setCharacterWelcomeRaiders] = useState<boolean>(false);
	const [characterRandomRedeemsFrequency, setCharacterRandomRedeemsFrequency] =
		useState<number>(0);
	const [characterRandomTalkingFrequency, setCharacterRandomTalkingFrequency] =
		useState<number>(0);
	const [characterContextParameter, setCharacterContextParameter] = useState<string>("");

	useEffect(() => {
		if (socket != null) {
			socket.on(CHARACTER_CONFIG, (arg) => {
				const {
					character_selected_redeem,
					character_question,
					character_intro_param,
					character_random_redeems,
					character_random_talking,
					character_welcome_strangers,
					character_welcome_raiders,
					character_random_redeems_frequency,
					character_random_talking_frequency,
					character_context_parameter,
				} = arg;
				setCharacterSelectedRedeem(character_selected_redeem);
				setCharacterQuestion(character_question);
				setCharacterIntroParam(character_intro_param);
				setCharacterRandomRedeems(character_random_redeems);
				setCharacterRandomTalking(character_random_talking);
				setCharacterWelcomeStrangers(character_welcome_strangers);
				setCharacterWelcomeRaiders(character_welcome_raiders);
				setCharacterRandomRedeemsFrequency(character_random_redeems_frequency);
				setCharacterRandomTalkingFrequency(character_random_talking_frequency);
				setCharacterContextParameter(character_context_parameter);
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
				characterIntroParam,
				setCharacterIntroParam,
				characterRandomRedeems,
				setCharacterRandomRedeems,
				characterRandomTalking,
				setCharacterRandomTalking,
				characterWelcomeStrangers,
				setCharacterWelcomeStrangers,
				characterWelcomeRaiders,
				setCharacterWelcomeRaiders,
				characterRandomRedeemsFrequency,
				setCharacterRandomRedeemsFrequency,
				characterRandomTalkingFrequency,
				setCharacterRandomTalkingFrequency,
				characterContextParameter,
				setCharacterContextParameter,
			}}
		>
			{children}
		</CharacterContext.Provider>
	);
};

export default CharacterProvider;
