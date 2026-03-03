import apiClient from "./client";
import type {
	WalletBalanceResponse,
	TransactionListResponse,
	TransactionResponse,
	TransactionFilterQuery,
	SendTransactionRequest,
	SendTransactionResponse,
	EstimateFeeResponse,
} from "@/types/wallet";
import type { ApiResponse } from "@/types/user";

export async function getAllBalances(): Promise<WalletBalanceResponse> {
	const { data } =
		await apiClient.get<ApiResponse<WalletBalanceResponse>>(
			"/wallet/balances",
		);
	if (!data.result) throw new Error(data.error ?? "Failed to fetch balances");
	return data.result;
}

export async function getTransactions(
	query: TransactionFilterQuery = {},
): Promise<TransactionListResponse> {
	const { data } = await apiClient.get<ApiResponse<TransactionListResponse>>(
		"/wallet/transactions",
		{ params: query },
	);
	if (!data.result)
		throw new Error(data.error ?? "Failed to fetch transactions");
	return data.result;
}

export async function getTransaction(id: string): Promise<TransactionResponse> {
	const { data } = await apiClient.get<ApiResponse<TransactionResponse>>(
		`/wallet/transaction/${id}`,
	);
	if (!data.result)
		throw new Error(data.error ?? "Failed to fetch transaction");
	return data.result;
}

export async function sendTransaction(
	req: SendTransactionRequest,
): Promise<SendTransactionResponse> {
	const { data } = await apiClient.post<ApiResponse<SendTransactionResponse>>(
		"/wallet/send",
		req,
	);
	if (!data.result)
		throw new Error(data.error ?? "Failed to send transaction");
	return data.result;
}

export async function estimateFee(
	to: string,
	amount: number,
	mint?: string,
): Promise<EstimateFeeResponse> {
	const { data } = await apiClient.get<ApiResponse<EstimateFeeResponse>>(
		"/wallet/fee",
		{
			params: { to, amount, mint },
		},
	);
	if (!data.result) throw new Error(data.error ?? "Failed to estimate fee");
	return data.result;
}
