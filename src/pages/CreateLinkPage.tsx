import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Link2, ChevronLeft, Check, Share2 } from "lucide-react";
import { createLinkSchema, type CreateLinkFormData } from "@/lib/validators";
import { useCreateLink } from "@/hooks/useCreateLink";
import { CopyButton } from "@/components/common/CopyButton";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import type { CreateLinkResponse } from "@/types/link";

const TOKEN_OPTIONS = [
	{ label: "SOL", value: "", description: "Solana" },
	{
		label: "USDC",
		value: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
		description: "USD Coin",
	},
	{
		label: "USDT",
		value: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
		description: "Tether USD",
	},
];

function SuccessSheet({
	result,
	onDone,
}: {
	result: CreateLinkResponse;
	onDone: () => void;
}) {
	const canShare = typeof navigator.share === "function";
	const appUrl =
		(import.meta.env.VITE_APP_URL as string | undefined) ??
		window.location.origin;
	const claimUrl = `${appUrl}/claim/${result.link_token}`;

	const share = async () => {
		try {
			await navigator.share({ title: "TipLink", url: claimUrl });
		} catch {
			// User cancelled or failed
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-2xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_5%)] p-6 flex flex-col gap-5 animate-[slideUp_0.25s_ease-out]">
				<div className="flex flex-col items-center gap-3 text-center">
					<div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center">
						<Check size={22} className="text-green-400" />
					</div>
					<div>
						<h3 className="text-base font-semibold text-white">
							Link Created!
						</h3>
						<p className="text-xs text-[hsl(215_20%_55%)] mt-1">
							Share this link to receive your funds
						</p>
					</div>
				</div>

				<div className="rounded-xl bg-white/5 border border-[hsl(216_34%_17%)] p-3">
					<p className="text-[10px] text-[hsl(215_20%_55%)] mb-1">
						Claim URL
					</p>
					<div className="flex items-center gap-2">
						<p className="flex-1 text-xs font-mono text-white truncate">
							{claimUrl}
						</p>
						<CopyButton text={claimUrl} label="Copy" />
					</div>
				</div>

				<div className="flex gap-3">
					{canShare && (
						<button
							onClick={() => void share()}
							className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[hsl(216_34%_17%)] py-2.5 text-sm text-[hsl(215_20%_55%)] hover:text-white hover:bg-white/5 transition-colors"
						>
							<Share2 size={14} />
							Share
						</button>
					)}
					<button
						onClick={onDone}
						className="flex-1 rounded-xl bg-white text-[hsl(222_47%_11%)] font-semibold py-2.5 text-sm hover:bg-white/90 transition-colors"
					>
						Done
					</button>
				</div>
			</div>
		</div>
	);
}

