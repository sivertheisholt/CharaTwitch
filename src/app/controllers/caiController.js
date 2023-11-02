const caiService = require("../../app/services/caiService");
const authService = require("../../app/services/authService");
const configService = require("../../app/services/configService");

class CaiController {
  constructor(caiView) {
    this.caiService = caiService();
    this.authService = authService();
    this.configService = configService();

    this.caiView = caiView;

    this.characterAi = this.caiService.getCharacterAi();
  }

  initActions() {
    const caiAuthInputs = this.caiView.getCaiAuthInputs();
    this.caiConnectBtn.addEventListener("click", () => {
      this.authService.authCai(
        this.characterAi,
        caiAuthInputs.accesstoken,
        caiAuthInputs.usePlus,
        this.caiAuthCallback
      );
    });
  }

  async caiAuthCallback(success) {
    if (success) {
      this.caiView.updateCaiAuthSuccess();
      this.configService.setCaiConfig(
        this.caiAccessTokenInput,
        this.caiCharacterIdInput,
        this.caiUsePlus,
        this.caiSelectedVoice
      );
      let voices = await this.caiService.fetchVoices(this.characterAi);
      this.caiView.fillVoices(voices);
    } else {
      this.caiView.updateCaiAuthFailure();
    }
  }
}

module.exports = CaiController;
