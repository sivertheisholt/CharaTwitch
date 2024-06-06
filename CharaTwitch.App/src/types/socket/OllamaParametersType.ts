export type OllamaParametersType = {
	enable_override: boolean;
	mirostat: number;
	mirostat_eta: number;
	num_ctx: number;
	repeat_last_n: number;
	repeat_penalty: number;
	temperature: number;
	seed: number;
	tfs_z: number;
	num_predict: number;
	top_k: number;
	top_p: number;
	keep_alive: number;
};
