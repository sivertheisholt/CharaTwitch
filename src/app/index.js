const CaiController = require("../app/controllers/caiController");
const TwitchController = require("../app/controllers/twitchController");

console.log("App starting");

new CaiController(caiView);
new TwitchController(twitchView, caiView);
