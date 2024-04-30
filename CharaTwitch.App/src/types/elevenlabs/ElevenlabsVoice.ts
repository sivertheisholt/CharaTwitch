export type ElevenlabsVoice = {
	voice_id: string;
	name: string;
	samples: [
		{
			sample_id: string;
			file_name: string;
			mime_type: string;
			size_bytes: number;
			hash: string;
		}
	];
	category: string;
	fine_tuning: {
		is_allowed_to_fine_tune: boolean;
		finetuning_state: string;
		verification_failures: string[];
		verification_attempts_count: number;
		manual_verification_requested: boolean;
		language: string;
		finetuning_progress: Record<string, unknown>; // Type definition needed
		message: string;
		dataset_duration_seconds: number;
		verification_attempts: [
			{
				text: string;
				date_unix: number;
				accepted: boolean;
				similarity: number;
				levenshtein_distance: number;
				recording: {
					recording_id: string;
					mime_type: string;
					size_bytes: number;
					upload_date_unix: number;
					transcription: string;
				};
			}
		];
		slice_ids: string[];
		manual_verification: {
			extra_text: string;
			request_time_unix: number;
			files: {
				file_id: string;
				file_name: string;
				mime_type: string;
				size_bytes: number;
				upload_date_unix: number;
			}[];
		};
	};
	labels: Record<string, unknown>; // Type definition needed
	description: string;
	preview_url: string;
	available_for_tiers: string[];
	settings: {
		stability: number;
		similarity_boost: number;
		style: number;
		use_speaker_boost: boolean;
	};
	sharing: {
		status: string;
		history_item_sample_id: string;
		date_unix: number;
		whitelisted_emails: string[];
		public_owner_id: string;
		original_voice_id: string;
		financial_rewards_enabled: boolean;
		free_users_allowed: boolean;
		live_moderation_enabled: boolean;
		rate: number;
		notice_period: number;
		disable_at_unix: number;
		voice_mixing_allowed: boolean;
		featured: boolean;
		category: string;
		reader_app_enabled: boolean;
		ban_reason: string;
		liked_by_count: number;
		cloned_by_count: number;
		name: string;
		description: string;
		labels: Record<string, unknown>; // Type definition needed
		review_status: string;
		review_message: string;
		enabled_in_library: boolean;
		instagram_username: string;
		twitter_username: string;
		youtube_username: string;
		tiktok_username: string;
	};
	high_quality_base_model_ids: string[];
	safety_control: string;
	voice_verification: {
		requires_verification: boolean;
		is_verified: boolean;
		verification_failures: string[];
		verification_attempts_count: number;
		language: string;
		verification_attempts: [
			{
				text: string;
				date_unix: number;
				accepted: boolean;
				similarity: number;
				levenshtein_distance: number;
				recording: {
					recording_id: string;
					mime_type: string;
					size_bytes: number;
					upload_date_unix: number;
					transcription: string;
				};
			}
		];
	};
	owner_id: string;
	permission_on_resource: string;
};
