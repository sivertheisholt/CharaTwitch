import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { VOICE_RECORDING_BLOBARRAY, VOICE_RECORDING_TRANSCRIPT } from "../../socket/VoiceRecordingEvents";
import { transcribeAudio } from "../services/openAi/whisperApiService";
import { startInteraction } from "./interactionManager";
import { getItem } from "../services/config/configService";
import { isPlaying, stop } from "./audioManager";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";

export class VoiceRecordingManager {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	twitchIrcService: TwitchIrcService;

	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		twitchIrcService: TwitchIrcService
	) {
		this.socket = socket;
		this.twitchIrcService = twitchIrcService;
		socket.on(VOICE_RECORDING_BLOBARRAY, this.handleVoiceRecordingBlobArray.bind(this));
	}
	async handleVoiceRecordingBlobArray(blob: Blob[]) {
		if (isPlaying()) return;

		const transcript = await transcribeAudio(blob);
		if (transcript === null) return;
		if (transcript === "") return;

		this.socket.emit(VOICE_RECORDING_TRANSCRIPT, transcript);
		const username = getItem("twitch_preferred_username");
		const ollamaResponse = await startInteraction(this.socket, [
			{ role: "user", content: `${username}: ${transcript}` },
		]);

		if (ollamaResponse === undefined) return;
		if (ollamaResponse === null) return stop();

		this.twitchIrcService.sendMessage(ollamaResponse);
	}
}
