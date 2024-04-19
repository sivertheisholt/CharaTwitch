import pino from "pino";

let dir =
	process.env.APPDATA ||
	(process.platform == "darwin"
		? process.env.HOME + "/Library/Preferences"
		: process.env.HOME + "/.local/share");

dir += "/CharaTwitch/";

const fileTransport = pino.transport({
	targets: [
		{
			level: "warn",
			target: "pino-pretty",
			options: { destination: `${dir}/app.log` },
		},
		{
			level: "info",
			target: "pino-pretty",
			options: {
				options: {
					destination: 1,
				},
			},
		},
	],
});

// Create a Pino logger with the file stream
export const logger = pino(
	{
		timestamp: pino.stdTimeFunctions.isoTime,
	},
	fileTransport
);
