export interface TokenBalance {
	mint: string;
	symbol: string;
	name: string;
	decimal: string;
	raw_amount: number;
	ui_amount: string;
	usd_price: string;
	usd_value: string;
	logo_uri: string;
}

export interface WalletBalanceResponse {
	wallet_pubkey: string;
	total_usd_value: string;
	balances: TokenBalance[];
	last_synced_at: string;
}

export type TransactionStatus = "pending" | "confirmed" | "failed";
export type TransactionType = "send" | "receive" | "swap";
export type TransactionDirection = "in" | "out";

export interface TransactionCounterParty {
	address: string;
	is_platform_user: boolean;
}

export interface TransactionResponse {
	id: string;
	txn_type: TransactionType;
	status: TransactionStatus;
	amount: number;
	mint: string | null;
	symbol: string;
	usd_value_at_time: number | null;
	direction: TransactionDirection;
	counter_party: TransactionCounterParty;
	signature: string | null;
	block_time: string | null;
	created_at: string | null;
}

export interface Pagination {
	page: number;
	limit: number;
	total: number;
	total_pages: number;
	has_next: boolean;
	has_prev: boolean;
}

export interface TransactionListResponse {
	pagination: Pagination;
	transactions: TransactionResponse[];
}

export interface EstimateFeeResponse {
	fee_lamports: number;
	fee_sol: string;
}

export interface SendTransactionRequest {
	to: string;
	amount: number;
	mint?: string;
}

export interface SendTransactionResponse {
	signature: string;
	tx_id: string;
}

export interface TransactionFilterQuery {
	page?: number;
	limit?: number;
	status?: TransactionStatus;
	mint?: string;
}
