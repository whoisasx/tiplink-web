export interface JwtTokenResponse {
	jwt_token: string;
}

export interface RefreshTokenResponse {
	success: boolean;
	message: string;
	result: JwtTokenResponse | null;
	error: string | null;
}

export interface AuthInitResponse {
	success: boolean;
	message: string;
	result: string | null; // Google redirect URL
	error: string | null;
}
