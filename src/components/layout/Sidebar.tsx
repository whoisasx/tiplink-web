import { Link, useLocation } from "react-router-dom";
import {
	LayoutDashboard,
	Wallet,
	Link2,
	ArrowLeftRight,
	User,
	LogOut,
	ChevronRight,
} from "lucide-react";
import { cn, truncateAddress } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

const navLinks = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/wallet", label: "Wallet", icon: Wallet },
	{ href: "/links", label: "Links", icon: Link2 },
	{ href: "/swap", label: "Swap", icon: ArrowLeftRight },
	{ href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
	const location = useLocation();
	const { user, logout } = useAuthStore();

	return (
		<aside className="hidden md:flex flex-col w-60 min-h-screen bg-[hsl(224_71%_6%)] border-r border-[hsl(216_34%_17%)] px-3 py-6 gap-1">
			{/* Logo */}
			<div className="flex items-center gap-2 px-3 mb-8">
				<div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#14F195] to-[#0ea572] flex items-center justify-center">
					<Link2
						size={14}
						className="text-[#060810]"
						strokeWidth={2.5}
					/>
				</div>
				<span className="font-bold text-white tracking-tight text-lg">
					DashLink
				</span>
			</div>

			{/* Nav */}
			<nav className="flex flex-col gap-0.5 flex-1">
				{navLinks.map(({ href, label, icon: Icon }) => {
					const active = location.pathname.startsWith(href);
					return (
						<Link
							key={href}
							to={href}
							className={cn(
								"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
								active
									? "bg-white/10 text-white"
									: "text-[hsl(215_20%_55%)] hover:text-white hover:bg-white/5",
							)}
						>
							<Icon size={16} />
							{label}
							{active && (
								<ChevronRight
									size={14}
									className="ml-auto opacity-40"
								/>
							)}
						</Link>
					);
				})}
			</nav>

			{/* Bottom: wallet address + logout */}
			<div className="mt-auto flex flex-col gap-2 pt-4 border-t border-[hsl(216_34%_17%)]">
				{user?.wallet && (
					<div className="px-3 py-2">
						<p className="text-[10px] text-[hsl(215_20%_55%)] uppercase tracking-widest mb-0.5">
							Wallet
						</p>
						<p className="text-xs text-white font-mono">
							{truncateAddress(user.wallet)}
						</p>
					</div>
				)}
				<button
					onClick={() => void logout()}
					className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[hsl(215_20%_55%)] hover:text-white hover:bg-white/5 transition-colors w-full"
				>
					<LogOut size={16} />
					Sign out
				</button>
			</div>
		</aside>
	);
}
