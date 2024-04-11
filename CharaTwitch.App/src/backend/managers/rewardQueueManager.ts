import { RewardQueueItem } from "../types/RewardQueueItem";

const queue: Array<RewardQueueItem> = [];

export const add = (username: string, message: string) => {
	queue.push({ username: username, message: message });
};

export const remove = () => {
	return queue.pop();
};
