import { getItem } from "../services/config/configService";

export class PromptManager {
	twitchChatMessages: Array<{ username: string; content: string }>;
	assistantMessages: Array<string>;
	hostMessages: Array<string>;

	constructor() {
		this.twitchChatMessages = [];
		this.assistantMessages = [];
		this.hostMessages = [];
	}

	getPrompt = async () => {
		const llama3Tokenizer = await import("llama3-tokenizer-js");
		let prompt = "";
		let attempts = 0;
		let tokenCount = 0;

		do {
			prompt = await this.createPrompt();
			tokenCount = llama3Tokenizer.default.encode(prompt).length;

			// If token count is over 7000 we try to remove the oldest response
			// Because they are normally the longest
			if (tokenCount > 7000) {
				switch (attempts) {
					case 0:
						this.removeOldestAssistantMessage();
						break;
					case 1:
						this.removeOldestHostMessage();
						break;
					default:
						this.removeOldestTwitchChatMessage();
				}
			}

			attempts++;

			// We try 5 times, if token count is still too large then we return null
			if (attempts < 5 && tokenCount > 7000) prompt = null;
		} while (tokenCount > 7000 && attempts < 5);

		return prompt;
	};

	createPrompt = async () => {
		let systemPrompt = "# Context\n";

		let twitchChatMessages = "Twitch chat messages:\n";
		this.twitchChatMessages.forEach((message) => {
			twitchChatMessages += `${message.username}: ${message.content} \n`;
		});

		// Add twitch chat messages
		systemPrompt += twitchChatMessages;

		let assistantMessages = "Assistant messages:\n";
		this.assistantMessages.forEach((message) => {
			assistantMessages += `${message} \n`;
		});

		// Add aassistantMessages
		systemPrompt += assistantMessages;

		let hostMessages = "Host messages:\n";
		this.hostMessages.forEach((message) => {
			hostMessages += `${message} \n`;
		});

		// Add host messages
		systemPrompt += hostMessages;

		let systemMessage = await getItem("ollama_parameters_system_message");
		systemPrompt += `\n${systemMessage}`;

		return systemPrompt;
	};

	addTwitchChatMessage = (username: string, message: string) => {
		let messagesLength = this.twitchChatMessages.push({ username: username, content: message });
		if (messagesLength > 10) this.twitchChatMessages.shift();
	};

	addAssistantMessage = (message: string) => {
		let messagesLength = this.assistantMessages.push(message);
		if (messagesLength > 5) this.assistantMessages.shift();
	};

	addHostMessage = async (message: string) => {
		let twitchPreferredUsername = await getItem("twitch_preferred_username");
		let messagesLength = this.hostMessages.push(`${twitchPreferredUsername}: ${message}`);
		if (messagesLength > 5) this.hostMessages.shift();
	};

	removeOldestAssistantMessage = () => {
		this.assistantMessages.shift();
	};

	removeOldestHostMessage = () => {
		this.hostMessages.shift();
	};

	removeOldestTwitchChatMessage = () => {
		this.twitchChatMessages.shift();
	};
}
