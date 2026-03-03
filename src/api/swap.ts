import apiClient from "./client";
import type {
	SwapQuoteQuery,
	SwapQuoteResponse,
	SwapExecuteRequest,
	SwapHistoryQuery,
	SwapHistoryResponse,
} from "@/types/swap";
import type { ApiResponse } from "@/types/user";

export async function getSwapQuote(
	query: SwapQuoteQuery,
): Promise<SwapQuoteResponse> {
	const { data } = await apiClient.get<ApiResponse<SwapQuoteResponse>>(
		"/swap/quote",
		{
			params: query,
		},
	);
	if (!data.result) throw new Error(data.error ?? "Failed to get quote");
	return data.result;
}

export async function executeSwap(
	req: SwapExecuteRequest,
): Promise<{ signature: string }> {
	const { data } = await apiClient.post<ApiResponse<{ signature: string }>>(
		"/swap/execute",
		req,
	);
	if (!data.result) throw new Error(data.error ?? "Failed to execute swap");
	return data.result;
}

export async function getSwapHistory(
	query: SwapHistoryQuery = {},
): Promise<SwapHistoryResponse> {
	const { data } = await apiClient.get<ApiResponse<SwapHistoryResponse>>(
		"/swap/history",
		{
			params: query,
		},
	);
	if (!data.result)
		throw new Error(data.error ?? "Failed to fetch swap history");
	return data.result;
}
