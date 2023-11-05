const caiService = require("../../app/services/caiService");
const authService = require("../../app/services/authService");
const configService = require("../../app/services/configService");

class CaiController {
  constructor(caiView) {
    this.caiView = caiView;

    this.caiService = caiService();
    this.authService = authService();
    this.configService = configService();

    this.characterAi = this.caiService.getCharacterAi();

    this.init();
  }

  async init() {
    this.caiView.caiConnectBtn.addEventListener("click", async () => {
      const caiAuthInputs = this.caiView.getCaiAuthInputs();
      this.authService.authCai(
        this.characterAi,
        caiAuthInputs.accessToken,
        caiAuthInputs.usePlus,
        (success) => this.caiAuthCallback(success)
      );
    });
    const caiConfig = await this.configService.getCaiConfig();
    this.caiView.fillAuth(caiConfig);
  }

  async caiAuthCallback(success) {
    if (!success) this.caiView.updateCaiAuthFailure();

    this.caiView.updateCaiAuthSuccess();
    const caiAuthInputs = this.caiView.getCaiAuthInputs();
    this.configService.setCaiConfig(
      caiAuthInputs.accessToken,
      caiAuthInputs.characterId,
      caiAuthInputs.usePlus,
      caiAuthInputs.selectedVoice
    );
    let voices = await this.caiService.fetchVoices(this.characterAi);
    this.caiView.fillVoices(voices);
  }
}

module.exports = CaiController;
