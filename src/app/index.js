const CaiController = require("../app/controllers/caiController");
const TwitchController = require("../app/controllers/twitchController");
const puppeteer = require("@puppeteer/browsers");
const decompress = require("decompress");
const fs = require("fs");

async function startApp() {
  const buildId = "114.0.5735.133"; //which version you want to download

  await puppeteer.install({
    cacheDir: "chrome-cache/",
    unpack: false,
    browser: "chrome",
    platform: "win32", //or linux, mac, mac_arm, win64
    buildId,
  });

  decompress("chrome-cache/chrome/114.0.5735.133-chrome-win32.zip", ".")
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
