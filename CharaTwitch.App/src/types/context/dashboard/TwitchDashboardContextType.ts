export type TwitchDashboardContextType = {
	twitchMessages: Array<any>;
	setTwitchMessages: React.Dispatch<React.SetStateAction<any[]>>;
	twitchRedeems: Array<any>;
	setTwitchRedeems: React.Dispatch<React.SetStateAction<any[]>>;
	twitchIrcStatus: boolean;
	setTwitchIrcStatus: React.Dispatch<React.SetStateAction<boolean>>;
	twitchPubSubStatus: boolean;
	setTwitchPubSubStatus: React.Dispatch<React.SetStateAction<boolean>>;
	twitchAccountStatus: boolean;
	setTwitchAccountStatus: React.Dispatch<React.SetStateAction<boolean>>;
};
