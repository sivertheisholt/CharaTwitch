import { app, BrowserWindow } from "electron";
import path from "path";
import { initStorage } from "./backend/services/config/configService";
import express from "express";
import { createServer } from "node:http";
import { logger } from "./backend/logging/logger";
import { SocketServer } from "./backend/websocket/socketServer";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	app.quit();
}

const createWindow = async () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		height: 1000,
		width: 1050,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	// and load the index.html of the app.
	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
	} else {
		mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
	}

	mainWindow.removeMenu();

	if (process.env.NODE_ENV === "development") {
		mainWindow.webContents.openDevTools();
	}
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
	const expressApp = express();
	const server = createServer(expressApp);

	server.listen(8001, () => {
		console.log("Express server is listening on port: 8001");
	});

	// Initiate storage
	initStorage();

	// Start socket
	const socketServer = new SocketServer(server, expressApp);

	createWindow();
});

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
