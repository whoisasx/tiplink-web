import apiClient from "./client";
import type { UserProfile } from "@/types/user";
import type { ApiResponse } from "@/types/user";

export async function getCurrentUser(): Promise<UserProfile> {
	const { data } = await apiClient.get<ApiResponse<UserProfile>>("/user/me");
	if (!data.result) throw new Error(data.error ?? "Failed to fetch user");
	return data.result;
}
