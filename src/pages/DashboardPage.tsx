import { Link } from "react-router-dom";
import { ArrowUpDown, PlusCircle, ArrowUpRight } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useBalances } from "@/hooks/useBalances";
import { useTransactions } from "@/hooks/useTransactions";
import { useLinks } from "@/hooks/useLinks";
import {
	formatUSD,
	mintToSymbol,
	timeAgo,
	truncateAddress,
	formatTokenAmount,
} from "@/lib/utils";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ComingSoonBanner } from "@/components/common/ComingSoonBanner";
import { TokenIcon } from "@/components/common/TokenIcon";

function StatCard({
	label,
	value,
	sub,
	loading,
}: {
	label: string;
	value: string;
	sub?: string;
	loading?: boolean;
}) {
	return (
		<div className="rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] p-5">
			<p className="text-xs text-[hsl(215_20%_55%)] mb-2">{label}</p>
			{loading ? (
				<div className="h-7 w-24 rounded bg-white/5 animate-pulse" />
			) : (
				<>
					<p className="text-xl font-semibold text-white">{value}</p>
					{sub && (
						<p className="text-xs text-[hsl(215_20%_55%)] mt-0.5">
							{sub}
						</p>
					)}
				</>
			)}
		</div>
	);
}

export function DashboardPage() {
	console.log("in dashboard");
	const { user } = useAuthStore();
	const { data: balances, isLoading: balancesLoading } = useBalances();
	const { data: txData, isLoading: txLoading } = useTransactions({
		limit: 5,
	});
	const { data: linksData } = useLinks({ status: "active", limit: 1 });

	const greeting = () => {
		const h = new Date().getHours();
		if (h < 12) return "Good morning";
		if (h < 18) return "Good afternoon";
		return "Good evening";
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-xl font-semibold text-white">
						{greeting()}
						{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
					</h1>
					{user?.wallet && (
						<p className="text-xs text-[hsl(215_20%_55%)] mt-1 font-mono">
							{truncateAddress(user.wallet, 6)}
						</p>
					)}
				</div>
			</div>

			{/* Stats row */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<StatCard
					label="Total Balance"
					value={balances ? formatUSD(balances.total_usd_value) : "—"}
					sub={
						balancesLoading
							? undefined
							: `${balances?.balances.length ?? 0} tokens`
					}
					loading={balancesLoading}
				/>
				<StatCard
					label="Active Links"
					value={String(linksData?.pagination.total ?? 0)}
					sub="awaiting claim"
				/>
				<StatCard
					label="Transactions"
					value={String(txData?.pagination.total ?? 0)}
					sub="total recorded"
				/>
			</div>

			{/* Quick actions */}
			<div>
				<p className="text-xs text-[hsl(215_20%_55%)] uppercase tracking-widest mb-3">
					Quick Actions
				</p>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
					<Link
						to="/links/create"
						className="flex flex-col items-center gap-2 rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] p-4 hover:bg-white/5 transition-colors text-center"
					>
						<PlusCircle size={20} className="text-white" />
						<span className="text-xs font-medium text-white">
							Create Link
						</span>
					</Link>
					<Link
						to="/swap"
						className="flex flex-col items-center gap-2 rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] p-4 hover:bg-white/5 transition-colors text-center"
					>
						<ArrowUpDown size={20} className="text-white" />
						<span className="text-xs font-medium text-white">
							Swap
						</span>
					</Link>
					<div className="flex flex-col items-center gap-2 rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)]/50 p-4 text-center opacity-60 relative">
						<span className="text-lg">↓</span>
						<span className="text-xs font-medium text-[hsl(215_20%_55%)]">
							Deposit
						</span>
						<span className="absolute top-2 right-2 text-[9px] font-bold text-amber-400 uppercase tracking-widest">
							Soon
						</span>
					</div>
					<div className="flex flex-col items-center gap-2 rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)]/50 p-4 text-center opacity-60 relative">
						<span className="text-lg">↑</span>
						<span className="text-xs font-medium text-[hsl(215_20%_55%)]">
							Withdraw
						</span>
						<span className="absolute top-2 right-2 text-[9px] font-bold text-amber-400 uppercase tracking-widest">
							Soon
						</span>
					</div>
				</div>
			</div>

			{/* Coming soon banners */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<ComingSoonBanner
					title="Deposit"
					description="Fund your wallet directly from a bank or exchange. Launching soon."
				/>
				<ComingSoonBanner
					title="Withdraw"
					description="Send funds to any bank account or external wallet. Launching soon."
				/>
			</div>

			{/* Recent transactions */}
			<div>
				<div className="flex items-center justify-between mb-3">
					<p className="text-xs text-[hsl(215_20%_55%)] uppercase tracking-widest">
						Recent Transactions
					</p>
					<Link
						to="/wallet"
						className="text-xs text-[hsl(215_20%_55%)] hover:text-white transition-colors flex items-center gap-1"
					>
						View all <ArrowUpRight size={12} />
					</Link>
				</div>
				<div className="rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] divide-y divide-[hsl(216_34%_17%)]">
					{txLoading ? (
						Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className="flex items-center gap-3 px-4 py-3"
							>
								<div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
								<div className="flex-1 flex flex-col gap-1.5">
									<div className="h-3 w-32 rounded bg-white/5 animate-pulse" />
									<div className="h-2.5 w-20 rounded bg-white/5 animate-pulse" />
								</div>
								<div className="h-3 w-16 rounded bg-white/5 animate-pulse" />
							</div>
						))
					) : !txData?.transactions.length ? (
						<div className="py-10 text-center text-xs text-[hsl(215_20%_55%)]">
							No transactions yet
						</div>
					) : (
						txData.transactions.map((tx) => (
							<div
								key={tx.id}
								className="flex items-center gap-3 px-4 py-3"
							>
								<TokenIcon
									mint={tx.mint}
									symbol={tx.symbol}
									size={32}
								/>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-1.5">
										<span className="text-xs font-medium text-white capitalize">
											{tx.txn_type}
										</span>
										<StatusBadge status={tx.status} />
									</div>
									<p className="text-[10px] text-[hsl(215_20%_55%)] mt-0.5 truncate">
										{timeAgo(tx.created_at)}
									</p>
								</div>
								<p
									className={`text-xs font-medium ${tx.direction === "in" ? "text-green-400" : "text-white"}`}
								>
									{tx.direction === "in" ? "+" : "-"}
									{formatTokenAmount(
										tx.amount / 1e9,
										tx.symbol,
									)}
								</p>
							</div>
						))
					)}
				</div>
			</div>

			{/* Token balances preview */}
			{balances && balances.balances.length > 0 && (
				<div>
					<div className="flex items-center justify-between mb-3">
						<p className="text-xs text-[hsl(215_20%_55%)] uppercase tracking-widest">
							Top Balances
						</p>
						<Link
							to="/wallet"
							className="text-xs text-[hsl(215_20%_55%)] hover:text-white transition-colors flex items-center gap-1"
						>
							View all <ArrowUpRight size={12} />
						</Link>
					</div>
					<div className="rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] divide-y divide-[hsl(216_34%_17%)]">
						{balances.balances.slice(0, 3).map((b) => (
							<div
								key={b.mint}
								className="flex items-center gap-3 px-4 py-3"
							>
								<TokenIcon
									mint={b.mint}
									symbol={b.symbol}
									size={32}
								/>
								<div className="flex-1 min-w-0">
									<p className="text-xs font-medium text-white">
										{b.symbol}
									</p>
									<p className="text-[10px] text-[hsl(215_20%_55%)]">
										{formatUSD(b.usd_price)} /{" "}
										{mintToSymbol(b.mint)}
									</p>
								</div>
								<div className="text-right">
									<p className="text-xs font-medium text-white">
										{parseFloat(b.ui_amount).toFixed(4)}{" "}
										{b.symbol}
									</p>
									<p className="text-[10px] text-[hsl(215_20%_55%)]">
										{formatUSD(b.usd_value)}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
