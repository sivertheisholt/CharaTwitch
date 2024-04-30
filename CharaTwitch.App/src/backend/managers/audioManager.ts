import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { AUDIO_ON_ENDED } from "../../socket/AudioEvents";

let audioPlaying = false;

export const init = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>) => {
	socket.on(AUDIO_ON_ENDED, () => {
		audioPlaying = false;
	});
};

export const stop = () => {
	audioPlaying = false;
};

export const start = () => {
	audioPlaying = true;
};

export const isPlaying = () => {
	return audioPlaying;
};
