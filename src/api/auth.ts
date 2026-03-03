import apiClient from "./client";
import type { RefreshTokenResponse } from "@/types/auth";

/** Returns the Google OAuth redirect URL */
export async function getGoogleAuthUrl(): Promise<string> {
	const { data } = await apiClient.get<{ success: boolean; result: string }>(
		"/auth/google/init",
	);
	if (!data.result) throw new Error("No redirect URL from server");
	return data.result;
}

/** Exchange the refresh_token cookie for a new JWT */
export async function refreshToken(): Promise<string> {
	const { data } = await apiClient.get<RefreshTokenResponse>("/auth/refresh");
	if (!data.result?.jwt_token) throw new Error("No JWT in response");
	return data.result.jwt_token;
}

/** Revoke the refresh_token cookie (logout) */
export async function logout(): Promise<void> {
	await apiClient.delete("/auth/logout");
}
