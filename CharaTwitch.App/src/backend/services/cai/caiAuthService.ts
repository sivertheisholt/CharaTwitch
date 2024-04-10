import { BrowserWindow, session } from "electron";

export const authCai = async (): Promise<any> => {
	const caiUrl = `https://character.ai/`;

	const caiAuthWindow = new BrowserWindow({
		height: 1000,
		width: 1050,
	});
	caiAuthWindow.removeMenu();

	const ses = session.defaultSession;

	await caiAuthWindow.loadURL(caiUrl);
	let interval;
	const token = await new Promise((resolve) => {
		let tries = 0;
		interval = setInterval(() => {
			tries++;
			ses.cookies
				.get({ httpOnly: true })
				.then((cookies) => {
					cookies.forEach((cookie) => {
						if (cookie.name == "HTTP_AUTHORIZATION") {
							const cleanTokenStr = cookie.value.replace(/"/g, "");
							resolve(cleanTokenStr.split(/\s+/)[1]);
						}
					});
				})
				.catch((error) => {
					resolve(null);
					console.log(error);
				});
		}, 1000);
		if (tries >= 120) {
			resolve(null);
		}
	});

	clearInterval(interval);
	caiAuthWindow.close();

	return token;
};
