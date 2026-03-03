export type LinkStatus = "active" | "claimed" | "cancelled" | "expired" | "all";

export interface CreateLinkRequest {
	amount: number;
	mint?: string;
	note?: string;
	expiry_at?: string;
}

export interface CreateLinkResponse {
	link_id: string;
	link_token: string;
	link_url: string;
	escrow_pubkey: string;
	amount: number;
	mint: string | null;
	note: string | null;
	expiry_at: string | null;
	status: LinkStatus;
	created_at: string;
}

export interface LinkPagination {
	page: number;
	limit: number;
	total: number;
	total_pages: number;
	has_next: boolean;
	has_prev: boolean;
}

export interface LinkListItem {
	link_id: string;
	link_url: string;
	amount: number;
	mint: string | null;
	note: string | null;
	status: LinkStatus;
	expiry_at: string | null;
	claimer_wallet: string | null;
	claimed_at: string | null;
	created_at: string;
}

export interface MyLinksResponse {
	pagination: LinkPagination;
	links: LinkListItem[];
}

export interface MyLinksQuery {
	page?: number;
	limit?: number;
	status?: LinkStatus;
}

export interface LinkInfoResponse {
	link_id: string;
	amount: number;
	mint: string | null;
	symbol: string;
	note: string | null;
	status: LinkStatus;
	expiry_at: string | null;
	created_at: string;
}

export interface ClaimLinkRequest {
	claimer_wallet: string;
}

export interface ClaimLinkResponse {
	signature: string;
	amount: number;
	symbol: string;
}
