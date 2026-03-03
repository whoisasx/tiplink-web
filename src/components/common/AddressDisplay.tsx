import { truncateAddress, solscanAddr } from "@/lib/utils";
import { CopyButton } from "./CopyButton";
import { ExternalLink } from "lucide-react";

interface AddressDisplayProps {
	address: string;
	chars?: number;
	showSolscan?: boolean;
	className?: string;
}

export function AddressDisplay({
	address,
	chars = 4,
	showSolscan = false,
	className,
}: AddressDisplayProps) {
	return (
		<span
			className={`inline-flex items-center gap-1.5 font-mono text-xs text-white/80 ${className ?? ""}`}
		>
			<span title={address}>{truncateAddress(address, chars)}</span>
			<CopyButton text={address} />
			{showSolscan && (
				<a
					href={solscanAddr(address)}
					target="_blank"
					rel="noopener noreferrer"
					className="text-[hsl(215_20%_55%)] hover:text-white transition-colors"
					aria-label="View on Solscan"
				>
					<ExternalLink size={11} />
				</a>
			)}
		</span>
	);
}
