import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";
import { OllamaParametersContextType } from "../../types/context/ollama/OllamaParametersContextType";
import { OllamaParametersType } from "../../types/socket/OllamaParametersType";
import { OLLAMA_PARAMETERS } from "../../socket/OllamaParametersEvents";

export const OllamaParametersContext = createContext<OllamaParametersContextType | null>(null);

const OllamaParametersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [ollamaParametersMiroStat, setOllamaParametersMiroStat] = useState<number>(0);
	const [ollamaParametersMiroStatEta, setOllamaParametersMiroStatEta] = useState<number>(0);
	const [ollamaParametersNumCtx, setOllamaParametersNumCtx] = useState<number>(0);
	const [ollamaParametersRepeatLastN, setOllamaParametersRepeatLastN] = useState<number>(0);
	const [ollamaParametersRepeatPenalty, setOllamaParametersRepeatPenalty] = useState<number>(0);
	const [ollamaParametersTemperature, setOllamaParametersTemperature] = useState<number>(0);
	const [ollamaParametersSeed, setOllamaParametersSeed] = useState<number>(0);
	const [ollamaParametersTfsZ, setOllamaParametersTfsZ] = useState<number>(0);
	const [ollamaParametersNumPredict, setOllamaParametersNumPredict] = useState<number>(0);
	const [ollamaParametersTopK, setOllamaParametersTopK] = useState<number>(0);
	const [ollamaParametersTopP, setOllamaParametersTopP] = useState<number>(0);
	const [ollamaParametersEnableOverride, setOllamaParametersEnableOverride] = useState<boolean>(false);
	const [ollamaParametersKeepAlive, setOllamaParametersKeepAlive] = useState<number>(0);
	const [ollamaSystemMessage, setOllamaSystemMessage] = useState<string>();

	const ollamaParametersListener = (arg: OllamaParametersType) => {
		const {
			enable_override,
			mirostat,
			mirostat_eta,
			num_ctx,
			repeat_last_n,
			repeat_penalty,
			temperature,
			seed,
			tfs_z,
			num_predict,
			top_k,
			top_p,
			keep_alive,
			system_message,
		} = arg;
		setOllamaParametersMiroStat(mirostat);
		setOllamaParametersMiroStatEta(mirostat_eta);
		setOllamaParametersNumCtx(num_ctx);
		setOllamaParametersRepeatLastN(repeat_last_n);
		setOllamaParametersRepeatPenalty(repeat_penalty);
		setOllamaParametersTemperature(temperature);
		setOllamaParametersSeed(seed);
		setOllamaParametersTfsZ(tfs_z);
		setOllamaParametersNumPredict(num_predict);
		setOllamaParametersTopK(top_k);
		setOllamaParametersTopP(top_p);
		setOllamaParametersEnableOverride(enable_override);
		setOllamaParametersKeepAlive(keep_alive);
		setOllamaSystemMessage(system_message);
	};

	useEffect(() => {
		if (socket !== null) {
			socket.on(OLLAMA_PARAMETERS, ollamaParametersListener);
			return () => {};
		}
	}, [socket]);

	return (
		<OllamaParametersContext.Provider
			value={{
				ollamaParametersMiroStat,
				setOllamaParametersMiroStat,
				ollamaParametersMiroStatEta,
				setOllamaParametersMiroStatEta,
				ollamaParametersNumCtx,
				setOllamaParametersNumCtx,
				ollamaParametersRepeatLastN,
				setOllamaParametersRepeatLastN,
				ollamaParametersRepeatPenalty,
				setOllamaParametersRepeatPenalty,
				ollamaParametersTemperature,
				setOllamaParametersTemperature,
				ollamaParametersSeed,
				setOllamaParametersSeed,
				ollamaParametersTfsZ,
				setOllamaParametersTfsZ,
				ollamaParametersNumPredict,
				setOllamaParametersNumPredict,
				ollamaParametersTopK,
				setOllamaParametersTopK,
				ollamaParametersTopP,
				setOllamaParametersTopP,
				ollamaParametersEnableOverride,
				setOllamaParametersEnableOverride,
				ollamaParametersKeepAlive,
				setOllamaParametersKeepAlive,
				ollamaSystemMessage,
				setOllamaSystemMessage,
			}}
		>
			{children}
		</OllamaParametersContext.Provider>
	);
};

export default OllamaParametersProvider;
