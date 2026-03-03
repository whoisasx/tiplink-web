import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { getGoogleAuthUrl } from "@/api/auth";
import { useAuthStore } from "@/store/auth.store";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function LoginPage() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { status } = useAuthStore();

	// Already authenticated — redirect immediately
	useEffect(() => {
		if (status === "authenticated") {
			void navigate("/dashboard", { replace: true });
		}
	}, [status, navigate]);

	const handleSignIn = async () => {
		setLoading(true);
		try {
			const url = await getGoogleAuthUrl();
			window.location.href = url;
		} catch {
			toast.error("Failed to start sign-in. Please try again.");
			setLoading(false);
		}
	};

	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center px-4">
			{/* Background subtle gradient */}
			<div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent pointer-events-none" />

			<div className="relative z-10 flex flex-col items-center gap-8 max-w-sm w-full">
				{/* Logo mark */}
				<div className="flex flex-col items-center gap-4">
					<div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shadow-xl">
						<Link2 size={24} className="text-white" />
					</div>
					<div className="text-center">
						<h1 className="text-2xl font-bold text-white tracking-tight">
							TipLink
						</h1>
						<p className="text-sm text-[hsl(215_20%_55%)] mt-1">
							The simplest way to send crypto
						</p>
					</div>
				</div>

				{/* Card */}
				<div className="w-full rounded-2xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] p-8 flex flex-col gap-6">
					<div className="text-center">
						<h2 className="text-base font-semibold text-white">
							Welcome back
						</h2>
						<p className="text-xs text-[hsl(215_20%_55%)] mt-1">
							Sign in to manage your wallet and payment links
						</p>
					</div>

					<button
						onClick={() => void handleSignIn()}
						disabled={loading}
						className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-[hsl(222_47%_11%)] font-semibold text-sm hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
					>
						{loading ? (
							<LoadingSpinner size="sm" />
						) : (
							<svg
								width="18"
								height="18"
								viewBox="0 0 18 18"
								fill="none"
							>
								<path
									d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
									fill="#4285F4"
								/>
								<path
									d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
									fill="#34A853"
								/>
								<path
									d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
									fill="#FBBC05"
								/>
								<path
									d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
									fill="#EA4335"
								/>
							</svg>
						)}
						{loading ? "Redirecting…" : "Continue with Google"}
					</button>

					<p className="text-center text-[10px] text-[hsl(215_20%_55%)] leading-relaxed">
						No wallet needed. Your wallet is secured by MPC
						technology — you own the keys.
					</p>
				</div>
			</div>
		</div>
	);
}
