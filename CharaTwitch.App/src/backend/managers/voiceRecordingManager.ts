import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { VOICE_RECORDING_BLOBARRAY, VOICE_RECORDING_TRANSCRIPT } from "../../socket/VoiceRecordingEvents";
import { transcribeAudio } from "../services/openAi/whisperApiService";
import { getItem } from "../services/config/configService";
import { TwitchIrcService } from "../services/twitch/twitchIrcService";
import { InteractionManager } from "./interactionManager";
import { PromptManager } from "./promptManager";

export class VoiceRecordingManager {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	twitchIrcService: TwitchIrcService;
	interactionManager: InteractionManager;
	promptManager: PromptManager;

	constructor(
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
		twitchIrcService: TwitchIrcService,
		interactionManager: InteractionManager,
		promptManager: PromptManager
	) {
		this.socket = socket;
		this.twitchIrcService = twitchIrcService;
		this.interactionManager = interactionManager;
		this.promptManager = promptManager;

		socket.on(VOICE_RECORDING_BLOBARRAY, this.handleVoiceRecordingBlobArray.bind(this));
	}
	async handleVoiceRecordingBlobArray(blob: Blob[]) {
		if (this.interactionManager.audioPlaying) return;

		const transcript = await transcribeAudio(blob);
		if (transcript === null || transcript == "") return;

		this.socket.emit(VOICE_RECORDING_TRANSCRIPT, transcript);

		const twitchPreferredUsername = await getItem("twitch_preferred_username");
		let ollamaResponse = await this.interactionManager.startInteraction(`${twitchPreferredUsername}: ${transcript}`);
		if (ollamaResponse === null) return;

		await this.promptManager.addHostMessage(transcript);
		this.promptManager.addAssistantMessage(ollamaResponse);

		this.twitchIrcService.sendMessage(ollamaResponse);
	}
}
