import { cn } from "@/lib/utils";
import type { LinkStatus } from "@/types/link";
import type { TransactionStatus } from "@/types/wallet";
import type { SwapStatus } from "@/types/swap";

type BadgeVariant = LinkStatus | TransactionStatus | SwapStatus;

const variantStyles: Record<string, string> = {
	active: "bg-green-500/15 text-green-400 border-green-500/20",
	claimed: "bg-blue-500/15 text-blue-400 border-blue-500/20",
	cancelled: "bg-red-500/15 text-red-400 border-red-500/20",
	expired:
		"bg-[hsl(215_20%_55%)]/15 text-[hsl(215_20%_55%)] border-[hsl(215_20%_55%)]/20",
	all: "bg-white/10 text-white/60 border-white/10",
	pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
	confirmed: "bg-green-500/15 text-green-400 border-green-500/20",
	failed: "bg-red-500/15 text-red-400 border-red-500/20",
};

interface StatusBadgeProps {
	status: BadgeVariant;
	className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide border",
				variantStyles[status] ?? variantStyles.pending,
				className,
			)}
		>
			{status}
		</span>
	);
}
