import axios from "axios";

interface EventSubRequest {
	type: string;
	version: string;
	condition: {
		to_broadcaster_user_id: string;
	};
	transport: {
		method: string;
		secret: string;
	};
}

export const subscribeToRaid = (
	accessToken: string,
	clientId: string,
	broadcasterUserId: string
) => {
	const apiUrl = "https://api.twitch.tv/helix/eventsub/subscriptions";
	const headers = {
		Authorization: `Bearer ${accessToken}`,
		"Client-Id": clientId,
		"Content-Type": "application/json",
	};
	const eventSubRequest: EventSubRequest = {
		type: "channel.raid",
		version: "1",
		condition: {
			to_broadcaster_user_id: broadcasterUserId,
		},
		transport: {
			method: "websocket",
			secret: "s3cre77890ab",
		},
	};

	axios
		.post(apiUrl, {
			headers: headers,
			body: JSON.stringify(eventSubRequest),
		})
		.then((res) => {
			return console.log(res);
		});
};
