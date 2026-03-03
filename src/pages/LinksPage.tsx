import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
	PlusCircle,
	Trash2,
	AlertTriangle,
	ExternalLink,
	Copy,
	Link2,
	ChevronRight,
} from "lucide-react";
import { useLinks, useCancelLink } from "@/hooks/useLinks";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Pagination } from "@/components/common/Pagination";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { timeAgo, fullDate, mintToSymbol, formatLinkAmount } from "@/lib/utils";
import type { LinkStatus, LinkListItem } from "@/types/link";

const STATUS_TABS: Array<{ label: string; value: LinkStatus }> = [
	{ label: "All", value: "all" },
	{ label: "Active", value: "active" },
	{ label: "Claimed", value: "claimed" },
	{ label: "Cancelled", value: "cancelled" },
	{ label: "Expired", value: "expired" },
];

function ConfirmCancelDialog({
	link,
	onConfirm,
	onCancel,
	loading,
}: {
	link: LinkListItem;
	onConfirm: () => void;
	onCancel: () => void;
	loading: boolean;
}) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="w-full max-w-sm rounded-2xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_5%)] p-6 flex flex-col gap-4">
				<div className="flex items-start gap-3">
					<div className="w-9 h-9 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
						<AlertTriangle size={16} className="text-red-400" />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-white">
							Cancel this link?
						</h3>
						<p className="text-xs text-[hsl(215_20%_55%)] mt-1 leading-relaxed">
							The {formatLinkAmount(link.amount, link.mint)}{" "}
							{mintToSymbol(link.mint)} will be returned to your
							wallet. This cannot be undone.
						</p>
					</div>
				</div>
				<div className="flex gap-2">
					<button
						onClick={onCancel}
						disabled={loading}
						className="flex-1 py-2.5 rounded-xl border border-[hsl(216_34%_17%)] text-sm text-[hsl(215_20%_55%)] hover:text-white hover:bg-white/5 transition-colors"
					>
						Keep it
					</button>
					<button
						onClick={onConfirm}
						disabled={loading}
						className="flex-1 py-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
					>
						{loading ? <LoadingSpinner size="sm" /> : null}
						Cancel link
					</button>
				</div>
			</div>
		</div>
	);
}

