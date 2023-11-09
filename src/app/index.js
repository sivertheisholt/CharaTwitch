const CaiController = require("../app/controllers/caiController");
const TwitchController = require("../app/controllers/twitchController");
const puppeteer = require("@puppeteer/browsers");
const decompress = require("decompress");
const fs = require("fs");

async function startApp() {
  const buildId = "1000027"; //which version you want to download

  await puppeteer.install({
    cacheDir: "chrome-cache/",
    unpack: false,
    browser: "chromium",
    platform: "win64", //or linux, mac, mac_arm, win64
    buildId,
  });

  decompress("chrome-cache/chromium/1000027-chrome-win.zip", ".")
    .then(() => {
      console.log("Unzipped");
      fs.rmSync("chrome-cache", { recursive: true, force: true });
    })
    .catch((error) => {
      console.log(error);
    });

  // eslint-disable-next-line no-undef
  new CaiController(caiView);
  // eslint-disable-next-line no-undef
  new TwitchController(twitchView, caiView);

  console.log("done");
}

startApp();
