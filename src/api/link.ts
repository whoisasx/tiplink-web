import apiClient from "./client";
import type {
	CreateLinkRequest,
	CreateLinkResponse,
	MyLinksQuery,
	MyLinksResponse,
	LinkInfoResponse,
	ClaimLinkRequest,
	ClaimLinkResponse,
} from "@/types/link";
import type { ApiResponse } from "@/types/user";

export async function createLink(
	req: CreateLinkRequest,
): Promise<CreateLinkResponse> {
	const { data } = await apiClient.post<ApiResponse<CreateLinkResponse>>(
		"/link",
		req,
	);
	if (!data.result) throw new Error(data.error ?? "Failed to create link");
	return data.result;
}

export async function getMyLinks(
	query: MyLinksQuery = {},
): Promise<MyLinksResponse> {
	const { data } = await apiClient.get<ApiResponse<MyLinksResponse>>(
		"/link",
		{
			params: query,
		},
	);
	if (!data.result) throw new Error(data.error ?? "Failed to fetch links");
	return data.result;
}

export async function cancelLink(token: string): Promise<void> {
	await apiClient.delete(`/link/${token}/cancel`);
}

/** Public — no auth required */
export async function lookupLink(token: string): Promise<LinkInfoResponse> {
	const { data } = await apiClient.get<ApiResponse<LinkInfoResponse>>(
		`/link/${token}`,
	);
	if (!data.result) throw new Error(data.error ?? "Link not found");
	return data.result;
}

/** Public — no auth required */
export async function claimLink(
	token: string,
	req: ClaimLinkRequest,
): Promise<ClaimLinkResponse> {
	const { data } = await apiClient.post<ApiResponse<ClaimLinkResponse>>(
		`/link/${token}/claim`,
		req,
	);
	if (!data.result) throw new Error(data.error ?? "Failed to claim link");
	return data.result;
}
