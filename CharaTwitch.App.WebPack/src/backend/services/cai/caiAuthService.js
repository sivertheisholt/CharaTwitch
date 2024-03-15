export const authCai = async (characterAi, accessToken) => {
	try {
		characterAi.requester.usePlus = true;
		characterAi.requester.forceWaitingRoom = false;
		characterAi.requester.puppeteerPath = "../../../../chrome-win/chrome.exe";
		await characterAi.authenticateWithToken(accessToken);
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};
