export interface SwapQuoteQuery {
	input_mint: string;
	output_mint: string;
	amount: number;
	slippage_bps: number;
}

export interface SwapQuoteResponse {
	input_mint: string;
	output_mint: string;
	input_amount: number;
	output_amount: number;
	price_impact: string;
	route_label: string;
	slippage_bps: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	quote_raw: any;
}

export interface SwapExecuteRequest {
	input_mint: string;
	output_mint: string;
	input_amount: number;
	output_amount: number;
	slippage_bps: number;
	price_impact: string;
	route_label: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	quote_raw: any;
}

export type SwapStatus = "pending" | "confirmed" | "failed";

export interface SwapPagination {
	page: number;
	limit: number;
	total: number;
	total_pages: number;
	has_next: boolean;
	has_prev: boolean;
}

export interface SwapHistoryItem {
	id: string;
	input_mint: string;
	output_mint: string;
	input_symbol: string;
	output_symbol: string;
	input_amount: number;
	output_amount: number;
	status: SwapStatus;
	signature: string | null;
	created_at: string;
}

export interface SwapHistoryResponse {
	pagination: SwapPagination;
	swaps: SwapHistoryItem[];
}

export interface SwapHistoryQuery {
	page?: number;
	limit?: number;
}
