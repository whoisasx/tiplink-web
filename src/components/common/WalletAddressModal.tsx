import { useState } from "react";
import { Copy, Check, ExternalLink, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface WalletAddressModalProps {
	address: string;
	onClose: () => void;
}

export function WalletAddressModal({
	address,
	onClose,
}: WalletAddressModalProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(address);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			/* no-op */
		}
	};

	const truncated = address
		? `${address.slice(0, 4)}…${address.slice(-4)}`
		: "";

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			onClick={onClose}
		>
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

			{/* Panel */}
			<div
				className="relative z-10 w-full max-w-sm rounded-2xl bg-[hsl(224_71%_8%)] border border-[hsl(216_34%_17%)] p-6 text-center shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-[hsl(215_20%_55%)] hover:text-white transition-colors"
				>
					<X size={18} />
				</button>

				<h2 className="text-lg font-semibold text-white mb-1">
					Your Wallet Address
				</h2>
				<p className="text-xs text-[hsl(215_20%_55%)] mb-6 leading-relaxed">
					You can deposit crypto or NFTs into your account via this
					Solana wallet address:
				</p>

				{/* QR Code */}
				<div className="flex justify-center mb-6">
					<div className="p-3 bg-white rounded-2xl shadow-lg shadow-black/40">
						<QRCodeSVG
							value={address}
							size={170}
							level="H"
							bgColor="#ffffff"
							fgColor="#000000"
						/>
					</div>
				</div>

				{/* Address row */}
				<div className="flex items-center justify-between bg-[hsl(224_71%_4%)] border border-[hsl(216_34%_17%)] rounded-xl px-4 py-3 mb-2">
					<span className="text-sm font-mono text-white flex-1 text-left">
						{truncated}
					</span>
					<button
						onClick={() => void handleCopy()}
						className="ml-2 p-1.5 rounded-lg text-[hsl(215_20%_55%)] hover:text-white hover:bg-white/5 transition-colors"
						title="Copy full address"
					>
						{copied ? (
							<Check size={15} className="text-green-400" />
						) : (
							<Copy size={15} />
						)}
					</button>
				</div>

				<p className="text-[10px] text-[hsl(215_20%_55%)] mb-5 flex items-center justify-center gap-1">
					<span>⚠</span>
					Only send crypto to this address via the Solana network.
				</p>

				{/* Actions */}
				<div className="flex gap-3">
					<a
						href={`https://solscan.io/account/${address}`}
						target="_blank"
						rel="noopener noreferrer"
						className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[hsl(216_34%_17%)] text-sm text-[hsl(215_20%_55%)] hover:text-white hover:border-white/20 transition-colors"
					>
						<ExternalLink size={13} />
						View On SolScan
					</a>
					<button
						onClick={onClose}
						className="flex-1 px-4 py-2.5 rounded-xl bg-[#14F195] text-[#060810] text-sm font-semibold hover:bg-[#12d882] transition-colors active:scale-[0.97]"
					>
						Done
					</button>
				</div>
			</div>
		</div>
	);
}