export function CreateLinkPage() {
	const navigate = useNavigate();
	const { mutateAsync: createLink, isPending } = useCreateLink();
	const [successResult, setSuccessResult] =
		useState<CreateLinkResponse | null>(null);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<CreateLinkFormData>({
		resolver: zodResolver(createLinkSchema),
		defaultValues: { amount: undefined, mint: "", note: "", expiry_at: "" },
	});

	const selectedMint = watch("mint");
	const noteValue = watch("note") ?? "";

	const getDecimals = (mint: string | undefined) => {
		if (!mint) return 9; // SOL
		if (
			mint === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" || // USDC
			mint === "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" // USDT
		)
			return 6;
		return 9;
	};

	const onSubmit = async (data: CreateLinkFormData) => {
		try {
			const decimals = getDecimals(data.mint);
			const amountInSmallestUnit = Math.round(
				data.amount * Math.pow(10, decimals),
			);
			const expiry_at = data.expiry_at
				? new Date(data.expiry_at).toISOString()
				: undefined;

			const result = await createLink({
				amount: amountInSmallestUnit,
				mint: data.mint || undefined,
				note: data.note || undefined,
				expiry_at,
			});
			setSuccessResult(result);
		} catch (err) {
			const msg =
				err instanceof Error ? err.message : "Failed to create link";
			toast.error(msg);
		}
	};

	return (
		<div className="flex flex-col gap-6 max-w-lg">
			{/* Header */}
			<div className="flex items-center gap-3">
				<button
					onClick={() => void navigate(-1)}
					className="p-1.5 rounded-lg hover:bg-white/5 text-[hsl(215_20%_55%)] hover:text-white transition-colors"
				>
					<ChevronLeft size={18} />
				</button>
				<div>
					<h1 className="text-xl font-semibold text-white">
						Create Link
					</h1>
					<p className="text-xs text-[hsl(215_20%_55%)] mt-0.5">
						Generate a claimable payment link
					</p>
				</div>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-5"
			>
				{/* Token selector */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-[hsl(215_20%_55%)] uppercase tracking-wide">
						Token
					</label>
					<div className="flex gap-2">
						{TOKEN_OPTIONS.map((opt) => (
							<button
								key={opt.value}
								type="button"
								onClick={() => setValue("mint", opt.value)}
								className={`flex-1 flex flex-col items-center rounded-xl border py-3 text-center transition-colors ${
									selectedMint === opt.value
										? "border-white/30 bg-white/10 text-white"
										: "border-[hsl(216_34%_17%)] text-[hsl(215_20%_55%)] hover:border-white/20 hover:text-white"
								}`}
							>
								<span className="text-sm font-semibold">
									{opt.label}
								</span>
								<span className="text-[10px] mt-0.5 opacity-60">
									{opt.description}
								</span>
							</button>
						))}
					</div>
				</div>

				{/* Amount */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-[hsl(215_20%_55%)] uppercase tracking-wide">
						Amount
					</label>
					<div className="relative">
						<input
							{...register("amount", { valueAsNumber: true })}
							type="number"
							step="any"
							min="0"
							placeholder="0.00"
							className="w-full bg-[hsl(224_71%_6%)] border border-[hsl(216_34%_17%)] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[hsl(215_20%_55%)]/50 focus:outline-none focus:border-white/30 pr-16 transition-colors"
						/>
						<span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[hsl(215_20%_55%)] font-medium">
							{TOKEN_OPTIONS.find((o) => o.value === selectedMint)
								?.label ?? "SOL"}
						</span>
					</div>
					{errors.amount && (
						<p className="text-xs text-red-400">
							{errors.amount.message}
						</p>
					)}
				</div>

				{/* Note */}
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center justify-between">
						<label className="text-xs font-medium text-[hsl(215_20%_55%)] uppercase tracking-wide">
							Note{" "}
							<span className="lowercase text-[hsl(215_20%_55%)]/60">
								(optional)
							</span>
						</label>
						<span className="text-[10px] text-[hsl(215_20%_55%)]">
							{noteValue.length}/200
						</span>
					</div>
					<input
						{...register("note")}
						type="text"
						placeholder="e.g. coffee money, rent split…"
						maxLength={200}
						className="w-full bg-[hsl(224_71%_6%)] border border-[hsl(216_34%_17%)] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[hsl(215_20%_55%)]/50 focus:outline-none focus:border-white/30 transition-colors"
					/>
					{errors.note && (
						<p className="text-xs text-red-400">
							{errors.note.message}
						</p>
					)}
				</div>

				{/* Expiry */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-[hsl(215_20%_55%)] uppercase tracking-wide">
						Expiry{" "}
						<span className="lowercase text-[hsl(215_20%_55%)]/60">
							(optional)
						</span>
					</label>
					<input
						{...register("expiry_at")}
						type="datetime-local"
						className="w-full bg-[hsl(224_71%_6%)] border border-[hsl(216_34%_17%)] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors scheme-dark"
					/>
				</div>

				{/* Submit */}
				<button
					type="submit"
					disabled={isPending}
					className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-[hsl(222_47%_11%)] font-semibold py-3 text-sm hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
				>
					{isPending ? (
						<>
							<LoadingSpinner size="sm" />
							Creating…
						</>
					) : (
						<>
							<Link2 size={16} />
							Create Link
						</>
					)}
				</button>
			</form>

			{successResult && (
				<SuccessSheet
					result={successResult}
					onDone={() => void navigate("/links")}
				/>
			)}
		</div>
	);
}
