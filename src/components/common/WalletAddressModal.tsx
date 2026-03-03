import { useState } from "react";
import {
	Copy,
	Check,
	ExternalLink,
	X,
	Wallet,
	Loader2,
	CheckCircle2,
	ArrowDownLeft,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import {
	PublicKey,
	SystemProgram,
	Transaction,
	LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { toast } from "sonner";
import { solscanTx, truncateAddress } from "@/lib/utils";

type Tab = "deposit" | "from-wallet";

interface WalletAddressModalProps {
	address: string;
	onClose: () => void;
}

export function WalletAddressModal({
	address,
	onClose,
}: WalletAddressModalProps) {
	const [copied, setCopied] = useState(false);
	const [tab, setTab] = useState<Tab>("deposit");

	// Receive-from-wallet state
	const [receiveAmount, setReceiveAmount] = useState("");
	const [receiveError, setReceiveError] = useState("");
	const [receiveLoading, setReceiveLoading] = useState(false);
	const [receiveSig, setReceiveSig] = useState("");

	const { connection } = useConnection();
	const { connected, publicKey, sendTransaction } = useWallet();
	const { setVisible } = useWalletModal();

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(address);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			/* no-op */
		}
	};

	const handleReceiveFromWallet = async () => {
		const amt = parseFloat(receiveAmount);
		if (!receiveAmount || isNaN(amt) || amt <= 0) {
			setReceiveError("Enter a valid SOL amount.");
			return;
		}
		if (!publicKey) {
			setReceiveError("No wallet connected.");
			return;
		}

		setReceiveLoading(true);
		setReceiveError("");
		try {
			const lamports = Math.floor(amt * LAMPORTS_PER_SOL);
			const destination = new PublicKey(address);

			const { blockhash, lastValidBlockHeight } =
				await connection.getLatestBlockhash();

			const tx = new Transaction({
				recentBlockhash: blockhash,
				feePayer: publicKey,
			}).add(
				SystemProgram.transfer({
					fromPubkey: publicKey,
					toPubkey: destination,
					lamports,
				}),
			);

			const sig = await sendTransaction(tx, connection, {
				maxRetries: 3,
			});

			// Confirm
			await connection.confirmTransaction(
				{ signature: sig, blockhash, lastValidBlockHeight },
				"confirmed",
			);

			setReceiveSig(sig);
			toast.success("Transfer confirmed!");
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Transfer failed";
			setReceiveError(msg);
			toast.error(msg);
		} finally {
			setReceiveLoading(false);
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
				className="relative z-10 w-full max-w-sm rounded-2xl bg-[hsl(224_71%_8%)] border border-[hsl(216_34%_17%)] shadow-2xl overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-[hsl(215_20%_55%)] hover:text-white transition-colors z-10"
				>
					<X size={18} />
				</button>

				{/* Tab switcher */}
				<div className="flex border-b border-[hsl(216_34%_17%)]">
					<button
						onClick={() => setTab("deposit")}
						className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
							tab === "deposit"
								? "text-white border-b-2 border-[#14F195]"
								: "text-[hsl(215_20%_55%)] hover:text-white"
						}`}
					>
						Deposit Address
					</button>
					<button
						onClick={() => setTab("from-wallet")}
						className={`flex-1 py-3.5 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
							tab === "from-wallet"
								? "text-white border-b-2 border-[#14F195]"
								: "text-[hsl(215_20%_55%)] hover:text-white"
						}`}
					>
						<ArrowDownLeft size={13} />
						From Wallet
					</button>
				</div>

				{/* ── Deposit tab ── */}
				{tab === "deposit" && (
					<div className="p-6 text-center">
						<h2 className="text-lg font-semibold text-white mb-1">
							Your Wallet Address
						</h2>
						<p className="text-xs text-[hsl(215_20%_55%)] mb-6 leading-relaxed">
							Send crypto to this Solana address to fund your
							account:
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
									<Check
										size={15}
										className="text-green-400"
									/>
								) : (
									<Copy size={15} />
								)}
							</button>
						</div>

						<p className="text-[10px] text-[hsl(215_20%_55%)] mb-5 flex items-center justify-center gap-1">
							<span>⚠</span>
							Only send crypto via the Solana network.
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
				)}

				{/* ── From Wallet tab ── */}
				{tab === "from-wallet" && (
					<div className="p-6 flex flex-col gap-4">
						{receiveSig ? (
							/* ── Success state ── */
							<div className="flex flex-col items-center gap-4 text-center py-4">
								<div className="w-14 h-14 rounded-full bg-[#14F195]/10 flex items-center justify-center">
									<CheckCircle2
										size={32}
										className="text-[#14F195]"
									/>
								</div>
								<div>
									<h3 className="text-base font-semibold text-white mb-1">
										Transfer Confirmed
									</h3>
									<p className="text-xs text-[hsl(215_20%_55%)]">
										SOL has been sent to your platform
										wallet.
									</p>
								</div>
								<a
									href={solscanTx(receiveSig)}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-1.5 text-xs text-[#14F195] hover:underline"
								>
									View on Solscan <ExternalLink size={11} />
								</a>
								<button
									onClick={onClose}
									className="w-full py-2.5 rounded-xl bg-[#14F195] text-[#060810] text-sm font-semibold hover:bg-[#12d882] transition-colors"
								>
									Done
								</button>
							</div>
						) : !connected ? (
							/* ── Not connected ── */
							<div className="flex flex-col items-center gap-4 text-center py-4">
								<div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
									<Wallet
										size={24}
										className="text-purple-400"
									/>
								</div>
								<div>
									<h3 className="text-base font-semibold text-white mb-1">
										Connect Your Wallet
									</h3>
									<p className="text-xs text-[hsl(215_20%_55%)] leading-relaxed">
										Connect Phantom, Solflare, or another
										wallet to transfer SOL directly to your
										platform account.
									</p>
								</div>
								<button
									onClick={() => setVisible(true)}
									className="w-full py-2.5 rounded-xl bg-purple-500 text-white text-sm font-semibold hover:bg-purple-400 transition-colors"
								>
									Connect Wallet
								</button>
							</div>
						) : (
							/* ── Transfer form ── */
							<>
								<div>
									<h3 className="text-base font-semibold text-white mb-0.5">
										Transfer SOL to Platform
									</h3>
									<p className="text-xs text-[hsl(215_20%_55%)]">
										From{" "}
										<span className="text-white font-mono">
											{truncateAddress(
												publicKey?.toString() ?? "",
											)}
										</span>{" "}
										→ your DashLink wallet
									</p>
								</div>

								{/* Destination info */}
								<div className="bg-[hsl(224_71%_4%)] border border-[hsl(216_34%_17%)] rounded-xl px-4 py-3 flex items-center justify-between">
									<div>
										<p className="text-[10px] text-[hsl(215_20%_55%)] mb-0.5">
											Destination
										</p>
										<p className="text-xs font-mono text-white">
											{truncated}
										</p>
									</div>
									<button
										onClick={() => void handleCopy()}
										className="p-1.5 rounded-lg text-[hsl(215_20%_55%)] hover:text-white hover:bg-white/5 transition-colors"
									>
										{copied ? (
											<Check
												size={13}
												className="text-green-400"
											/>
										) : (
											<Copy size={13} />
										)}
									</button>
								</div>

								{/* Amount */}
								<div className="flex flex-col gap-1.5">
									<label className="text-xs text-[hsl(215_20%_55%)]">
										Amount (SOL)
									</label>
									<input
										type="number"
										min="0"
										step="any"
										value={receiveAmount}
										onChange={(e) => {
											setReceiveAmount(e.target.value);
											setReceiveError("");
										}}
										placeholder="0.00"
										className="w-full bg-[hsl(224_71%_4%)] border border-[hsl(216_34%_17%)] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[hsl(215_20%_35%)] focus:outline-none focus:border-[#14F195]/50 transition-colors"
									/>
								</div>

								{receiveError && (
									<p className="text-xs text-red-400 -mt-2">
										{receiveError}
									</p>
								)}

								<button
									onClick={() =>
										void handleReceiveFromWallet()
									}
									disabled={receiveLoading}
									className="w-full py-3 rounded-xl bg-[#14F195] text-[#060810] text-sm font-semibold hover:bg-[#12d882] transition-colors active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
								>
									{receiveLoading ? (
										<>
											<Loader2
												size={15}
												className="animate-spin"
											/>
											Confirming…
										</>
									) : (
										"Transfer Now"
									)}
								</button>

								<p className="text-[10px] text-[hsl(215_20%_55%)] text-center">
									Only SOL is supported for wallet transfers.
									For other tokens, use the deposit address
									above.
								</p>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
