/**
 * @typedef {import("../services/cai/caiService")} CaiService
 */
const caiService = require("../services/cai/caiService");
/**
 * @typedef {import("../services/configService")} ConfigService
 */
const configService = require("../services/configService");

class CaiController {
  /**
   * @typedef {import("../views/caiView").CaiView} CaiView
   * @param {CaiView} caiView
   */
  constructor(caiView) {
    this.caiView = caiView;

    this.caiService = caiService();
    this.configService = configService();

    this.init();
  }

  async init() {
    this.caiView.caiConnectBtn.addEventListener("click", async () => {
      const caiAuthInputs = this.caiView.getCaiAuthInputs();
      this.caiService.authCai(
        caiAuthInputs.accessToken,
        caiAuthInputs.usePlus,
        (success) => this.caiAuthCb(success)
      );
    });

    const caiConfig = await this.configService.getCaiConfig();
    this.caiView.fillAuth(caiConfig);
  }

  async caiAuthCb(success) {
    if (!success) return this.caiView.updateCaiAuthFailure();

    const voices = await this.caiService.getVoices();
    const caiAuthInputs = this.caiView.getCaiAuthInputs();

    this.configService.setCaiConfig(
      caiAuthInputs.accessToken,
      caiAuthInputs.characterId,
      caiAuthInputs.usePlus,
      caiAuthInputs.selectedVoice
    );

    this.caiView.fillVoices(voices);
    this.caiView.updateCaiAuthSuccess();
  }
}

module.exports = CaiController;
