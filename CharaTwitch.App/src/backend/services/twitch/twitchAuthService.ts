import { BrowserWindow } from "electron";
import { Express } from "express";

export const authTwitch = async (
	expressApp: Express,
	clientId: string,
	clientSecret: string
): Promise<any> => {
	const redirectUri = "http://localhost:8001/twitch";
	const scope = encodeURI("channel:read:redemptions chat:read chat:edit");
	const twitchUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=c3ab8aa609ea11e793ae92361f002671`;

	const twitchAuthWindow = new BrowserWindow();
	twitchAuthWindow.removeMenu();

	await twitchAuthWindow.loadURL(twitchUrl);

	return await getToken(
		expressApp,
		twitchAuthWindow,
		clientId,
		clientSecret,
		redirectUri,
		"/twitch"
	);
};

export const getToken = (
	expressApp: Express,
	twitchAuthWindow: BrowserWindow,
	clientId: string,
	clientSecret: string,
	redirectUri: string,
	endpoint: string
) => {
	return new Promise((resolve, reject) => {
		expressApp.get(endpoint, async (req) => {
			try {
				const code: string = req.query.code as string;
				twitchAuthWindow.close();
				const requestBody = new URLSearchParams({
					client_id: clientId,
					client_secret: clientSecret,
					redirect_uri: redirectUri,
					code: code,
					grant_type: "authorization_code",
				}).toString();

				const tokenResult = await fetch("https://id.twitch.tv/oauth2/token", {
					method: "POST",
					body: requestBody,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				});

				if (tokenResult.ok) {
					const data = await tokenResult.json();
					resolve(data);
				} else {
					resolve(null);
				}
			} catch (error) {
				reject(error);
			}
		});
	});
};