export function LinksPage() {
	const [statusFilter, setStatusFilter] = useState<LinkStatus>("all");
	const [page, setPage] = useState(1);
	const [cancelTarget, setCancelTarget] = useState<LinkListItem | null>(null);

	const { data, isLoading, isError, refetch } = useLinks({
		status: statusFilter,
		page,
		limit: 10,
	});
	const { mutateAsync: cancelLink, isPending: cancelling } = useCancelLink();

	const appUrl =
		(import.meta.env.VITE_APP_URL as string | undefined) ??
		window.location.origin;

	const handleCancel = async () => {
		if (!cancelTarget) return;
		try {
			await cancelLink(cancelTarget.link_token);
			toast.success("Link cancelled");
			setCancelTarget(null);
		} catch {
			toast.error("Failed to cancel link");
		}
	};

	const copyLink = async (token: string) => {
		try {
			await navigator.clipboard.writeText(`${appUrl}/claim/${token}`);
			toast.success("Link copied!");
		} catch {
			toast.error("Failed to copy");
		}
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex items-center justify-between gap-4">
				<div>
					<h1 className="text-xl font-semibold text-white">
						My Links
					</h1>
					<p className="text-xs text-[hsl(215_20%_55%)] mt-1">
						Manage your payment links
					</p>
				</div>
				<Link
					to="/links/create"
					className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-[hsl(222_47%_11%)] font-semibold text-xs hover:bg-white/90 transition-colors"
				>
					<PlusCircle size={14} />
					Create
				</Link>
			</div>

			{/* Status tabs */}
			<div className="flex gap-1 flex-wrap">
				{STATUS_TABS.map((t) => (
					<button
						key={t.value}
						onClick={() => {
							setStatusFilter(t.value);
							setPage(1);
						}}
						className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
							statusFilter === t.value
								? "bg-white/10 text-white"
								: "text-[hsl(215_20%_55%)] hover:text-white hover:bg-white/5"
						}`}
					>
						{t.label}
					</button>
				))}
			</div>

			{isLoading ? (
				<div className="flex flex-col gap-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className="rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] p-4"
						>
							<div className="flex items-start justify-between">
								<div className="flex flex-col gap-2 flex-1">
									<div className="h-3 w-32 rounded bg-white/5 animate-pulse" />
									<div className="h-2.5 w-48 rounded bg-white/5 animate-pulse" />
								</div>
								<div className="h-5 w-14 rounded bg-white/5 animate-pulse" />
							</div>
						</div>
					))}
				</div>
			) : isError ? (
				<ErrorState
					message="Failed to load links."
					onRetry={() => void refetch()}
				/>
			) : !data?.links.length ? (
				<EmptyState
					title={
						statusFilter === "all"
							? "No links yet"
							: `No ${statusFilter} links`
					}
					description="Create a payment link to start receiving funds."
					icon={Link2}
					action={
						statusFilter === "all" ? (
							<Link
								to="/links/create"
								className="text-xs text-white/80 hover:text-white underline underline-offset-2"
							>
								Create your first link →
							</Link>
						) : undefined
					}
				/>
			) : (
				<>
					<div className="flex flex-col gap-3">
						{data.links.map((link) => {
							const claimUrl = `${appUrl}/claim/${link.link_token}`;
							const token = link.link_token;
							const expiringSoon =
								link.expiry_at && link.status === "active";

							return (
								<div
									key={link.link_id}
									className="rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] p-4 flex flex-col gap-3 hover:border-white/20 transition-colors"
								>
									<Link
										to={`/links/${token}`}
										className="flex items-start gap-3 group"
									>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 flex-wrap">
												<span className="text-sm font-semibold text-white">
													{formatLinkAmount(
														link.amount,
														link.mint,
													)}{" "}
													{mintToSymbol(link.mint)}
												</span>
												<StatusBadge
													status={link.status}
												/>
												{expiringSoon && (
													<span className="text-[10px] font-medium text-amber-400">
														Expires{" "}
														{timeAgo(
															link.expiry_at,
														)}
													</span>
												)}
											</div>
											{link.note && (
												<p className="text-xs text-[hsl(215_20%_55%)] mt-0.5 truncate">
													&ldquo;{link.note}&rdquo;
												</p>
											)}
										</div>
										<ChevronRight
											size={14}
											className="text-[hsl(215_20%_35%)] group-hover:text-white transition-colors mt-0.5 shrink-0"
										/>
									</Link>
									{link.status === "active" && (
										<button
											onClick={() =>
												setCancelTarget(link)
											}
											className="p-1.5 rounded-lg text-[hsl(215_20%_55%)] hover:text-red-400 hover:bg-red-500/10 transition-colors self-start"
											aria-label="Cancel link"
										>
											<Trash2 size={14} />
										</button>
									)}

									<div className="flex items-center gap-2 bg-white/3 rounded-lg px-3 py-2">
										<span className="flex-1 text-[11px] font-mono text-[hsl(215_20%_55%)] truncate">
											{claimUrl}
										</span>
										<button
											onClick={() => void copyLink(token)}
											className="text-[hsl(215_20%_55%)] hover:text-white transition-colors"
											aria-label="Copy link"
										>
											<Copy size={13} />
										</button>
										<a
											href={claimUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-[hsl(215_20%_55%)] hover:text-white transition-colors"
											aria-label="Open claim page"
										>
											<ExternalLink size={13} />
										</a>
									</div>

									<div className="flex items-center justify-between text-[10px] text-[hsl(215_20%_55%)]">
										<span title={fullDate(link.created_at)}>
											Created {timeAgo(link.created_at)}
										</span>
										{link.claimed_at && (
											<span
												title={fullDate(
													link.claimed_at,
												)}
											>
												Claimed{" "}
												{timeAgo(link.claimed_at)}
											</span>
										)}
										{link.claimer_wallet && (
											<span className="font-mono">
												by{" "}
												{link.claimer_wallet.slice(
													0,
													6,
												)}
												…
											</span>
										)}
									</div>
								</div>
							);
						})}
					</div>
					<Pagination
						page={data.pagination.page}
						totalPages={data.pagination.total_pages}
						hasNext={data.pagination.has_next}
						hasPrev={data.pagination.has_prev}
						onPageChange={(p) => {
							setPage(p);
							window.scrollTo({ top: 0, behavior: "smooth" });
						}}
					/>
				</>
			)}

			{cancelTarget && (
				<ConfirmCancelDialog
					link={cancelTarget}
					onConfirm={() => void handleCancel()}
					onCancel={() => setCancelTarget(null)}
					loading={cancelling}
				/>
			)}
		</div>
	);
}
