import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

let audioPlaying = false;

export const init = (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>
) => {
	socket.on("audioOnEnded", () => {
		audioPlaying = false;
	});
};

export const start = () => {
	audioPlaying = true;
};

export const isPlaying = () => {
	return audioPlaying;
};
