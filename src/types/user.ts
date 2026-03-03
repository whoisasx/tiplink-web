export interface UserProfile {
	email: string;
	avatar_url: string;
	wallet: string;
	name: string;
}

/** API response wrapper from the backend */
export interface ApiResponse<T> {
	success: boolean;
	message: string;
	result: T | null;
	error: string | null;
}
