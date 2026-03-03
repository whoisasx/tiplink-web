import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
	ArrowUpDown,
	RefreshCw,
	TrendingDown,
	Info,
	ArrowLeftRight,
} from "lucide-react";
import { useSwapQuote, useExecuteSwap, useSwapHistory } from "@/hooks/useSwap";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { solscanTx, timeAgo } from "@/lib/utils";
import type { SwapQuoteQuery, SwapQuoteResponse } from "@/types/swap";

// Known mints
const MINTS: Record<string, string> = {
	SOL: "So11111111111111111111111111111111111111112",
	USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
	USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
};
const MINT_TO_SYMBOL: Record<string, string> = Object.fromEntries(
	Object.entries(MINTS).map(([sym, mint]) => [mint, sym]),
);
const TOKENS = ["SOL", "USDC", "USDT"];
const SLIPPAGE_OPTIONS = [
	{ label: "0.5%", bps: 50 },
	{ label: "1%", bps: 100 },
	{ label: "2%", bps: 200 },
];

function TokenSelector({
	value,
	onChange,
	exclude,
}: {
	value: string;
	onChange: (v: string) => void;
	exclude: string;
}) {
	return (
		<div className="flex gap-1">
			{TOKENS.filter((t) => t !== exclude).map((t) => (
				<button
					key={t}
					onClick={() => onChange(t)}
					className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
						value === t
							? "bg-white/15 text-white"
							: "text-[hsl(215_20%_55%)] hover:text-white hover:bg-white/5"
					}`}
				>
					{t}
				</button>
			))}
		</div>
	);
}

function QuoteCard({
	quote,
	refreshing,
	onRefresh,
}: {
	quote: SwapQuoteResponse;
	refreshing: boolean;
	onRefresh: () => void;
}) {
	const priceImpact = parseFloat(quote.price_impact ?? "0");
	const impactColor =
		priceImpact > 5
			? "text-red-400"
			: priceImpact > 1
				? "text-amber-400"
				: "text-emerald-400";

	return (
		<div className="rounded-xl border border-[hsl(216_34%_17%)] bg-white/3 p-4 flex flex-col gap-3">
			<div className="flex items-center justify-between text-xs text-[hsl(215_20%_55%)]">
				<span>Quote Preview</span>
				<button
					onClick={onRefresh}
					disabled={refreshing}
					className="flex items-center gap-1 hover:text-white transition-colors"
				>
					<RefreshCw
						size={11}
						className={refreshing ? "animate-spin" : ""}
					/>
					Refresh
				</button>
			</div>
			<div className="flex items-center gap-2 text-sm text-[hsl(215_20%_65%)]">
				<span>
					{quote.input_amount / 1e9}{" "}
					{MINT_TO_SYMBOL[quote.input_mint] ??
						quote.input_mint.slice(0, 4)}
				</span>
				<ArrowUpDown size={13} className="text-[hsl(215_20%_40%)]" />
				<span className="text-white font-semibold">
					{quote.output_amount / 1e9}{" "}
					{MINT_TO_SYMBOL[quote.output_mint] ??
						quote.output_mint.slice(0, 4)}
				</span>
			</div>
			<div className="flex items-center gap-4 text-xs">
				<span className="flex items-center gap-1 text-[hsl(215_20%_55%)]">
					<TrendingDown size={11} />
					Price impact:{" "}
					<span className={impactColor}>{quote.price_impact}%</span>
				</span>
				<span className="text-[hsl(215_20%_55%)]">
					Route:{" "}
					<span className="text-[hsl(215_20%_75%)]">
						{quote.route_label}
					</span>
				</span>
			</div>
		</div>
	);
}

export function SwapPage() {
	const [inputSymbol, setInputSymbol] = useState("SOL");
	const [outputSymbol, setOutputSymbol] = useState("USDC");
	const [amountStr, setAmountStr] = useState("");
	const [slippageBps, setSlippageBps] = useState(100);
	const [quoteQuery, setQuoteQuery] = useState<SwapQuoteQuery | null>(null);
	const [step, setStep] = useState<"idle" | "submitting" | "done">("idle");
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const historyPage = 1;

	const {
		data: quote,
		isFetching: quoteFetching,
		isError: quoteError,
		refetch: refetchQuote,
	} = useSwapQuote(quoteQuery);

	const { mutateAsync: executeSwap } = useExecuteSwap();
	const { data: history, isLoading: historyLoading } = useSwapHistory({
		page: historyPage,
		limit: 5,
	});

	// Debounce quote fetch when inputs change
	useEffect(() => {
		const amount = parseFloat(amountStr);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			if (!amountStr || isNaN(amount) || amount <= 0) {
				setQuoteQuery(null);
				return;
			}
			setQuoteQuery({
				input_mint: MINTS[inputSymbol],
				output_mint: MINTS[outputSymbol],
				amount: Math.round(amount * 1e9),
				slippage_bps: slippageBps,
			});
		}, 500);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [amountStr, inputSymbol, outputSymbol, slippageBps]);

	const swap = () => {
		if (outputSymbol === inputSymbol) {
			// can happen if user re-selects — guard
			toast.error("Select different tokens");
			return;
		}
		if (!quote) return;
		setStep("submitting");
		executeSwap({
			input_mint: quote.input_mint,
			output_mint: quote.output_mint,
			input_amount: quote.input_amount,
			output_amount: quote.output_amount,
			slippage_bps: quote.slippage_bps,
			price_impact: quote.price_impact,
			route_label: quote.route_label,
			quote_raw: quote.quote_raw,
		})
			.then(() => {
				toast.success("Swap submitted!");
				setStep("done");
				setAmountStr("");
				setQuoteQuery(null);
			})
			.catch((err: unknown) => {
				const msg =
					(err as { response?: { data?: { message?: string } } })
						?.response?.data?.message ??
					"Swap failed. Please try again.";
				toast.error(msg);
				setStep("idle");
			});
	};

	const flipTokens = () => {
		setInputSymbol(outputSymbol);
		setOutputSymbol(inputSymbol);
		setAmountStr("");
		setQuoteQuery(null);
		setStep("idle");
	};

	return (
		<div className="flex flex-col gap-6 max-w-md mx-auto">
			<div>
				<h1 className="text-xl font-semibold text-white">Swap</h1>
				<p className="text-xs text-[hsl(215_20%_55%)] mt-1">
					Swap tokens powered by Jupiter
				</p>
			</div>

			<div className="rounded-2xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] p-5 flex flex-col gap-4">
				{/* Input token */}
				<div>
					<div className="flex items-center justify-between mb-1.5">
						<span className="text-xs font-medium text-[hsl(215_20%_55%)]">
							You Pay
						</span>
						<TokenSelector
							value={inputSymbol}
							onChange={(v) => {
								setInputSymbol(v);
								if (v === outputSymbol)
									setOutputSymbol(
										TOKENS.find(
											(t) => t !== v && t !== inputSymbol,
										) ?? "USDC",
									);
							}}
							exclude={outputSymbol}
						/>
					</div>
					<div className="flex items-center gap-2 bg-white/4 border border-[hsl(216_34%_17%)] rounded-xl px-3 py-3">
						<input
							type="number"
							value={amountStr}
							onChange={(e) => {
								setAmountStr(e.target.value);
								if (step === "done") setStep("idle");
							}}
							placeholder="0.00"
							min="0"
							step="any"
							className="flex-1 bg-transparent text-lg font-semibold text-white placeholder:text-[hsl(215_20%_30%)] focus:outline-none"
						/>
						<span className="text-sm font-medium text-[hsl(215_20%_65%)]">
							{inputSymbol}
						</span>
					</div>
				</div>

				{/* Flip button */}
				<div className="flex justify-center -my-1">
					<button
						onClick={flipTokens}
						className="w-8 h-8 rounded-lg border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_8%)] flex items-center justify-center text-[hsl(215_20%_55%)] hover:text-white hover:bg-white/10 transition-colors"
						aria-label="Flip tokens"
					>
						<ArrowUpDown size={14} />
					</button>
				</div>

				{/* Output token */}
				<div>
					<div className="flex items-center justify-between mb-1.5">
						<span className="text-xs font-medium text-[hsl(215_20%_55%)]">
							You Receive
						</span>
						<TokenSelector
							value={outputSymbol}
							onChange={(v) => {
								setOutputSymbol(v);
								if (v === inputSymbol)
									setInputSymbol(
										TOKENS.find(
											(t) =>
												t !== v && t !== outputSymbol,
										) ?? "SOL",
									);
							}}
							exclude={inputSymbol}
						/>
					</div>
					<div className="flex items-center gap-2 bg-white/4 border border-[hsl(216_34%_17%)] rounded-xl px-3 py-3">
						<span className="flex-1 text-lg font-semibold text-[hsl(215_20%_65%)]">
							{quoteFetching ? (
								<LoadingSpinner size="sm" />
							) : quote ? (
								(quote.output_amount / 1e9).toLocaleString(
									undefined,
									{ maximumFractionDigits: 6 },
								)
							) : (
								"0.00"
							)}
						</span>
						<span className="text-sm font-medium text-[hsl(215_20%_65%)]">
							{outputSymbol}
						</span>
					</div>
				</div>

				{/* Slippage */}
				<div>
					<div className="flex items-center gap-1.5 mb-2">
						<span className="text-xs font-medium text-[hsl(215_20%_55%)]">
							Slippage
						</span>
						<Info size={11} className="text-[hsl(215_20%_40%)]" />
					</div>
					<div className="flex gap-1.5">
						{SLIPPAGE_OPTIONS.map((opt) => (
							<button
								key={opt.bps}
								onClick={() => setSlippageBps(opt.bps)}
								className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
									slippageBps === opt.bps
										? "bg-white/15 text-white"
										: "text-[hsl(215_20%_55%)] hover:text-white hover:bg-white/5 border border-[hsl(216_34%_17%)]"
								}`}
							>
								{opt.label}
							</button>
						))}
					</div>
				</div>

				{/* Quote card */}
				{quoteError && (
					<p className="text-xs text-red-400 flex items-center gap-1">
						<span>
							Failed to get quote. Try a different amount.
						</span>
					</p>
				)}
				{quote && !quoteError && (
					<QuoteCard
						quote={quote}
						refreshing={quoteFetching}
						onRefresh={() => void refetchQuote()}
					/>
				)}

				{/* Action button */}
				<button
					onClick={swap}
					disabled={
						!quote ||
						step === "submitting" ||
						quoteFetching ||
						step === "done"
					}
					className="w-full py-3 rounded-xl bg-white text-[hsl(222_47%_11%)] font-semibold text-sm hover:bg-white/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
				>
					{step === "submitting" && <LoadingSpinner size="sm" />}
					{step === "done"
						? "Swapped!"
						: step === "submitting"
							? "Swapping…"
							: !amountStr
								? "Enter Amount"
								: quoteFetching
									? "Getting Quote…"
									: !quote
										? "Get Quote"
										: "Swap Now"}
				</button>
			</div>

			{/* Swap history */}
			<div>
				<h2 className="text-sm font-semibold text-white mb-3">
					Recent Swaps
				</h2>
				{historyLoading ? (
					<div className="flex flex-col gap-2">
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className="rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] p-4"
							>
								<div className="h-3 w-40 rounded bg-white/5 animate-pulse" />
							</div>
						))}
					</div>
				) : !history?.swaps.length ? (
					<EmptyState
						icon={ArrowLeftRight}
						title="No swaps yet"
						description="Your swap history will appear here."
					/>
				) : (
					<div className="flex flex-col gap-2">
						{history.swaps.map((swap) => (
							<div
								key={swap.id}
								className="rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] p-4 flex items-center gap-3"
							>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 text-sm">
										<span className="text-[hsl(215_20%_55%)]">
											{swap.input_amount / 1e9}{" "}
											{swap.input_symbol}
										</span>
										<ArrowUpDown
											size={11}
											className="text-[hsl(215_20%_40%)]"
										/>
										<span className="text-white font-medium">
											{swap.output_amount / 1e9}{" "}
											{swap.output_symbol}
										</span>
									</div>
									<p className="text-[11px] text-[hsl(215_20%_45%)] mt-0.5">
										{timeAgo(swap.created_at)}
									</p>
								</div>
								<div className="flex flex-col items-end gap-1.5">
									<StatusBadge status={swap.status} />
									{swap.signature && (
										<a
											href={solscanTx(swap.signature)}
											target="_blank"
											rel="noopener noreferrer"
											className="text-[10px] text-[hsl(215_20%_45%)] hover:text-white"
										>
											Solscan ↗
										</a>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
