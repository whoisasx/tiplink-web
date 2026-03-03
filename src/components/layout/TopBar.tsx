import { Link, useLocation } from "react-router-dom";
import {
	Menu,
	LayoutDashboard,
	Wallet,
	Link2,
	ArrowLeftRight,
	User,
	LogOut,
	QrCode,
} from "lucide-react";
import { useState } from "react";
import { cn, truncateAddress } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { WalletAddressModal } from "@/components/common/WalletAddressModal";
import { WalletAdapterButton } from "@/components/wallet/WalletAdapterButton";

const navLinks = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/wallet", label: "Wallet", icon: Wallet },
	{ href: "/links", label: "Links", icon: Link2 },
	{ href: "/swap", label: "Swap", icon: ArrowLeftRight },
	{ href: "/profile", label: "Profile", icon: User },
];

interface TopBarProps {
	title?: string;
}

export function TopBar({ title }: TopBarProps) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [showWalletModal, setShowWalletModal] = useState(false);
	const location = useLocation();
	const { user, logout } = useAuthStore();

	return (
		<>
		<header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-14 bg-[hsl(224_71%_4%)]/80 backdrop-blur-sm border-b border-[hsl(216_34%_17%)]">
			{/* Mobile hamburger */}
			<button
				className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
				onClick={() => setMenuOpen((v) => !v)}
				aria-label="Open menu"
			>
				<Menu size={18} className="text-[hsl(215_20%_55%)]" />
			</button>

			{title && (
				<h1 className="hidden md:block text-sm font-semibold text-white">
					{title}
				</h1>
			)}

{/* Right side: adapter + user avatar */}
		{user && (
			<div className="flex items-center gap-2 ml-auto">
				<WalletAdapterButton variant="pill" className="hidden sm:flex" />
					{user.avatar_url ? (
						<img
							src={user.avatar_url}
							alt={user.name}
							className="w-7 h-7 rounded-full ring-1 ring-white/10"
						/>
					) : (
						<div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-white">
							{user.name?.[0]?.toUpperCase() ?? "?"}
						</div>
					)}
				</div>
			)}

			{/* Mobile drawer */}
			{menuOpen && (
				<div
					className="fixed inset-0 z-40 md:hidden"
					onClick={() => setMenuOpen(false)}
				>
					<div className="absolute inset-0 bg-black/60" />
					<nav
						className="absolute left-0 top-0 bottom-0 w-64 bg-[hsl(224_71%_5%)] border-r border-[hsl(216_34%_17%)] p-4 flex flex-col gap-1"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center gap-2 px-2 mb-6">
							<div className="w-7 h-7 rounded-lg bg-linear-to-br from-[#14F195] to-[#0ea572] flex items-center justify-center">
								<Link2
									size={13}
									className="text-[#060810]"
									strokeWidth={2.5}
								/>
							</div>
							<span className="font-bold text-white text-lg">
								DashLink
							</span>
						</div>
						{navLinks.map(({ href, label, icon: Icon }) => {
							const active = location.pathname.startsWith(href);
							return (
								<Link
									key={href}
									to={href}
									onClick={() => setMenuOpen(false)}
									className={cn(
										"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
										active
											? "bg-white/10 text-white"
											: "text-[hsl(215_20%_55%)] hover:text-white hover:bg-white/5",
									)}
								>
									<Icon size={16} />
									{label}
								</Link>
							);
						})}
						<div className="mt-auto pt-4 border-t border-[hsl(216_34%_17%)]">
							{user?.wallet && (
								<button
									onClick={() => {
										setShowWalletModal(true);
										setMenuOpen(false);
									}}
									className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors w-full group text-left"
								>
									<div className="flex-1 min-w-0">
										<p className="text-[10px] text-[hsl(215_20%_55%)] uppercase tracking-widest mb-0.5">
											Wallet
										</p>
										<p className="text-xs text-white font-mono truncate">
											{truncateAddress(user.wallet)}
										</p>
									</div>
									<QrCode size={13} className="text-[hsl(215_20%_55%)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
								</button>
							)}
							<div className="px-3 py-1">
								<WalletAdapterButton variant="card" />
							</div>
							<button
								onClick={() => {
									void logout();
									setMenuOpen(false);
								}}
								className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[hsl(215_20%_55%)] hover:text-white hover:bg-white/5 transition-colors w-full"
							>
								<LogOut size={16} />
								Sign out
							</button>
						</div>
					</nav>
				</div>
			)}
		</header>

		{showWalletModal && user?.wallet && (
			<WalletAddressModal
				address={user.wallet}
				onClose={() => setShowWalletModal(false)}
			/>
		)}
	</>
	);
}
