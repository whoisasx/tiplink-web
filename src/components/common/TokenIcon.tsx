import { mintToSymbol } from "@/lib/utils";

interface TokenIconProps {
	mint?: string | null;
	symbol?: string;
	size?: number;
	className?: string;
}

const symbolColors: Record<string, string> = {
	SOL: "from-purple-500 to-violet-600",
	USDC: "from-blue-500 to-blue-600",
	USDT: "from-green-500 to-emerald-600",
};

export function TokenIcon({
	mint,
	symbol,
	size = 32,
	className,
}: TokenIconProps) {
	const sym = symbol ?? mintToSymbol(mint ?? "");
	const gradient = symbolColors[sym] ?? "from-gray-500 to-gray-600";

	return (
		<div
			className={`rounded-full bg-linear-to-br ${gradient} flex items-center justify-center shrink-0 ${className ?? ""}`}
			style={{ width: size, height: size }}
			aria-label={sym}
		>
			<span
				className="text-white font-bold"
				style={{ fontSize: size * 0.34 }}
			>
				{sym.slice(0, 2)}
			</span>
		</div>
	);
}
