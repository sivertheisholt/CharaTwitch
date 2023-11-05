const configService = require("../app/services/configService");

class CaiView {
  constructor() {
    this.configService = configService();
    // Buttons
    this.caiConnectBtn = document.getElementById("cai_ai_connect");
    this.caiSpinnerBtn = document.getElementById("cai_connect_btn_spinner");

    // Other
    this.caiAuthenticatedAlert = document.getElementById(
      "cai_authenticated_alert"
    );
    this.caiAuthenticatedAlertDanger = document.getElementById(
      "cai_authenticated_alert_danger"
    );
    this.caiAccessTokenInput = document.getElementById("cai_access_token");
    this.caiCharacterIdInput = document.getElementById("cai_character_id");
    this.caiChatBox = document.getElementById("cai_chat_box");
    this.caiUsePlus = document.getElementById("cai_use_plus");
    this.caiVoice = document.getElementById("cai_voice");
    this.caiSelectedVoice;

    this.initButtons();

    this.fillAuth();
  }

  initButtons() {
    this.caiVoice.addEventListener("change", (sel) => {
      const selected = sel.target.options[sel.target.selectedIndex].value;
      this.caiSelectedVoice = selected;
      this.configService.setCaiSelectedVoice(selected);
    });
    this.caiConnectBtn.addEventListener("click", () => {
      this.caiConnectBtn.classList.add("hidden");
      this.caiSpinnerBtn.classList.remove("hidden");
    });
  }

  async fillAuth() {
    const caiConfig = await this.configService.getCaiConfig();
    this.caiAccessTokenInput.value = caiConfig.accessToken ?? "";
    this.caiCharacterIdInput.value = caiConfig.characterId ?? "";
    this.caiUsePlus.checked = caiConfig.usePlus;
    this.caiSelectedVoice = caiConfig.selectedVoice;
  }

  addCaiChat(result) {
    this.caiChatBox.innerHTML = `<div class="media"><h5 class="mt-0">${result}</h5></div>`;
  }

  getCaiAuthInputs() {
    return {
      accessToken: this.caiAccessTokenInput.value,
      characterId: this.caiCharacterIdInput.value,
      usePlus: this.caiUsePlus.checked,
      selectedVoice: this.selectedVoice,
    };
  }

  updateCaiAuthSuccess() {
    this.caiAuthenticatedAlert.classList.remove("hidden");
    this.caiSpinnerBtn.classList.add("hidden");
    this.caiAuthenticatedAlertDanger.classList.add("hidden");
  }

  updateCaiAuthFailure() {
    this.caiSpinnerBtn.classList.add("hidden");
    this.caiAuthenticatedAlertDanger.classList.remove("hidden");
    this.caiConnectBtn.classList.remove("hidden");
  }

  fillVoices(voices) {
    let options = "";
    voices.forEach((voice) => {
      options += `<option value="${voice.id}">${voice.name}</option>`;
    });
    this.caiVoice.innerHTML += options;
    this.setSelectedOption();
  }

  setSelectedOption() {
    // Loop through the options and find the one to select
    for (var i = 0; i < this.caiVoice.options.length; i++) {
      if (this.caiVoice.options[i].value === this.caiSelectedVoice) {
        // Set the selected attribute of the option to true
        this.caiVoice.options[i].selected = true;
        break; // Exit the loop since we found the option
      }
    }
    if (!this.caiSelectedVoice) {
      const defaultVoice = this.caiVoice.options[0].value;
      this.caiSelectedVoice = defaultVoice;
      this.configService.setCaiSelectedVoice(defaultVoice);
    }
  }
}

// eslint-disable-next-line no-unused-vars
const caiView = new CaiView();
