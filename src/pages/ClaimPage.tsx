import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
	CheckCircle2,
	XCircle,
	Clock,
	Ban,
	Wallet,
	ExternalLink,
} from "lucide-react";
import { lookupLink, claimLink } from "@/api/link";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
	mintToSymbol,
	isValidSolanaAddress,
	formatLinkAmount,
} from "@/lib/utils";
import type { LinkInfoResponse } from "@/types/link";

const claimSchema = z.object({
	claimer_wallet: z
		.string()
		.min(1, "Wallet address is required")
		.refine(isValidSolanaAddress, "Invalid Solana wallet address"),
});
type ClaimForm = z.infer<typeof claimSchema>;

function StatusScreen({
	status,
	amount,
	mint,
}: {
	status: "claimed" | "cancelled" | "expired";
	amount: number;
	mint: string;
}) {
	const config = {
		claimed: {
			icon: <CheckCircle2 size={40} className="text-emerald-400" />,
			title: "Link Already Claimed",
			message: `This link for ${formatLinkAmount(amount, mint)} ${mintToSymbol(mint)} has already been claimed.`,
		},
		cancelled: {
			icon: <Ban size={40} className="text-red-400" />,
			title: "Link Cancelled",
			message: "This payment link has been cancelled by the sender.",
		},
		expired: {
			icon: <Clock size={40} className="text-amber-400" />,
			title: "Link Expired",
			message:
				"This payment link has expired and is no longer claimable.",
		},
	};
	const c = config[status];
	return (
		<div className="flex flex-col items-center text-center gap-3 py-8">
			{c.icon}
			<h2 className="text-lg font-semibold text-white">{c.title}</h2>
			<p className="text-sm text-[hsl(215_20%_55%)] max-w-xs leading-relaxed">
				{c.message}
			</p>
		</div>
	);
}

function SuccessScreen({ amount, mint }: { amount: number; mint: string }) {
	return (
		<div className="flex flex-col items-center text-center gap-4 py-8">
			<div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
				<CheckCircle2 size={32} className="text-emerald-400" />
			</div>
			<div>
				<h2 className="text-2xl font-bold text-white">
					+{formatLinkAmount(amount, mint)}{" "}
					<span className="text-base text-[hsl(215_20%_65%)]">
						{mintToSymbol(mint)}
					</span>
				</h2>
				<p className="text-sm text-[hsl(215_20%_55%)] mt-1">
					Successfully received!
				</p>
			</div>
			<p className="text-xs text-[hsl(215_20%_55%)] max-w-xs leading-relaxed">
				The tokens have been sent to your wallet. Check your Solana
				wallet to confirm.
			</p>
		</div>
	);
}

