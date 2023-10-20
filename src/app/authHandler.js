const authTwitch = (app, clientSecret, clientId, authCallback) => {
  const redirect_uri = "http://localhost:3000/twitch";
  nw.Window.open(
    `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}&scope=chat%3Aread+chat%3Aedit&state=c3ab8aa609ea11e793ae92361f002671`,
    { new_instance: true },
    function (win) {
      win.on("loaded", function () {
        app.get("/twitch", async (req, res) => {
          let code = req.query.code;
          win.close();
          const requestBody = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirect_uri,
            code: code,
            grant_type: "authorization_code",
          }).toString();
          fetch("https://id.twitch.tv/oauth2/token", {
            method: "POST",
            body: requestBody,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
            .then(async (res) => {
              authCallback(true, JSON.parse(await res.text()));
            })
            .catch((err) => {
              authCallback(false, "");
            });
        });
      });
    }
  );
};

const authCai = async (characterAi, accessToken, usePlus, authCallback) => {
  try {
    characterAi.requester.usePlus = usePlus;
    characterAi.requester.forceWaitingRoom = false;
    await characterAi.authenticateWithToken(accessToken);
    authCallback(true);
  } catch (err) {
    authCallback(false);
  }
};

module.exports = { authTwitch, authCai };
