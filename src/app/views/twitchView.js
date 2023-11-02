class TwitchView {
  constructor() {
    document.addEventListener("DOMContentLoaded", function () {
      // Buttons
      this.twitchBtn = document.getElementById("twitch_connect_btn");
      this.twitchSpinnerBtn = document.getElementById(
        "twitch_connect_btn_spinner"
      );

      // Other
      this.twitchAuthenticatedAlert = document.getElementById(
        "twitch_authenticated_alert"
      );
      this.twitchClientSecretInput = document.getElementById(
        "twitch_client_secret"
      );
      this.twitchClientIdInput = document.getElementById("twitch_client_id");
      this.twitchChatBox = document.getElementById("twitch_chat_box");
      this.twitchUsername = document.getElementById("twitch_username");
      this.twitchTriggerWord = document.getElementById("twitch_trigger_word");
      this.twitchListenToTrigger = document.getElementById(
        "twitch_listen_trigger_word"
      );

      this.initButtons();
    });
  }

  initButtons() {
    this.twitchBtn.addEventListener("click", () => {
      this.twitchBtn.classList.add("hidden");
      this.twitchSpinnerBtn.classList.remove("hidden");
    });
  }

  getTwitchAuthInputs() {
    return {
      clientSecret: this.twitchClientSecretInput.value,
      clientId: this.twitchClientIdInput.value,
    };
  }
  getTriggerWord() {
    return this.twitchTriggerWord.value;
  }

  fillAuth() {}

  addTwitchChat(username, message) {
    this.twitchChatBox.innerHTML += `<div class="media"><h5 class="mt-0">${username}: ${message}</h5></div>`;
  }
  updateTwitchAuthSuccess() {
    this.twitchAuthenticatedAlert.classList.remove("hidden");
    this.twitchSpinnerBtn.classList.add("hidden");
  }
}

module.exports = TwitchView;
