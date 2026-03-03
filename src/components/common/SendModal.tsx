import { useState } from "react";
import { X, PlusCircle, Send, Wallet, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { isValidSolanaAddress } from "@/lib/utils";

type View = "menu" | "address";

interface SendModalProps {
	onClose: () => void;
}

export function SendModal({ onClose }: SendModalProps) {
	const [view, setView] = useState<View>("menu");
	const [toAddress, setToAddress] = useState("");
	const [amount, setAmount] = useState("");
	const [token, setToken] = useState("SOL");
	const [addrError, setAddrError] = useState("");

	const navigate = useNavigate();
	const { connected, publicKey, disconnect } = useWallet();
	const { setVisible } = useWalletModal();

	const handleAddressSubmit = () => {
		if (!isValidSolanaAddress(toAddress)) {
			setAddrError("Invalid Solana address.");
			return;
		}
		if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
			setAddrError("Enter a valid amount.");
			return;
		}
		// TODO: wire up actual send-to-address call
		alert(`Send ${amount} ${token} to ${toAddress} — coming soon!`);
		onClose();
	};

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
				{/* Header */}
				<div className="flex items-center justify-between px-5 py-4 border-b border-[hsl(216_34%_17%)]">
					{view !== "menu" ? (
						<button
							onClick={() => {
								setView("menu");
								setAddrError("");
							}}
							className="text-[hsl(215_20%_55%)] hover:text-white transition-colors"
						>
							<ArrowLeft size={18} />
						</button>
					) : (
						<span />
					)}
					<h2 className="text-base font-semibold text-white">
						{view === "menu" ? "Send" : "Send to Address"}
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
									Generate a payment link anyone can claim
								</p>
							</div>
						</button>

						{/* To Address */}
						<button
							onClick={() => setView("address")}
							className="flex items-center gap-4 p-4 rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] hover:bg-white/5 transition-colors text-left w-full group"
						>
							<div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
								<Send size={18} className="text-blue-400" />
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

						{/* External Wallet (adapter) */}
						<button
							onClick={() => setVisible(true)}
							className="flex items-center gap-4 p-4 rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] hover:bg-white/5 transition-colors text-left w-full group"
						>
							<div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
								<Wallet size={18} className="text-purple-400" />
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
										{publicKey.toString().slice(0, 8)}…
										{publicKey.toString().slice(-4)}
									</p>
								) : (
									<p className="text-xs text-[hsl(215_20%_55%)] mt-0.5">
										Connect Phantom, Solflare &amp; more
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

				{/* ── Address form view ── */}
				{view === "address" && (
					<div className="p-5 flex flex-col gap-4">
						<div className="flex flex-col gap-1.5">
							<label className="text-xs text-[hsl(215_20%_55%)]">
								Recipient Address
							</label>
							<input
								type="text"
								value={toAddress}
								onChange={(e) => {
									setToAddress(e.target.value);
									setAddrError("");
								}}
								placeholder="Solana wallet address"
								className="w-full bg-[hsl(224_71%_4%)] border border-[hsl(216_34%_17%)] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[hsl(215_20%_35%)] font-mono focus:outline-none focus:border-[#14F195]/50 transition-colors"
							/>
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
							<p className="text-xs text-red-400 -mt-2">
								{addrError}
							</p>
						)}

						<button
							onClick={handleAddressSubmit}
							className="w-full py-3 rounded-xl bg-[#14F195] text-[#060810] text-sm font-semibold hover:bg-[#12d882] transition-colors active:scale-[0.97]"
						>
							Review Send
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
