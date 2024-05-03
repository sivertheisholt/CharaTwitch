export type SubscriptionEventType = {
	subscription: {
		id: string;
		type: string;
		version: string;
		status: string;
		cost: number;
		condition: {
			to_broadcaster_user_id: string;
		};
		transport: {
			method: string;
			callback: string;
		};
		created_at: string;
	};
	event: {
		from_broadcaster_user_id: string;
		from_broadcaster_user_login: string;
		from_broadcaster_user_name: string;
		to_broadcaster_user_id: string;
		to_broadcaster_user_login: string;
		to_broadcaster_user_name: string;
		viewers: number;
	};
};
