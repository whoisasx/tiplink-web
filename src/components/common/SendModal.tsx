import { useState } from "react";
import {
	X,
	PlusCircle,
	Send,
	Wallet,
	ArrowLeft,
	Check,
	Loader2,
	CheckCircle2,
	ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { isValidSolanaAddress, solscanTx, truncateAddress } from "@/lib/utils";
import { toast } from "sonner";
import { sendTransaction as apiSendTransaction } from "@/api/wallet";

type View = "menu" | "address" | "external-send" | "success";

interface SendModalProps {
	onClose: () => void;
}

export function SendModal({ onClose }: SendModalProps) {
	const [view, setView] = useState<View>("menu");
	const [toAddress, setToAddress] = useState("");
	const [amount, setAmount] = useState("");
	const [token, setToken] = useState("SOL");
	const [addrError, setAddrError] = useState("");
	const [loading, setLoading] = useState(false);
	const [successSig, setSuccessSig] = useState("");

	const navigate = useNavigate();
	const { connected, publicKey, disconnect } = useWallet();
	const { setVisible } = useWalletModal();

	const resetForm = () => {
		setToAddress("");
		setAmount("");
		setToken("SOL");
		setAddrError("");
	};

	const handleSend = async (to: string, amtStr: string, tkn: string) => {
		if (!isValidSolanaAddress(to)) {
			setAddrError("Invalid Solana address.");
			return;
		}
		const amtNum = parseFloat(amtStr);
		if (!amtStr || isNaN(amtNum) || amtNum <= 0) {
			setAddrError("Enter a valid amount.");
			return;
		}

		setLoading(true);
		setAddrError("");
		try {
			const mint = tkn === "SOL" ? undefined : tkn;
			const resp = await apiSendTransaction({ to, amount: amtNum, mint });
			setSuccessSig(resp.signature);
			setView("success");
			toast.success("Transaction submitted successfully!");
		} catch (err) {
			const msg =
				err instanceof Error ? err.message : "Transaction failed";
			setAddrError(msg);
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	};

	const handleExtWalletClick = () => {
		if (connected && publicKey) {
			// Pre-fill form with connected wallet address and go to send view
			setToAddress(publicKey.toString());
			setView("external-send");
		} else {
			// Open adapter modal; once connected they can re-click
			setVisible(true);
		}
	};

	/** Shared send form used for both "address" and "external-send" views */
	const renderSendForm = (titleHint: string, addressEditable: boolean) => (
		<div className="p-5 flex flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<label className="text-xs text-[hsl(215_20%_55%)]">
					Recipient Address
				</label>
				<input
					type="text"
					value={toAddress}
					readOnly={!addressEditable}
					onChange={(e) => {
						setToAddress(e.target.value);
						setAddrError("");
					}}
					placeholder="Solana wallet address"
					className={`w-full bg-[hsl(224_71%_4%)] border border-[hsl(216_34%_17%)] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[hsl(215_20%_35%)] font-mono focus:outline-none focus:border-[#14F195]/50 transition-colors ${!addressEditable ? "opacity-70 cursor-default select-all" : ""}`}
				/>
				{!addressEditable && (
					<p className="text-[10px] text-[hsl(215_20%_55%)]">
						{titleHint}
					</p>
				)}
			</div>

			<div className="flex gap-3">
				<div className="flex flex-col gap-1.5 flex-1">
					<label className="text-xs text-[hsl(215_20%_55%)]">
						Amount
					</label>
					<input
						type="number"
						min="0"
						step="any"
						value={amount}
						onChange={(e) => {
							setAmount(e.target.value);
							setAddrError("");
						}}
						placeholder="0.00"
						className="w-full bg-[hsl(224_71%_4%)] border border-[hsl(216_34%_17%)] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[hsl(215_20%_35%)] focus:outline-none focus:border-[#14F195]/50 transition-colors"
					/>
				</div>
				<div className="flex flex-col gap-1.5 w-28">
					<label className="text-xs text-[hsl(215_20%_55%)]">
						Token
					</label>
					<select
						value={token}
						onChange={(e) => setToken(e.target.value)}
						className="w-full bg-[hsl(224_71%_4%)] border border-[hsl(216_34%_17%)] rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#14F195]/50 transition-colors appearance-none"
					>
						<option value="SOL">SOL</option>
						<option value="USDC">USDC</option>
						<option value="USDT">USDT</option>
					</select>
				</div>
			</div>

			{addrError && (
				<p className="text-xs text-red-400 -mt-2">{addrError}</p>
			)}

			<button
				onClick={() => void handleSend(toAddress, amount, token)}
				disabled={loading}
				className="w-full py-3 rounded-xl bg-[#14F195] text-[#060810] text-sm font-semibold hover:bg-[#12d882] transition-colors active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
			>
				{loading ? (
					<>
						<Loader2 size={15} className="animate-spin" />
						Sending…
					</>
				) : (
					"Confirm Send"
				)}
			</button>
		</div>
	);

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
				{/* ── Success view ── */}
				{view === "success" ? (
					<div className="p-6 flex flex-col items-center gap-4 text-center">
						<div className="w-14 h-14 rounded-full bg-[#14F195]/10 flex items-center justify-center">
							<CheckCircle2
								size={32}
								className="text-[#14F195]"
							/>
						</div>
						<div>
							<h2 className="text-lg font-semibold text-white mb-1">
								Transaction Submitted
							</h2>
							<p className="text-xs text-[hsl(215_20%_55%)]">
								Your transaction is being processed on the
								Solana network.
							</p>
						</div>
						{successSig && (
							<a
								href={solscanTx(successSig)}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1.5 text-xs text-[#14F195] hover:underline"
							>
								View on Solscan <ExternalLink size={11} />
							</a>
						)}
						<button
							onClick={onClose}
							className="w-full py-3 rounded-xl bg-[#14F195] text-[#060810] text-sm font-semibold hover:bg-[#12d882] transition-colors"
						>
							Done
						</button>
					</div>
				) : (
					<>
						{/* Header */}
						<div className="flex items-center justify-between px-5 py-4 border-b border-[hsl(216_34%_17%)]">
							{view !== "menu" ? (
								<button
									onClick={() => {
										setView("menu");
										resetForm();
									}}
									className="text-[hsl(215_20%_55%)] hover:text-white transition-colors"
								>
									<ArrowLeft size={18} />
								</button>
							) : (
								<span />
							)}
							<h2 className="text-base font-semibold text-white">
								{view === "menu" && "Send"}
								{view === "address" && "Send to Address"}
								{view === "external-send" &&
									"Send to External Wallet"}
							</h2>
							<button
								onClick={onClose}
								className="text-[hsl(215_20%_55%)] hover:text-white transition-colors"
							>
								<X size={18} />
							</button>
						</div>

						{/* ── Menu view ── */}
						{view === "menu" && (
							<div className="p-4 flex flex-col gap-2">
								{/* Create Link */}
								<button
									onClick={() => {
										onClose();
										void navigate("/links/create");
									}}
									className="flex items-center gap-4 p-4 rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] hover:bg-white/5 transition-colors text-left w-full group"
								>
									<div className="w-10 h-10 rounded-xl bg-[#14F195]/10 flex items-center justify-center shrink-0 group-hover:bg-[#14F195]/20 transition-colors">
										<PlusCircle
											size={18}
											className="text-[#14F195]"
										/>
									</div>
									<div>
										<p className="text-sm font-medium text-white">
											Create Link
										</p>
										<p className="text-xs text-[hsl(215_20%_55%)] mt-0.5">
											Generate a payment link anyone can
											claim
										</p>
									</div>
								</button>

								{/* To Address */}
								<button
									onClick={() => setView("address")}
									className="flex items-center gap-4 p-4 rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] hover:bg-white/5 transition-colors text-left w-full group"
								>
									<div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
										<Send
											size={18}
											className="text-blue-400"
										/>
									</div>
									<div>
										<p className="text-sm font-medium text-white">
											Solana Address
										</p>
										<p className="text-xs text-[hsl(215_20%_55%)] mt-0.5">
											Send directly to any wallet address
										</p>
									</div>
								</button>

								{/* External Wallet */}
								<button
									onClick={handleExtWalletClick}
									className="flex items-center gap-4 p-4 rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] hover:bg-white/5 transition-colors text-left w-full group"
								>
									<div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
										<Wallet
											size={18}
											className="text-purple-400"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-white">
											External Wallet
										</p>
										{connected && publicKey ? (
											<p className="text-xs text-green-400 mt-0.5 font-mono truncate">
												<Check
													size={10}
													className="inline mr-1"
												/>
												Send to{" "}
												{truncateAddress(
													publicKey.toString(),
												)}
											</p>
										) : (
											<p className="text-xs text-[hsl(215_20%_55%)] mt-0.5">
												Connect Phantom, Solflare &amp;
												more
											</p>
										)}
									</div>
									{connected && (
										<button
											onClick={(e) => {
												e.stopPropagation();
												void disconnect();
											}}
											className="text-[10px] text-red-400 hover:text-red-300 underline shrink-0"
										>
											Disconnect
										</button>
									)}
								</button>
							</div>
						)}

						{/* ── Send to any address view ── */}
						{view === "address" && renderSendForm("", true)}

						{/* ── Send to connected external wallet view ── */}
						{view === "external-send" &&
							renderSendForm(
								`Sending to your connected wallet (${truncateAddress(publicKey?.toString() ?? "")})`,
								false,
							)}
					</>
				)}
			</div>
		</div>
	);
}
