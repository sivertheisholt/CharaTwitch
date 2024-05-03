import { RewardQueueItemType } from "../../types/RewardQueueItemType";

const queue: Array<RewardQueueItemType> = [];

export const add = (username: string, message: string) => {
	queue.push({ username: username, message: message });
};

export const remove = () => {
	return queue.pop();
};
