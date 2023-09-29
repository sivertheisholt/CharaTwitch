const CharacterAI = require("node_characterai");
const characterAi = new CharacterAI();
const express = require("express");
const app = express();
app.use(express.json());

const authHandler = require("../app/authHandler.js");
const configHandler = require("../app/configHandler.js");
const twitchIrcHandler = require("../app/twitchIrcHandler.js");
const caiHandler = require("../app/caiHandler.js");

// TWITCH
const twitchAuthenticatedAlert = document.getElementById(
  "twitch_authenticated_alert"
);
const twitchBtn = document.getElementById("twitch_connect_btn");
const twitchClientSecretInput = document.getElementById("twitch_client_secret");
const twitchClientIdInput = document.getElementById("twitch_client_id");
const twitchChatBox = document.getElementById("twitch_chat_box");
const twitchUsername = document.getElementById("twitch_username");
const twitchTriggerWord = document.getElementById("twitch_trigger_word");
const twitchListenToTrigger = document.getElementById(
  "twitch_listen_trigger_word"
);

// CAI
const caiAuthenticatedAlert = document.getElementById(
  "cai_authenticated_alert"
);
const caiConnectBtn = document.getElementById("cai_ai_connect");
const caiAccessTokenInput = document.getElementById("cai_access_token");
const caiCharacterIdInput = document.getElementById("cai_character_id");
const caiChatBox = document.getElementById("cai_chat_box");
const caiUsePlus = document.getElementById("cai_use_plus");

let authConfig;

const fillAuth = (config) => {
  if (config != null) {
    caiAccessTokenInput.value = config.cai_access_token;
    caiCharacterIdInput.value = config.cai_character_id;
    caiUsePlus.checked = config.cai_use_plus;
    twitchClientSecretInput.value = config.twitch_client_secret;
    twitchClientIdInput.value = config.twitch_client_id;
    twitchUsername.value = config.twitch_username;
    twitchTriggerWord.value = config.twitch_trigger_word;
    twitchListenToTrigger.checked = config.twich_listen_to_trigger;
    authConfig = config;
  }
};
configHandler.retrieveAuth("authConfig.json", fillAuth);

async function onMessageHandler(username, message) {
  twitchChatBox.innerHTML += `<div class="media"><h5 class="mt-0">${username}: ${message}</h5></div>`;
  if (message.toLowerCase().indexOf(twitchTriggerWord.value) !== -1) {
    let result = await caiHandler.sendChat(
      characterAi,
      caiCharacterIdInput.value,
      message,
      username
    );
    caiChatBox.innerHTML += `<div class="media"><h5 class="mt-0">${result}</h5></div>`;
    await caiHandler.playTTS(characterAi, result);
  }
}

async function twitchAuthCallback(success, tokenObj) {
  if (success) {
    twitchAuthenticatedAlert.classList.remove("hidden");
    twitchBtn.classList.add("hidden");
    authConfig.twitch_client_secret = twitchClientSecretInput.value;
    authConfig.twitch_client_id = twitchClientIdInput.value;
    authConfig.twitch_username = twitchUsername.value;
    authConfig.twitch_trigger_word = twitchTriggerWord.value;
    authConfig.twich_listen_to_trigger = twitchListenToTrigger.checked;
    configHandler.saveAuth("authConfig.json", authConfig);
    twitchIrcHandler.connectToTwitchIrc(
      tokenObj.access_token,
      twitchUsername.value,
      onMessageHandler
    );
  } else {
  }
}

async function caiAuthCallback(success) {
  if (success) {
    caiAuthenticatedAlert.classList.remove("hidden");
    caiConnectBtn.classList.add("hidden");
    authConfig.cai_access_token = caiAccessTokenInput.value;
    authConfig.cai_character_id = caiCharacterIdInput.value;
    authConfig.cai_use_plus = caiUsePlus.checked;
    configHandler.saveAuth("authConfig.json", authConfig);
  } else {
  }
}

caiConnectBtn.addEventListener("click", () =>
  authHandler.authCai(
    characterAi,
    caiAccessTokenInput.value,
    caiUsePlus.checked,
    caiAuthCallback
  )
);
twitchBtn.addEventListener("click", () =>
  authHandler.authTwitch(
    app,
    twitchClientSecretInput.value,
    twitchClientIdInput.value,
    twitchAuthCallback
  )
);

app.listen(3000, () =>
  console.log("Application is now listening on port: 3000")
);
