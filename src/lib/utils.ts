import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** Truncate a Solana wallet address: first 4 + last 4 chars */
export function truncateAddress(addr: string, chars = 4): string {
	if (!addr || addr.length < chars * 2 + 3) return addr;
	return `${addr.slice(0, chars)}…${addr.slice(-chars)}`;
}

/** Format lamports to SOL string e.g. "0.5 SOL" */
export function lamportsToSol(lamports: number): string {
	return (lamports / 1_000_000_000).toFixed(4).replace(/\.?0+$/, "");
}

/** Format a USD value with $ prefix */
export function formatUSD(value: string | number): string {
	const num = typeof value === "string" ? parseFloat(value) : value;
	if (isNaN(num)) return "$0.00";
	return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Format token amount for display (strip trailing zeros) */
export function formatTokenAmount(
	amount: string | number,
	symbol: string,
): string {
	const num = typeof amount === "string" ? parseFloat(amount) : amount;
	if (isNaN(num)) return `0 ${symbol}`;
	const formatted = num.toLocaleString("en-US", { maximumFractionDigits: 6 });
	return `${formatted} ${symbol}`;
}

/** Format raw amount (i64) to a human-readable number given decimals */
export function formatRawAmount(raw: number, decimals: number): string {
	return (raw / Math.pow(10, decimals)).toLocaleString("en-US", {
		maximumFractionDigits: 6,
	});
}

/** Relative time eg "2 minutes ago", with full date on hover */
export function timeAgo(dateStr: string | null | undefined): string {
	if (!dateStr) return "—";
	try {
		return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
	} catch {
		return dateStr;
	}
}

/** Full formatted date for tooltips */
export function fullDate(dateStr: string | null | undefined): string {
	if (!dateStr) return "—";
	try {
		return format(new Date(dateStr), "MMM d, yyyy HH:mm");
	} catch {
		return dateStr;
	}
}

/** Validate a Solana address (Base58, 32–44 chars) */
export function isValidSolanaAddress(addr: string): boolean {
	if (!addr || addr.length < 32 || addr.length > 44) return false;
	return /^[1-9A-HJ-NP-Za-km-z]+$/.test(addr);
}

/** Known mint → symbol map */
export const MINT_SYMBOL_MAP: Record<string, string> = {
	"": "SOL",
	native: "SOL",
	EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: "USDC",
	Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: "USDT",
};

export function mintToSymbol(mint: string | null | undefined): string {
	if (!mint) return "SOL";
	return MINT_SYMBOL_MAP[mint] ?? mint.slice(0, 4) + "…";
}

/** Format a raw on-chain amount to human-readable, based on mint decimals.
 *  SOL uses 9 decimals (lamports), USDC/USDT use 6. */
export function formatLinkAmount(
	amount: number,
	mint: string | null | undefined,
): string {
	const decimals =
		mint === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" ||
		mint === "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
			? 6
			: 9;
	return (amount / Math.pow(10, decimals))
		.toFixed(decimals === 6 ? 2 : 4)
		.replace(/\.?0+$/, "");
}

/** Solscan URLs */
export const solscanTx = (sig: string) => `https://solscan.io/tx/${sig}`;
export const solscanAddr = (addr: string) =>
	`https://solscan.io/account/${addr}`;
