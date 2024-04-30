import { setElevenlabsConfig } from "../services/config/configService";
import { fetchVoices } from "../services/elevenlabs/elevenlabsApiService";
import { ElevenlabsVoiceType } from "../../types/elevenlabs/ElevenlabsVoiceType";

export const onElevenlabsConnect = async (elevenlabsApiKey: string) => {
	await setElevenlabsConfig(elevenlabsApiKey);
	console.log(elevenlabsApiKey);

	const voices: Array<ElevenlabsVoiceType> = await fetchVoices();
	return voices;
};