export function ClaimPage() {
	const { token } = useParams<{ token: string }>();
	const [linkInfo, setLinkInfo] = useState<LinkInfoResponse | null>(null);
	const [fetching, setFetching] = useState(true);
	const [fetchError, setFetchError] = useState(false);
	const [claimed, setClaimed] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const fetchedRef = useRef(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ClaimForm>({ resolver: zodResolver(claimSchema) });

	useEffect(() => {
		if (!token || fetchedRef.current) return;
		fetchedRef.current = true;
		lookupLink(token)
			.then((data) => setLinkInfo(data))
			.catch(() => setFetchError(true))
			.finally(() => setFetching(false));
	}, [token]);

	const onSubmit = async (values: ClaimForm) => {
		if (!token) return;
		setSubmitting(true);
		try {
			await claimLink(token, { claimer_wallet: values.claimer_wallet });
			setClaimed(true);
		} catch (err: unknown) {
			const msg =
				(err as { response?: { data?: { message?: string } } })
					?.response?.data?.message ??
				"Failed to claim. Please try again.";
			toast.error(msg);
		} finally {
			setSubmitting(false);
		}
	};

	const nonActiveStatus =
		linkInfo?.status && linkInfo.status !== "active"
			? (linkInfo.status as "claimed" | "cancelled" | "expired")
			: null;

	return (
		<div className="min-h-screen bg-[hsl(224_71%_4%)] flex flex-col">
			{/* Minimal nav */}
			<header className="border-b border-[hsl(216_34%_17%)] px-4 sm:px-6 py-3 flex items-center justify-between">
				<Link
					to="/"
					className="text-base font-bold text-white tracking-tight"
				>
					TipLink
				</Link>
				<a
					href="/"
					className="text-xs text-[hsl(215_20%_55%)] hover:text-white transition-colors"
				>
					Get started →
				</a>
			</header>

			<main className="flex-1 flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					<div className="rounded-2xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] overflow-hidden">
						<div className="p-6 border-b border-[hsl(216_34%_17%)]">
							<h1 className="text-lg font-semibold text-white">
								Claim Payment
							</h1>
							<p className="text-xs text-[hsl(215_20%_55%)] mt-0.5">
								Enter your Solana wallet to receive funds
							</p>
						</div>

						<div className="p-6">
							{fetching ? (
								<div className="flex justify-center py-8">
									<LoadingSpinner size="lg" />
								</div>
							) : fetchError || !linkInfo ? (
								<div className="flex flex-col items-center text-center gap-3 py-8">
									<XCircle
										size={40}
										className="text-red-400"
									/>
									<h2 className="text-lg font-semibold text-white">
										Link Not Found
									</h2>
									<p className="text-sm text-[hsl(215_20%_55%)]">
										This link doesn&apos;t exist or has been
										removed.
									</p>
								</div>
							) : claimed ? (
								<SuccessScreen
									amount={linkInfo.amount}
									mint={linkInfo.mint ?? ""}
								/>
							) : nonActiveStatus ? (
								<StatusScreen
									status={nonActiveStatus}
									amount={linkInfo.amount}
									mint={linkInfo.mint ?? ""}
								/>
							) : (
								<>
									{/* Link preview */}
									<div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-white/4 border border-[hsl(216_34%_17%)]">
										<div>
											<p className="text-2xl font-bold text-white">
												{formatLinkAmount(
													linkInfo.amount,
													linkInfo.mint,
												)}{" "}
												<span className="text-base text-[hsl(215_20%_65%)]">
													{mintToSymbol(
														linkInfo.mint,
													)}
												</span>
											</p>
											{linkInfo.note && (
												<p className="text-xs text-[hsl(215_20%_55%)] mt-1 italic">
													&ldquo;{linkInfo.note}
													&rdquo;
												</p>
											)}
										</div>
										<StatusBadge status={linkInfo.status} />
									</div>

									{/* Claim form */}
									<form
										onSubmit={(e) =>
											void handleSubmit(onSubmit)(e)
										}
										className="flex flex-col gap-4"
									>
										<div>
											<label className="block text-xs font-medium text-[hsl(215_20%_65%)] mb-1.5">
												Your Solana Wallet Address
											</label>
											<div className="relative">
												<Wallet
													size={14}
													className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(215_20%_45%)]"
												/>
												<input
													{...register(
														"claimer_wallet",
													)}
													placeholder="Enter your wallet address"
													className="w-full bg-white/4 border border-[hsl(216_34%_17%)] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-[hsl(215_20%_35%)] focus:outline-none focus:border-white/30 font-mono"
													autoComplete="off"
													spellCheck={false}
												/>
											</div>
											{errors.claimer_wallet && (
												<p className="text-xs text-red-400 mt-1">
													{
														errors.claimer_wallet
															.message
													}
												</p>
											)}
										</div>

										<button
											type="submit"
											disabled={submitting}
											className="w-full py-3 rounded-xl bg-white text-[hsl(222_47%_11%)] font-semibold text-sm hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
										>
											{submitting && (
												<LoadingSpinner size="sm" />
											)}
											{submitting
												? "Claiming…"
												: "Claim Tokens"}
										</button>
									</form>

									{linkInfo.expiry_at && (
										<p className="text-[11px] text-[hsl(215_20%_45%)] text-center mt-4">
											<Clock
												size={11}
												className="inline mr-1"
											/>
											Expires{" "}
											{new Date(
												linkInfo.expiry_at,
											).toLocaleDateString(undefined, {
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</p>
									)}
								</>
							)}
						</div>
					</div>

					<p className="text-center text-[11px] text-[hsl(215_20%_40%)] mt-4">
						Powered by{" "}
						<a
							href="https://solana.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-white inline-flex items-center gap-0.5"
						>
							Solana <ExternalLink size={10} />
						</a>
					</p>
				</div>
			</main>
		</div>
	);
}
