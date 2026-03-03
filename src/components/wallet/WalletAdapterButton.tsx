import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet, ChevronDown, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface WalletAdapterButtonProps {
	/** visual variant – "pill" for navbar, "card" for sidebar  */
	variant?: "pill" | "card";
	className?: string;
}

export function WalletAdapterButton({
	variant = "pill",
	className,
}: WalletAdapterButtonProps) {
	const { connected, publicKey, disconnect, wallet } = useWallet();
	const { setVisible } = useWalletModal();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	// Close dropdown on outside click
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const truncated =
		connected && publicKey
			? `${publicKey.toString().slice(0, 4)}…${publicKey.toString().slice(-4)}`
			: null;

	if (variant === "pill") {
		return (
			<div className={cn("relative", className)} ref={ref}>
				{connected && publicKey ? (
					<>
						<button
							onClick={() => setOpen((v) => !v)}
							className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/8 border border-[hsl(216_34%_22%)] text-sm text-white hover:bg-white/12 transition-colors"
						>
							{wallet?.adapter.icon ? (
								<img
									src={wallet.adapter.icon}
									alt={wallet.adapter.name}
									className="w-4 h-4 rounded-sm"
								/>
							) : (
								<Wallet size={14} />
							)}
							<span className="font-mono text-xs">
								{truncated}
							</span>
							<ChevronDown
								size={12}
								className="text-[hsl(215_20%_55%)]"
							/>
						</button>
						{open && (
							<div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_8%)] shadow-xl py-1 z-50">
								<button
									onClick={() => {
										void disconnect();
										setOpen(false);
									}}
									className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-white/5 w-full transition-colors"
								>
									<LogOut size={14} />
									Disconnect
								</button>
							</div>
						)}
					</>
				) : (
					<button
						onClick={() => setVisible(true)}
						className={cn(
							"flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[hsl(216_34%_22%)] text-sm text-[hsl(215_20%_65%)] hover:text-white hover:border-white/20 hover:bg-white/5 transition-colors",
							className,
						)}
					>
						<Wallet size={14} />
						Connect Wallet
					</button>
				)}
			</div>
		);
	}

	/* — card variant (sidebar) — */
	return (
		<div className={cn("flex flex-col gap-1", className)}>
			<p className="text-[10px] text-[hsl(215_20%_55%)] uppercase tracking-widest px-3">
				External Wallet
			</p>
			{connected && publicKey ? (
				<div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5">
					<div className="flex items-center gap-2 min-w-0">
						{wallet?.adapter.icon ? (
							<img
								src={wallet.adapter.icon}
								alt={wallet.adapter.name}
								className="w-4 h-4 rounded-sm shrink-0"
							/>
						) : (
							<Wallet
								size={14}
								className="text-[hsl(215_20%_55%)] shrink-0"
							/>
						)}
						<span className="text-xs font-mono text-white truncate">
							{truncated}
						</span>
					</div>
					<button
						onClick={() => void disconnect()}
						className="text-[hsl(215_20%_55%)] hover:text-red-400 transition-colors ml-2 shrink-0"
						title="Disconnect"
					>
						<LogOut size={13} />
					</button>
				</div>
			) : (
				<button
					onClick={() => setVisible(true)}
					className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[hsl(215_20%_55%)] hover:text-white hover:bg-white/5 transition-colors w-full"
				>
					<Wallet size={15} />
					Connect Wallet
				</button>
			)}
		</div>
	);
}
