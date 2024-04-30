import { CustomRedeem } from "../../twitch/CustomRedeem";

export type TwitchConfigContextType = {
	twitchClientSecret: string;
	setTwitchClientSecret: React.Dispatch<React.SetStateAction<string>>;
	twitchClientId: string;
	setTwitchClientId: React.Dispatch<React.SetStateAction<string>>;
	twitchSelectedRedeem: string;
	setTwitchSelectedRedeem: React.Dispatch<React.SetStateAction<string>>;
	twitchCustomRedeems: Array<CustomRedeem>;
	setTwitchCustomRedeems: React.Dispatch<React.SetStateAction<CustomRedeem[]>>;
};
