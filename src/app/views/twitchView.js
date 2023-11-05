class TwitchView {
  constructor() {
    // eslint-disable-next-line no-undef
    this.configService = configService();
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
    this.twitchTriggerWord = document.getElementById("twitch_trigger_word");
    this.twitchListenToTrigger = document.getElementById(
      "twitch_listen_trigger_word"
    );
    this.twitchReward = document.getElementById("twitch_reward");
    this.twitchSelectedReward;

    this.initButtons();

    this.fillAuth();
  }

  initButtons() {
    this.twitchBtn.addEventListener("click", () => {
      this.twitchBtn.classList.add("hidden");
      this.twitchSpinnerBtn.classList.remove("hidden");
    });
    this.twitchReward.addEventListener("change", (sel) => {
      const selected = sel.target.options[sel.target.selectedIndex].value;
      this.twitchSelectedReward = selected;
      this.configService.setTwitchSelectedReward(selected);
    });
  }

  getTwitchAuthInputs() {
    return {
      clientSecret: this.twitchClientSecretInput.value,
      clientId: this.twitchClientIdInput.value,
    };
  }

  getTwitchInputs() {
    return {
      clientSecret: this.twitchClientSecretInput.value,
      clientId: this.twitchClientIdInput.value,
      triggerWord: this.twitchTriggerWord.value,
      listenToTriggerWord: this.twitchListenToTrigger.checked,
    };
  }

  async fillAuth() {
    const twitchAuthConfig = await this.configService.getTwitchConfig();
    this.twitchClientSecretInput.value = twitchAuthConfig.clientSecret ?? "";
    this.twitchClientIdInput.value = twitchAuthConfig.clientId ?? "";
    this.twitchTriggerWord.value = twitchAuthConfig.triggerWord ?? "";
    this.twitchListenToTrigger.checked = twitchAuthConfig.listenToTriggerWord;
    this.twitchSelectedReward = twitchAuthConfig.selectedReward;
  }

  fillRewards(rewards) {
    let options = "";
    rewards.forEach((reward) => {
      options += `<option value="${reward.id}">${reward.title}</option>`;
    });
    this.twitchReward.innerHTML += options;
    this.setSelectedOption();
  }

  addTwitchChat(username, message) {
    this.twitchChatBox.innerHTML += `<div class="media"><h5 class="mt-0">${username}: ${message}</h5></div>`;
  }

  updateTwitchAuthSuccess() {
    this.twitchAuthenticatedAlert.classList.remove("hidden");
    this.twitchSpinnerBtn.classList.add("hidden");
  }

  setSelectedOption() {
    // Loop through the options and find the one to select
    for (var i = 0; i < this.twitchReward.options.length; i++) {
      if (this.twitchReward.options[i].value === this.twitchSelectedReward) {
        // Set the selected attribute of the option to true
        this.twitchReward.options[i].selected = true;
        break; // Exit the loop since we found the option
      }
    }
    if (!this.twitchSelectedReward) {
      const defaultVoice = this.twitchReward.options[0].value;
      this.twitchSelectedReward = defaultVoice;
      this.configService.setCaiSelectedVoice(defaultVoice);
    }
  }
}

// eslint-disable-next-line no-unused-vars
const twitchView = new TwitchView();
