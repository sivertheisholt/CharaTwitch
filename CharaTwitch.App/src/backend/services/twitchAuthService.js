import { BrowserWindow } from "electron";

export const authTwitch = async (expressApp, clientId, clientSecret) => {
	const redirectUri = "http://localhost:8001/twitch";
	const twitchUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=channel%3Aread%3Aredemptions+chat%3Aread+chat%3Aedit&state=c3ab8aa609ea11e793ae92361f002671`;

	const twitchAuthWindow = new BrowserWindow();
	twitchAuthWindow.removeMenu();

	await twitchAuthWindow.loadURL(twitchUrl);

	return await getToken(
		expressApp,
		twitchAuthWindow,
		clientId,
		clientSecret,
		redirectUri
	);
};

export const getToken = (
	expressApp,
	twitchAuthWindow,
	clientId,
	clientSecret,
	redirectUri
) => {
	return new Promise((resolve, reject) => {
		expressApp.get("/twitch", async (req, res) => {
			try {
				let code = req.query.code;
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
