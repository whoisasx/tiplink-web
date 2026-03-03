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
			"/wallet/balance",
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

/** Convert a human-readable token amount to its smallest on-chain unit. */
function toBaseUnits(amount: number, mint?: string): number {
	// SOL  → lamports  (9 decimals)
	// USDC / USDT → base units (6 decimals)
	if (!mint || mint === "SOL") return Math.floor(amount * 1_000_000_000);
	return Math.floor(amount * 1_000_000);
}

export async function sendTransaction(
	req: SendTransactionRequest,
): Promise<SendTransactionResponse> {
	const mint = req.mint && req.mint !== "SOL" ? req.mint : "SOL";
	const amountBase = toBaseUnits(req.amount, req.mint);

	const { data } = await apiClient.post<ApiResponse<SendTransactionResponse>>(
		"/wallet/send",
		{
			to_account: req.to,
			amount: String(amountBase),
			mint,
		},
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
	const mintStr = mint && mint !== "SOL" ? mint : "SOL";
	const amountBase =
		mintStr === "SOL"
			? Math.floor(amount * 1_000_000_000)
			: Math.floor(amount * 1_000_000);

	const { data } = await apiClient.get<ApiResponse<EstimateFeeResponse>>(
		"/wallet/fee",
		{
			params: {
				to_account: to,
				amount: String(amountBase),
				mint: mintStr,
			},
		},
	);
	if (!data.result) throw new Error(data.error ?? "Failed to estimate fee");
	return data.result;
}
