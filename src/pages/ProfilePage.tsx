import { useAuthStore } from "@/store/auth.store";
import { useUser } from "@/hooks/useUser";
import { AddressDisplay } from "@/components/common/AddressDisplay";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { LogOut, User } from "lucide-react";

export function ProfilePage() {
	const { logout } = useAuthStore();
	const { data: user, isLoading } = useUser();

	const handleLogout = () => void logout();

	return (
		<div className="flex flex-col gap-6 max-w-md">
			<div>
				<h1 className="text-xl font-semibold text-white">Profile</h1>
				<p className="text-xs text-[hsl(215_20%_55%)] mt-1">
					Your account details
				</p>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-16">
					<LoadingSpinner size="lg" />
				</div>
			) : (
				<div className="flex flex-col gap-4">
					{/* Identity card */}
					<div className="rounded-2xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] p-6 flex flex-col gap-5">
						<div className="flex items-center gap-4">
							{user?.avatar_url ? (
								<img
									src={user.avatar_url}
									alt={user.name ?? user.email}
									referrerPolicy="no-referrer"
									className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
								/>
							) : (
								<div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
									<User
										size={24}
										className="text-[hsl(215_20%_55%)]"
									/>
								</div>
							)}
							<div className="min-w-0">
								<p className="text-base font-semibold text-white truncate">
									{user?.name ?? "Unknown"}
								</p>
								<p className="text-xs text-[hsl(215_20%_55%)] truncate">
									{user?.email}
								</p>
							</div>
						</div>

						<div className="h-px bg-[hsl(216_34%_17%)]" />

						{/* Wallet address */}
						<div>
							<p className="text-xs font-medium text-[hsl(215_20%_45%)] uppercase tracking-wider mb-2">
								Wallet Address
							</p>
							{user?.wallet ? (
								<AddressDisplay
									address={user.wallet}
									showSolscan
								/>
							) : (
								<p className="text-sm text-[hsl(215_20%_55%)]">
									No wallet linked
								</p>
							)}
						</div>
					</div>

					{/* Logout */}
					<button
						onClick={handleLogout}
						className="w-full py-3 rounded-xl border border-red-500/30 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
					>
						<LogOut size={14} />
						Sign out
					</button>
				</div>
			)}
		</div>
	);
}
