import { app, BrowserWindow } from "electron";
import path from "path";
import { startSocketServer } from "./backend/websocket/socketServer";
import { initStorage } from "./backend/services/config/configService";
import express from "express";
import { createServer } from "node:http";
import { install, Browser, BrowserPlatform } from "@puppeteer/browsers";
import fs from "fs";
import decompress from "decompress";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	app.quit();
}

const expressApp = express();
const server = createServer(expressApp);

server.listen(8001, () => {
	console.log("server running at http://localhost:8001");
});

// Spinning the HTTP server and the WebSocket server.
startSocketServer(server, expressApp);

// Initiate storage
initStorage();

async function installChrome() {
	const buildId = "1000027";
	await install({
		cacheDir: "chrome-cache/",
		unpack: false,
		browser: Browser.CHROMIUM,
		platform: BrowserPlatform.WIN64,
		buildId,
	});
	await decompress("chrome-cache/chromium/1000027-chrome-win.zip", ".")
		.then(() => {
			console.log("Unzipped");
			fs.rmSync("chrome-cache", { recursive: true, force: true });
		})
		.catch((error) => {
			console.log(error);
		});
}

const createWindow = async () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		height: 1200,
		width: 1100,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	// and load the index.html of the app.
	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
	} else {
		mainWindow.loadFile(
			path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
		);
	}

	await installChrome();

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
