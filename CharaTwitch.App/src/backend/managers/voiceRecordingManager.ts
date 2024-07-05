import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { VOICE_RECORDING_BLOBARRAY, VOICE_RECORDING_TRANSCRIPT } from "../../socket/VoiceRecordingEvents";
import { transcribeAudio } from "../services/openAi/whisperApiService";
import { getItem } from "../services/config/configService";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";
import { InteractionManager } from "./interactionManager";
import { ChatManager } from "./chatManager";

export class VoiceRecordingManager {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	twitchIrcService: TwitchIrcService;
	interactionManager: InteractionManager;
	chatManager: ChatManager;

	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		twitchIrcService: TwitchIrcService,
		interactionManager: InteractionManager,
		chatManager: ChatManager
	) {
		this.socket = socket;
		this.twitchIrcService = twitchIrcService;
		this.interactionManager = interactionManager;
		this.chatManager = chatManager;

		socket.on(VOICE_RECORDING_BLOBARRAY, this.handleVoiceRecordingBlobArray.bind(this));
	}
	async handleVoiceRecordingBlobArray(blob: Blob[]) {
		if (this.interactionManager.audioPlaying) return;

		const transcript = await transcribeAudio(blob);
		if (transcript === null) return;
		if (transcript === "") return;

		this.socket.emit(VOICE_RECORDING_TRANSCRIPT, transcript);

		const username = await getItem("twitch_preferred_username");
		const finalMessage = this.chatManager.getRecentInteractions() + `### Task:\n ${username}: ${transcript}`;
		let ollamaResponse = await this.interactionManager.startInteraction(this.socket, finalMessage);

		if (ollamaResponse === null) return;

		this.chatManager.addMessage(username, transcript);
		this.chatManager.addMessage("Assistant", ollamaResponse);

		this.twitchIrcService.sendMessage(ollamaResponse);
	}
}
