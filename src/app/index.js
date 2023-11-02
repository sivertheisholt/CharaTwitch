const CaiController = require("../app/controllers/caiController");
const TwitchController = require("../app/controllers/twitchController");
const TwitchView = require("../app/views/twitchView");
const CaiView = require("../app/views/caiView");

console.log("App starting");
const caiView = new CaiView();
const twitchView = new TwitchView();

const caiController = new CaiController(caiView);
const twitchController = new TwitchController(twitchView, caiView);
