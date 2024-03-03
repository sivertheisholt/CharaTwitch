const authCai = async (characterAi, accessToken) => {
	try {
		characterAi.requester.usePlus = true;
		characterAi.requester.forceWaitingRoom = false;
		await characterAi.authenticateWithToken(accessToken);
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};

module.exports = { authCai };
