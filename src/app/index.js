const CaiController = require("../app/controllers/caiController");
const TwitchController = require("../app/controllers/twitchController");

// eslint-disable-next-line no-undef
new CaiController(caiView);
// eslint-disable-next-line no-undef
new TwitchController(twitchView, caiView);
