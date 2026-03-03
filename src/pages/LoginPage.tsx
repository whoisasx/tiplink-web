import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Link2, Check, Zap, Shield, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getGoogleAuthUrl } from "@/api/auth";
import { useAuthStore } from "@/store/auth.store";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const GoogleIcon = () => (
	<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
		<path
			d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.258h2.908C17.657 14.14 17.64 9.2 17.64 9.2z"
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
);

export function LoginPage() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { status } = useAuthStore();

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
			<div className="min-h-screen bg-[#060810] flex items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#060810] text-white flex flex-col overflow-hidden">
			{/* ── Ambient glow layers ─────────────────────────── */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute top-[-15%] left-[-5%] w-150 h-150 rounded-full bg-[#14F195]/4 blur-[120px]" />
				<div className="absolute bottom-[-10%] right-[-5%] w-125 h-125 rounded-full bg-[#9945FF]/4 blur-[120px]" />
				<div className="absolute top-[50%] left-[40%] w-100 h-100 rounded-full bg-[#14F195]/3 blur-[100px]" />
			</div>

			{/* ── Navbar ──────────────────────────────────────── */}
			<header className="relative z-20 border-b border-white/6 bg-[#060810]/80 backdrop-blur-xl">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<Link to="/" className="flex items-center gap-2.5">
						<div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#14F195] to-[#0ea572] flex items-center justify-center shadow-lg shadow-[#14F195]/20">
							<Link2
								size={15}
								className="text-[#060810]"
								strokeWidth={2.5}
							/>
						</div>
						<span className="font-bold text-[17px] tracking-tight text-white">
							DashLink
						</span>
					</Link>
					<Link
						to="/"
						className="flex items-center gap-1.5 text-sm text-[#8a99b3] hover:text-white transition-colors"
					>
						<ArrowLeft size={14} />
						Back to home
					</Link>
				</div>
			</header>

			{/* ── Main content ────────────────────────────────── */}
			<div className="relative z-10 flex flex-1 items-stretch">
				{/* Left panel — brand pitch (desktop only) */}
				<div className="hidden lg:flex flex-col justify-center px-16 xl:px-24 flex-1 max-w-2xl border-r border-white/6">
					{/* Badge */}
					<div className="mb-8 inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full border border-[#14F195]/20 bg-[#14F195]/6 text-[#14F195] text-xs font-medium">
						<Zap size={11} />
						Non-custodial · Instant · No app required
					</div>

					{/* Headline */}
					<h1 className="text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
						<span className="text-white">The simplest way</span>
						<br />
						<span className="bg-linear-to-r from-[#14F195] via-[#5af5c0] to-[#14F195] bg-clip-text text-transparent">
							to move crypto.
						</span>
					</h1>

					<p className="text-lg text-[#8a99b3] leading-relaxed mb-10 max-w-md">
						Send and receive digital assets as fast as you can share
						a link — no app download, no seed phrases, no friction.
					</p>

					{/* Feature list */}
					<ul className="flex flex-col gap-4">
						{[
							{
								text: "Self-custodial — you always own your keys",
								color: "#14F195",
							},
							{
								text: "Non-custodial MPC architecture",
								color: "#14F195",
							},
							{
								text: "Send SOL & SPL tokens via shareable link",
								color: "#14F195",
							},
							{
								text: "In-app swap powered by Jupiter",
								color: "#14F195",
							},
						].map((feat) => (
							<li
								key={feat.text}
								className="flex items-start gap-3 text-sm text-[#8a99b3]"
							>
								<Check
									size={15}
									className="text-[#14F195] mt-0.5 shrink-0"
								/>
								{feat.text}
							</li>
						))}
					</ul>

					{/* Security badge */}
					<div className="mt-12 flex items-center gap-3 px-5 py-4 rounded-2xl border border-white/6 bg-white/3 w-fit">
						<div className="w-9 h-9 rounded-xl bg-[#14F195]/14 border border-[#14F195]/22 flex items-center justify-center shrink-0">
							<Shield size={16} className="text-[#14F195]" />
						</div>
						<div>
							<p className="text-sm font-semibold text-white">
								MPC Key Architecture
							</p>
							<p className="text-xs text-[#8a99b3] mt-0.5">
								Your key is never in one place
							</p>
						</div>
					</div>
				</div>

				{/* Right panel — sign-in card */}
				<div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-8">
					<div className="w-full max-w-md">
						{/* Mobile logo (hidden on desktop) */}
						<div className="flex flex-col items-center gap-3 mb-10 lg:hidden">
							<div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#14F195] to-[#0ea572] flex items-center justify-center shadow-xl shadow-[#14F195]/20">
								<Link2
									size={24}
									className="text-[#060810]"
									strokeWidth={2.5}
								/>
							</div>
							<div className="text-center">
								<h1 className="text-2xl font-bold text-white tracking-tight">
									DashLink
								</h1>
								<p className="text-sm text-[#8a99b3] mt-1">
									Instant crypto transfers via URL
								</p>
							</div>
						</div>

						{/* Card */}
						<div className="relative rounded-2xl border border-white/8 bg-[#0d1117] overflow-hidden shadow-2xl shadow-black/60">
							{/* Top accent line */}
							<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#14F195]/50 to-transparent" />

							<div className="p-8 sm:p-10">
								{/* Heading */}
								<div className="mb-8">
									<h2 className="text-2xl font-bold text-white tracking-tight">
										Welcome back
									</h2>
									<p className="text-sm text-[#8a99b3] mt-2 leading-relaxed">
										Sign in to manage your wallet and
										payment links. No wallet needed to get
										started.
									</p>
								</div>

								{/* Google sign-in button */}
								<button
									onClick={() => void handleSignIn()}
									disabled={loading}
									className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-white text-[#060810] font-semibold text-sm hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-lg shadow-white/10"
								>
									{loading ? (
										<LoadingSpinner size="sm" />
									) : (
										<GoogleIcon />
									)}
									{loading
										? "Redirecting…"
										: "Continue with Google"}
								</button>

								{/* Divider */}
								<div className="my-6 flex items-center gap-3">
									<div className="flex-1 h-px bg-white/6" />
									<span className="text-[11px] text-[#8a99b3] uppercase tracking-widest">
										or
									</span>
									<div className="flex-1 h-px bg-white/6" />
								</div>

								{/* Info hint */}
								<div className="flex items-start gap-3 p-4 rounded-xl bg-[#14F195]/6 border border-[#14F195]/12">
									<div className="w-7 h-7 rounded-lg bg-[#14F195]/14 flex items-center justify-center shrink-0 mt-0.5">
										<Zap
											size={13}
											className="text-[#14F195]"
										/>
									</div>
									<p className="text-xs text-[#8a99b3] leading-relaxed">
										Your wallet is secured by MPC
										technology. No seed phrase, no
										extensions — you own the keys.
									</p>
								</div>

								{/* Micro features */}
								<div className="mt-6 grid grid-cols-3 gap-3 text-center">
									{[
										{
											label: "2 clicks",
											sub: "to sign up",
										},
										{ label: "100%", sub: "non-custodial" },
										{ label: "~0¢", sub: "fees on Solana" },
									].map((item) => (
										<div
											key={item.label}
											className="flex flex-col gap-0.5 p-3 rounded-xl bg-white/3 border border-white/6"
										>
											<span className="text-sm font-bold text-white">
												{item.label}
											</span>
											<span className="text-[10px] text-[#8a99b3]">
												{item.sub}
											</span>
										</div>
									))}
								</div>

								{/* Legal */}
								<p className="mt-6 text-center text-[10px] text-[#8a99b3] leading-relaxed">
									By continuing, you agree to our{" "}
									<a
										href="#"
										className="text-[#14F195] hover:underline"
									>
										Terms of Service
									</a>{" "}
									and{" "}
									<a
										href="#"
										className="text-[#14F195] hover:underline"
									>
										Privacy Policy
									</a>
									.
								</p>
							</div>
						</div>

						{/* Back link */}
						<p className="mt-6 text-center text-sm text-[#8a99b3]">
							New here?{" "}
							<Link
								to="/"
								className="text-[#14F195] hover:underline font-medium"
							>
								Learn about DashLink
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
