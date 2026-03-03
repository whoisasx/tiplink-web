import { Link, useLocation } from "react-router-dom";
import {
	Menu,
	LayoutDashboard,
	Wallet,
	Link2,
	ArrowLeftRight,
	User,
	LogOut,
} from "lucide-react";
import { useState } from "react";
import { cn, truncateAddress } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

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
	const location = useLocation();
	const { user, logout } = useAuthStore();

	return (
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

			{/* User avatar */}
			{user && (
				<div className="flex items-center gap-2 ml-auto">
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
							<Link2 size={16} className="text-white" />
							<span className="font-semibold text-white text-lg">
								TipLink
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
								<p className="text-xs text-[hsl(215_20%_55%)] font-mono px-3 py-2">
									{truncateAddress(user.wallet)}
								</p>
							)}
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
	);
}
