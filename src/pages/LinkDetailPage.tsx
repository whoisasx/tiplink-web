import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useLookupLink, useCancelLink } from "@/hooks/useLinks";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { CopyButton } from "@/components/common/CopyButton";
import { timeAgo, mintToSymbol } from "@/lib/utils";

export function LinkDetailPage() {
	const { token } = useParams<{ token: string }>();
	const { data: link, isLoading, isError } = useLookupLink(token);
	const { mutateAsync: cancelLink, isPending: cancelling } = useCancelLink();
	const [confirming, setConfirming] = useState(false);

	const appUrl =
		(import.meta.env.VITE_APP_URL as string | undefined) ??
		window.location.origin;
	const claimUrl = token ? `${appUrl}/claim/${token}` : "";

	const handleCancel = async () => {
		if (!token) return;
		try {
			await cancelLink(token);
			toast.success("Link cancelled");
			setConfirming(false);
		} catch {
			toast.error("Failed to cancel link");
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-3">
				<Link
					to="/links"
					className="p-2 rounded-lg text-[hsl(215_20%_55%)] hover:text-white hover:bg-white/5 transition-colors"
				>
					<ArrowLeft size={16} />
				</Link>
				<div>
					<h1 className="text-xl font-semibold text-white">
						Link Details
					</h1>
					<p className="text-xs text-[hsl(215_20%_55%)] mt-0.5">
						View payment link info
					</p>
				</div>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-16">
					<LoadingSpinner size="lg" />
				</div>
			) : isError || !link ? (
				<ErrorState message="Link not found or failed to load." />
			) : (
				<div className="flex flex-col gap-4">
					{/* Main card */}
					<div className="rounded-2xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] p-6 flex flex-col gap-5">
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="text-3xl font-bold text-white">
									{link.amount / 1e9}{" "}
									<span className="text-xl text-[hsl(215_20%_65%)]">
										{mintToSymbol(link.mint)}
									</span>
								</p>
								{link.note && (
									<p className="text-sm text-[hsl(215_20%_55%)] mt-1 italic">
										&ldquo;{link.note}&rdquo;
									</p>
								)}
							</div>
							<StatusBadge status={link.status} />
						</div>

						{/* Claim URL */}
						{link.status === "active" && (
							<div>
								<p className="text-xs font-medium text-[hsl(215_20%_55%)] mb-1.5">
									Claim URL
								</p>
								<div className="flex items-center gap-2 bg-white/4 rounded-xl px-3 py-2.5 border border-[hsl(216_34%_17%)]">
									<span className="flex-1 font-mono text-xs text-white truncate">
										{claimUrl}
									</span>
									<CopyButton text={claimUrl} />
								</div>
							</div>
						)}

						{/* Details grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<DetailRow
								label="Created"
								value={new Date(
									link.created_at,
								).toLocaleDateString()}
								sub={timeAgo(link.created_at)}
							/>
							{link.expiry_at && (
								<DetailRow
									label="Expires"
									value={new Date(
										link.expiry_at,
									).toLocaleDateString()}
									sub={
										link.status === "active"
											? timeAgo(link.expiry_at)
											: undefined
									}
								/>
							)}
						</div>
					</div>

					{/* Cancel section */}
					{link.status === "active" && !confirming && (
						<button
							onClick={() => setConfirming(true)}
							className="w-full py-3 rounded-xl border border-red-500/30 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
						>
							<AlertTriangle size={14} />
							Cancel this link
						</button>
					)}

					{confirming && (
						<div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4 flex flex-col gap-3">
							<p className="text-sm text-white font-medium">
								Are you sure you want to cancel?
							</p>
							<p className="text-xs text-[hsl(215_20%_55%)] leading-relaxed">
								The {link.amount / 1e9}{" "}
								{mintToSymbol(link.mint)} will be returned to
								your wallet. This cannot be undone.
							</p>
							<div className="flex gap-2">
								<button
									onClick={() => setConfirming(false)}
									disabled={cancelling}
									className="flex-1 py-2.5 rounded-xl border border-[hsl(216_34%_17%)] text-sm text-[hsl(215_20%_55%)] hover:text-white transition-colors"
								>
									Keep it
								</button>
								<button
									onClick={() => void handleCancel()}
									disabled={cancelling}
									className="flex-1 py-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
								>
									{cancelling ? (
										<LoadingSpinner size="sm" />
									) : null}
									Yes, cancel
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function DetailRow({
	label,
	value,
	sub,
}: {
	label: string;
	value: string;
	sub?: string;
}) {
	return (
		<div className="rounded-xl bg-white/3 border border-[hsl(216_34%_17%)] p-3">
			<p className="text-[10px] font-medium text-[hsl(215_20%_45%)] uppercase tracking-wider mb-1">
				{label}
			</p>
			<p className="text-sm text-white">{value}</p>
			{sub && (
				<p className="text-[11px] text-[hsl(215_20%_55%)] mt-0.5">
					{sub}
				</p>
			)}
		</div>
	);
}
