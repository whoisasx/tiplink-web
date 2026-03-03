import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
	page: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
	onPageChange: (page: number) => void;
	className?: string;
}

export function Pagination({
	page,
	totalPages,
	hasNext,
	hasPrev,
	onPageChange,
	className,
}: PaginationProps) {
	if (totalPages <= 1) return null;

	return (
		<div
			className={cn(
				"flex items-center justify-between gap-2 pt-4",
				className,
			)}
		>
			<button
				disabled={!hasPrev}
				onClick={() => onPageChange(page - 1)}
				className="flex items-center gap-1 text-xs text-[hsl(215_20%_55%)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded hover:bg-white/5"
			>
				<ChevronLeft size={14} />
				Previous
			</button>
			<span className="text-xs text-[hsl(215_20%_55%)]">
				Page <span className="text-white font-medium">{page}</span> of{" "}
				<span className="text-white font-medium">{totalPages}</span>
			</span>
			<button
				disabled={!hasNext}
				onClick={() => onPageChange(page + 1)}
				className="flex items-center gap-1 text-xs text-[hsl(215_20%_55%)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded hover:bg-white/5"
			>
				Next
				<ChevronRight size={14} />
			</button>
		</div>
	);
}
