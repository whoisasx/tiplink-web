import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { useBalances } from "@/hooks/useBalances";
import { useTransactions } from "@/hooks/useTransactions";
import {
	formatUSD,
	formatTokenAmount,
	timeAgo,
	fullDate,
	solscanTx,
} from "@/lib/utils";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TokenIcon } from "@/components/common/TokenIcon";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { AddressDisplay } from "@/components/common/AddressDisplay";
import type { TransactionStatus } from "@/types/wallet";

const STATUS_FILTERS: Array<{ label: string; value: TransactionStatus | "" }> =
	[
		{ label: "All", value: "" },
		{ label: "Confirmed", value: "confirmed" },
		{ label: "Pending", value: "pending" },
		{ label: "Failed", value: "failed" },
	];

export function WalletPage() {
	const [tab, setTab] = useState<"balances" | "transactions">("balances");
	const [txPage, setTxPage] = useState(1);
	const [statusFilter, setStatusFilter] = useState<TransactionStatus | "">(
		"",
	);

	const {
		data: balances,
		isLoading: balancesLoading,
		isError: balancesError,
		refetch: refetchBalances,
	} = useBalances();
	const {
		data: txData,
		isLoading: txLoading,
		isError: txError,
		refetch: refetchTx,
	} = useTransactions({
		page: txPage,
		limit: 15,
		status: statusFilter || undefined,
	});

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-xl font-semibold text-white">Wallet</h1>
				{balances && (
					<p className="text-sm text-[hsl(215_20%_55%)] mt-1">
						Total:{" "}
						<span className="text-white font-medium">
							{formatUSD(balances.total_usd_value)}
						</span>
						<span className="mx-2">·</span>
						<span className="font-mono text-xs">
							{balances.wallet_pubkey.slice(0, 8)}…
						</span>
					</p>
				)}
			</div>

			{/* Tab switcher */}
			<div className="flex gap-1 p-1 rounded-lg bg-[hsl(224_71%_6%)] border border-[hsl(216_34%_17%)] w-fit">
				{(["balances", "transactions"] as const).map((t) => (
					<button
						key={t}
						onClick={() => setTab(t)}
						className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
							tab === t
								? "bg-white/10 text-white"
								: "text-[hsl(215_20%_55%)] hover:text-white"
						}`}
					>
						{t}
					</button>
				))}
			</div>

			{/* Balances tab */}
			{tab === "balances" && (
				<>
					{balancesLoading ? (
						<div className="rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] divide-y divide-[hsl(216_34%_17%)]">
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="flex items-center gap-3 px-4 py-4"
								>
									<div className="w-9 h-9 rounded-full bg-white/5 animate-pulse" />
									<div className="flex-1 flex flex-col gap-2">
										<div className="h-3 w-16 rounded bg-white/5 animate-pulse" />
										<div className="h-2.5 w-24 rounded bg-white/5 animate-pulse" />
									</div>
									<div className="flex flex-col gap-2 items-end">
										<div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
										<div className="h-2.5 w-14 rounded bg-white/5 animate-pulse" />
									</div>
								</div>
							))}
						</div>
					) : balancesError ? (
						<ErrorState
							message="Failed to load balances."
							onRetry={() => void refetchBalances()}
						/>
					) : !balances?.balances.length ? (
						<EmptyState
							title="No balances"
							description="Your wallet has no token balances yet."
						/>
					) : (
						<div className="rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] divide-y divide-[hsl(216_34%_17%)]">
							{balances.balances.map((b) => (
								<div
									key={b.mint}
									className="flex items-center gap-3 px-4 py-4"
								>
									<TokenIcon
										mint={b.mint}
										symbol={b.symbol}
										size={36}
									/>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-white">
											{b.symbol}
										</p>
										<p className="text-xs text-[hsl(215_20%_55%)] truncate">
											{b.name || b.symbol}
										</p>
									</div>
									<div className="text-right">
										<p className="text-sm font-medium text-white">
											{formatTokenAmount(
												parseFloat(b.ui_amount),
												b.symbol,
											)}
										</p>
										<p className="text-xs text-[hsl(215_20%_55%)]">
											{formatUSD(b.usd_value)}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</>
			)}

			{/* Transactions tab */}
			{tab === "transactions" && (
				<div className="flex flex-col gap-4">
					{/* Filter bar */}
					<div className="flex gap-1 flex-wrap">
						{STATUS_FILTERS.map((f) => (
							<button
								key={f.value}
								onClick={() => {
									setStatusFilter(
										f.value as TransactionStatus | "",
									);
									setTxPage(1);
								}}
								className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
									statusFilter === f.value
										? "bg-white/10 text-white"
										: "text-[hsl(215_20%_55%)] hover:text-white hover:bg-white/5"
								}`}
							>
								{f.label}
							</button>
						))}
					</div>

					{txLoading ? (
						<div className="rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] divide-y divide-[hsl(216_34%_17%)]">
							{Array.from({ length: 5 }).map((_, i) => (
								<div
									key={i}
									className="flex items-center gap-3 px-4 py-4"
								>
									<div className="w-9 h-9 rounded-full bg-white/5 animate-pulse" />
									<div className="flex-1 flex flex-col gap-2">
										<div className="h-3 w-40 rounded bg-white/5 animate-pulse" />
										<div className="h-2.5 w-24 rounded bg-white/5 animate-pulse" />
									</div>
									<div className="h-3 w-16 rounded bg-white/5 animate-pulse" />
								</div>
							))}
						</div>
					) : txError ? (
						<ErrorState
							message="Failed to load transactions."
							onRetry={() => void refetchTx()}
						/>
					) : !txData?.transactions.length ? (
						<EmptyState
							title={
								statusFilter
									? `No ${statusFilter} transactions`
									: "No transactions yet"
							}
							description="Your transaction history will appear here."
						/>
					) : (
						<>
							<div className="rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] divide-y divide-[hsl(216_34%_17%)]">
								{txData.transactions.map((tx) => (
									<div
										key={tx.id}
										className="flex items-start gap-3 px-4 py-4"
									>
										<TokenIcon
											mint={tx.mint}
											symbol={tx.symbol}
											size={36}
										/>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-1.5 flex-wrap">
												<span className="text-sm font-medium text-white capitalize">
													{tx.txn_type}
												</span>
												<StatusBadge
													status={tx.status}
												/>
											</div>
											<p className="text-xs text-[hsl(215_20%_55%)] mt-0.5">
												{tx.direction === "out"
													? "To"
													: "From"}{" "}
												<AddressDisplay
													address={
														tx.counter_party.address
													}
												/>
											</p>
											<div className="flex items-center gap-2 mt-1">
												<span
													title={fullDate(
														tx.created_at,
													)}
													className="text-[10px] text-[hsl(215_20%_55%)] cursor-default"
												>
													{timeAgo(tx.created_at)}
												</span>
												{tx.signature && (
													<a
														href={solscanTx(
															tx.signature,
														)}
														target="_blank"
														rel="noopener noreferrer"
														className="text-[10px] text-[hsl(215_20%_55%)] hover:text-white flex items-center gap-0.5 transition-colors"
													>
														Solscan{" "}
														<ExternalLink
															size={9}
														/>
													</a>
												)}
											</div>
										</div>
										<div className="text-right shrink-0">
											<p
												className={`text-sm font-medium ${tx.direction === "in" ? "text-green-400" : "text-white"}`}
											>
												{tx.direction === "in"
													? "+"
													: "−"}
												{formatTokenAmount(
													tx.amount / 1e9,
													tx.symbol,
												)}
											</p>
											{tx.usd_value_at_time != null && (
												<p className="text-[10px] text-[hsl(215_20%_55%)]">
													{formatUSD(
														tx.usd_value_at_time,
													)}
												</p>
											)}
										</div>
									</div>
								))}
							</div>
							<Pagination
								page={txData.pagination.page}
								totalPages={txData.pagination.total_pages}
								hasNext={txData.pagination.has_next}
								hasPrev={txData.pagination.has_prev}
								onPageChange={(p) => {
									setTxPage(p);
									window.scrollTo({
										top: 0,
										behavior: "smooth",
									});
								}}
							/>
						</>
					)}
				</div>
			)}
		</div>
	);
}
