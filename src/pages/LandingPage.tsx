import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Link2,
	ArrowRight,
	Zap,
	Shield,
	Globe,
	Code2,
	ChevronRight,
	Menu,
	X,
	Check,
	Wallet,
	Send,
	ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { getCookie, deleteCookie } from "@/lib/cookies";
import { getGoogleAuthUrl } from "@/api/auth";
import { useAuthStore } from "@/store/auth.store";

/* ─────────────────────────────────────────────── helpers ──── */
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

/* ─────────────────────────────────────────────────────────── */

export function LandingPage() {
	const navigate = useNavigate();
	const { status } = useAuthStore();
	const ranRef = useRef(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [ctaLoading, setCtaLoading] = useState(false);

	/* handle OAuth callback cookie (server redirects back to "/") */
	useEffect(() => {
		if (ranRef.current) return;
		ranRef.current = true;

		const authStatus = getCookie("auth_status");
		const authMessage = getCookie("auth_message");

		if (authStatus) {
			deleteCookie("auth_status");
			deleteCookie("auth_message");

			const AUTH_ERRORS: Record<string, string> = {
				state_not_found: "Security check failed. Please try again.",
				failed_to_save_user:
					"Failed to create your account. Please try again.",
				failed_to_save_refresh_token:
					"Session setup failed. Please try again.",
				failed_to_save_wallet: "Wallet setup failed. Please try again.",
			};

			if (authStatus === "success") {
				toast.success("Signed in successfully!");
				void navigate("/dashboard", { replace: true });
			} else {
				const msg =
					(authMessage && AUTH_ERRORS[authMessage]) ??
					"Sign-in failed. Please try again.";
				toast.error(msg);
			}
		}
	}, [navigate]);

	/* already authenticated → bounce to dashboard */
	useEffect(() => {
		if (status === "authenticated") {
			void navigate("/dashboard", { replace: true });
		}
	}, [status, navigate]);

	const handleSignIn = async () => {
		setCtaLoading(true);
		try {
			const url = await getGoogleAuthUrl();
			window.location.href = url;
		} catch {
			toast.error("Failed to start sign-in. Please try again.");
			setCtaLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#060810] text-white overflow-x-hidden">
			{/* ── Ambient glow layers ───────────────────────────────── */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute top-[-20%] left-[10%] w-150 h-150 rounded-full bg-[#14F195]/4 blur-[120px]" />
				<div className="absolute top-[30%] right-[-10%] w-125 h-125 rounded-full bg-[#9945FF]/4 blur-[120px]" />
				<div className="absolute bottom-[10%] left-[30%] w-100 h-100 rounded-full bg-[#14F195]/3 blur-[100px]" />
			</div>

			{/* ══════════════════════ NAVBAR ═══════════════════════ */}
			<header className="fixed top-0 left-0 right-0 z-50 border-b border-white/6 bg-[#060810]/80 backdrop-blur-xl">
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					{/* Logo */}
					<Link
						to="/"
						className="flex items-center gap-2.5 shrink-0"
					>
						<div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#14F195] to-[#0ea572] flex items-center justify-center shadow-lg shadow-[#14F195]/20">
							<Link2 size={15} className="text-[#060810]" strokeWidth={2.5} />
						</div>
						<span className="font-bold text-[17px] tracking-tight text-white">
							DashLink
						</span>
					</Link>

					{/* Desktop nav */}
					<div className="hidden md:flex items-center gap-1">
						{[
							{ label: "Products", href: "#products" },
							{ label: "Docs", href: "#developers" },
							{ label: "FAQ", href: "#faq" },
						].map((item) => (
							<a
								key={item.label}
								href={item.href}
								className="px-4 py-2 text-sm text-[#8a99b3] hover:text-white transition-colors rounded-lg hover:bg-white/5"
							>
								{item.label}
							</a>
						))}
					</div>

					{/* Desktop CTA */}
					<div className="hidden md:flex items-center gap-3">
						<Link
							to="/login"
							className="px-4 py-2 text-sm text-[#8a99b3] hover:text-white transition-colors"
						>
							Log in
						</Link>
						<button
							onClick={() => void handleSignIn()}
							disabled={ctaLoading}
							className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#14F195] text-[#060810] text-sm font-semibold hover:bg-[#12d882] transition-all active:scale-[0.97] disabled:opacity-60"
						>
							<GoogleIcon />
							Get Started
						</button>
					</div>

					{/* Mobile hamburger */}
					<button
						className="md:hidden p-2 rounded-lg text-[#8a99b3] hover:text-white hover:bg-white/5"
						onClick={() => setMobileMenuOpen((v) => !v)}
					>
						{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
					</button>
				</nav>

				{/* Mobile menu */}
				{mobileMenuOpen && (
					<div className="md:hidden border-t border-white/6 bg-[#060810]/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-2">
						{[
							{ label: "Products", href: "#products" },
							{ label: "Docs", href: "#developers" },
							{ label: "FAQ", href: "#faq" },
						].map((item) => (
							<a
								key={item.label}
								href={item.href}
								onClick={() => setMobileMenuOpen(false)}
								className="px-4 py-3 text-sm text-[#8a99b3] hover:text-white transition-colors rounded-lg hover:bg-white/5"
							>
								{item.label}
							</a>
						))}
						<div className="pt-2 border-t border-white/6 flex flex-col gap-2">
							<Link
								to="/login"
								className="px-4 py-3 text-sm text-center text-[#8a99b3] hover:text-white transition-colors rounded-lg border border-white/10"
							>
								Log in
							</Link>
							<button
								onClick={() => void handleSignIn()}
								disabled={ctaLoading}
								className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#14F195] text-[#060810] text-sm font-semibold"
							>
								<GoogleIcon />
								Get Started Free
							</button>
						</div>
					</div>
				)}
			</header>

			{/* ══════════════════════ HERO ══════════════════════════ */}
			<section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
				{/* Announcement badge */}
				<div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#14F195]/20 bg-[#14F195]/6 text-[#14F195] text-xs font-medium">
					<Zap size={11} />
					Non-custodial · Instant · No app required
					<ChevronRight size={12} className="opacity-70" />
				</div>

				{/* Headline */}
				<h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.08] max-w-4xl">
					<span className="text-white">The crypto of</span>
					<br />
					<span className="bg-linear-to-r from-[#14F195] via-[#5af5c0] to-[#14F195] bg-clip-text text-transparent">
						tomorrow, today.
					</span>
				</h1>

				{/* Subheadline */}
				<p className="mt-6 text-lg sm:text-xl text-[#8a99b3] max-w-xl leading-relaxed">
					Send and receive digital assets as fast as you can share a
					link — no app download, no seed phrases, no friction.
				</p>

				{/* CTA buttons */}
				<div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
					<button
						onClick={() => void handleSignIn()}
						disabled={ctaLoading}
						className="group flex items-center gap-3 px-7 py-3.5 rounded-xl bg-white text-[#060810] font-semibold text-sm hover:bg-white/90 transition-all active:scale-[0.97] shadow-lg shadow-white/10 disabled:opacity-60"
					>
						{ctaLoading ? (
							<div className="w-4 h-4 border-2 border-[#060810]/30 border-t-[#060810] rounded-full animate-spin" />
						) : (
							<GoogleIcon />
						)}
						Sign Up with Google
						<ArrowRight
							size={15}
							className="opacity-60 group-hover:translate-x-0.5 transition-transform"
						/>
					</button>
					<a
						href="#products"
						className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 text-[#8a99b3] text-sm font-medium hover:border-white/20 hover:text-white transition-all"
					>
						Learn more
					</a>
				</div>

				{/* Social proof */}
				<div className="mt-12 flex items-center gap-6 text-xs text-[#8a99b3]">
					{[
						"No credit card required",
						"Free forever tier",
						"Built on Solana",
					].map((item, i) => (
						<span key={item} className="flex items-center gap-1.5">
							{i > 0 && (
								<span className="w-1 h-1 rounded-full bg-[#8a99b3]/40" />
							)}
							<Check size={11} className="text-[#14F195]" />
							{item}
						</span>
					))}
				</div>

				{/* ── Floating mock UI card ─────────────────────────── */}
				<div className="relative mt-20 w-full max-w-3xl mx-auto">
					{/* Glow behind card */}
					<div className="absolute inset-0 bg-linear-to-b from-[#14F195]/10 to-transparent rounded-3xl blur-2xl" />

					<div className="relative rounded-2xl border border-white/8 bg-[#0d1117] overflow-hidden shadow-2xl shadow-black/60">
						{/* Mock topbar */}
						<div className="flex items-center gap-2 px-5 py-4 border-b border-white/6 bg-[#0a0d12]">
							<div className="flex gap-1.5">
								{["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
									<div
										key={c}
										className="w-3 h-3 rounded-full"
										style={{ background: c }}
									/>
								))}
							</div>
							<div className="flex-1 mx-4 h-6 rounded-lg bg-white/4 flex items-center px-3 gap-2">
								<Shield size={11} className="text-[#14F195]" />
								<span className="text-[11px] text-[#8a99b3] font-mono">
									dashlink.app/c/&nbsp;
									<span className="text-white">xK9mP2qR</span>
								</span>
							</div>
						</div>

						{/* Mock app content */}
						<div className="grid grid-cols-3 gap-0 divide-x divide-white/6">
							{/* Sidebar mock */}
							<div className="hidden md:flex flex-col gap-2 p-4 bg-[#0a0d12]">
								{[
									{ icon: "📊", label: "Dashboard" },
									{ icon: "💼", label: "Wallet" },
									{ icon: "🔗", label: "Links", active: true },
									{ icon: "🔄", label: "Swap" },
								].map((item) => (
									<div
										key={item.label}
										className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs ${item.active ? "bg-white/10 text-white" : "text-[#8a99b3]"}`}
									>
										<span className="text-sm">{item.icon}</span>
										{item.label}
									</div>
								))}
							</div>

							{/* Main content mock spans 2 cols */}
							<div className="col-span-3 md:col-span-2 p-6 flex flex-col gap-5">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-xs text-[#8a99b3]">Total Balance</p>
										<p className="text-2xl font-bold text-white mt-0.5">
											$2,481.50
										</p>
									</div>
									<div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#14F195] text-[#060810] text-xs font-bold">
										<Send size={12} />
										Create Link
									</div>
								</div>

								{/* Mini token list */}
								<div className="flex flex-col gap-2">
									{[
										{
											symbol: "SOL",
											amount: "12.4",
											value: "$1,860",
											color: "#9945FF",
										},
										{
											symbol: "USDC",
											amount: "621.50",
											value: "$621",
											color: "#2775CA",
										},
									].map((token) => (
										<div
											key={token.symbol}
											className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/3 border border-white/6"
										>
											<div className="flex items-center gap-3">
												<div
													className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
													style={{ background: token.color }}
												>
													{token.symbol[0]}
												</div>
												<div>
													<p className="text-sm font-medium text-white">
														{token.symbol}
													</p>
													<p className="text-[11px] text-[#8a99b3]">
														{token.amount}
													</p>
												</div>
											</div>
											<p className="text-sm font-semibold text-white">
												{token.value}
											</p>
										</div>
									))}
								</div>

								{/* Active links mock */}
								<div>
									<p className="text-xs text-[#8a99b3] mb-2">Active Links</p>
									<div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/3 border border-white/6">
										<div className="flex items-center gap-3">
											<div className="w-7 h-7 rounded-lg bg-[#14F195]/10 flex items-center justify-center">
												<Link2 size={12} className="text-[#14F195]" />
											</div>
											<div>
												<p className="text-xs font-medium text-white">
													dashlink.app/c/xK9mP2qR
												</p>
												<p className="text-[10px] text-[#8a99b3]">
													0.5 SOL · Unclaimed
												</p>
											</div>
										</div>
										<span className="text-[10px] px-2 py-0.5 rounded-full bg-[#14F195]/10 text-[#14F195] font-medium">
											Active
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ══════════════════════ PRODUCTS ══════════════════════ */}
			<section id="products" className="relative py-28 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					{/* Section heading */}
					<div className="text-center mb-16">
						<p className="text-xs tracking-[0.2em] uppercase text-[#14F195] font-semibold mb-4">
							Products
						</p>
						<h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
							Everything you need to{" "}
							<span className="text-[#8a99b3]">move crypto</span>
						</h2>
					</div>

					{/* Three product cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[
							{
								badge: "DASHLINK WALLET",
								title: "The world's simplest wallet",
								desc: "Create or log in to your secured DashLink wallet in 2 clicks — just a Google account, nothing else.",
								icon: <Wallet size={22} className="text-[#14F195]" />,
								color: "#14F195",
								cta: "Get your wallet",
							},
							{
								badge: "DASHLINK PRO",
								title: "Send at scale, even to non-crypto users",
								desc: "Distribute tokens, airdrops, and payouts to anyone with an email — no wallets, no setup required.",
								icon: <Send size={22} className="text-[#9945FF]" />,
								color: "#9945FF",
								cta: "Explore Pro",
							},
							{
								badge: "DASHLINK API",
								title: "Developer-first infrastructure",
								desc: "Programmatically generate wallets and manage token distribution at scale with our simple REST API.",
								icon: <Code2 size={22} className="text-[#F5AA14]" />,
								color: "#F5AA14",
								cta: "Read the docs",
							},
						].map((product) => (
							<div
								key={product.badge}
								className="group relative flex flex-col p-7 rounded-2xl border border-white/7 bg-[#0d1117] hover:border-white/12 transition-all duration-300 hover:-translate-y-1"
							>
								{/* Top glow */}
								<div
									className="absolute inset-x-0 top-0 h-px rounded-full opacity-40 group-hover:opacity-70 transition-opacity"
									style={{
										background: `linear-gradient(90deg, transparent, ${product.color}, transparent)`,
									}}
								/>

								{/* Icon badge */}
								<div
									className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
									style={{
										background: `${product.color}14`,
										border: `1px solid ${product.color}22`,
									}}
								>
									{product.icon}
								</div>

								{/* Badge */}
								<p
									className="text-[10px] tracking-[0.18em] uppercase font-bold mb-3"
									style={{ color: product.color }}
								>
									{product.badge}
								</p>

								{/* Title */}
								<h3 className="text-xl font-bold text-white mb-3 leading-snug">
									{product.title}
								</h3>

								{/* Description */}
								<p className="text-sm text-[#8a99b3] leading-relaxed flex-1">
									{product.desc}
								</p>

								{/* CTA */}
								<button
									className="mt-6 flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3"
									style={{ color: product.color }}
								>
									{product.cta}
									<ArrowRight size={14} />
								</button>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ══════════════════╡ WALLET SECTION ╞══════════════════ */}
			<section className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/4">
				<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					{/* Text */}
					<div>
						<p className="text-xs tracking-[0.2em] uppercase text-[#14F195] font-semibold mb-5">
							DashLink Wallet
						</p>
						<h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
							The world's simplest wallet
						</h2>
						<p className="text-[#8a99b3] text-lg leading-relaxed mb-8">
							Create or log in to your secured DashLink wallet with just
							2 clicks — powered by Google OAuth. No seed phrases. No
							extensions. No complexity.
						</p>
						<ul className="flex flex-col gap-4 mb-10">
							{[
								"Self-custodial — you always own your keys",
								"Non-custodial MPC architecture",
								"Send SOL & SPL tokens via shareable link",
								"In-app swap powered by Jupiter",
							].map((feat) => (
								<li
									key={feat}
									className="flex items-start gap-3 text-sm text-[#8a99b3]"
								>
									<Check
										size={15}
										className="text-[#14F195] mt-0.5 shrink-0"
									/>
									{feat}
								</li>
							))}
						</ul>
						<button
							onClick={() => void handleSignIn()}
							disabled={ctaLoading}
							className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-[#060810] text-sm font-semibold hover:bg-white/90 transition-all active:scale-[0.97] disabled:opacity-60"
						>
							<GoogleIcon />
							Sign Up with Google
						</button>
					</div>

					{/* Graphic / mock wallet card */}
					<div className="relative flex justify-center">
						<div className="absolute inset-0 bg-[#14F195]/6 rounded-3xl blur-3xl" />
						<div className="relative w-full max-w-sm rounded-2xl border border-white/8 bg-[#0d1117] p-7 shadow-2xl">
							{/* Header */}
							<div className="flex items-center justify-between mb-7">
								<div className="flex items-center gap-2.5">
									<div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#14F195] to-[#0ea572] flex items-center justify-center">
										<Link2 size={14} className="text-[#060810]" strokeWidth={2.5} />
									</div>
									<span className="font-bold text-white text-sm">DashLink Wallet</span>
								</div>
								<span className="text-[10px] px-2 py-0.5 rounded-full bg-[#14F195]/10 text-[#14F195] font-medium border border-[#14F195]/20">
									● Live
								</span>
							</div>

							{/* Balance */}
							<div className="mb-7">
								<p className="text-xs text-[#8a99b3] mb-1">Portfolio Value</p>
								<p className="text-4xl font-bold text-white">$2,481.50</p>
								<p className="text-xs text-[#14F195] mt-1.5 flex items-center gap-1">
									<span>↑ 4.2%</span>
									<span className="text-[#8a99b3]">today</span>
								</p>
							</div>

							{/* Actions */}
							<div className="grid grid-cols-3 gap-3 mb-7">
								{[
									{ label: "Send", icon: <Send size={15} /> },
									{ label: "Create Link", icon: <Link2 size={15} /> },
									{ label: "Swap", icon: <ArrowRight size={15} /> },
								].map((action) => (
									<div
										key={action.label}
										className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/4 border border-white/6 hover:bg-white/7 transition-colors cursor-pointer"
									>
										<div className="text-[#14F195]">{action.icon}</div>
										<span className="text-[10px] text-[#8a99b3] font-medium">
											{action.label}
										</span>
									</div>
								))}
							</div>

							{/* Token list */}
							<div className="flex flex-col gap-2">
								<p className="text-[11px] text-[#8a99b3] mb-1">Assets</p>
								{[
									{ symbol: "SOL", name: "Solana", amount: "12.4", value: "$1,860.00", c: "#9945FF", change: "+5.1%" },
									{ symbol: "USDC", name: "USD Coin", amount: "621.50", value: "$621.50", c: "#2775CA", change: "+0.01%" },
								].map((t) => (
									<div
										key={t.symbol}
										className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3"
									>
										<div
											className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
											style={{ background: t.c }}
										>
											{t.symbol[0]}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-white truncate">
												{t.name}
											</p>
											<p className="text-[11px] text-[#8a99b3]">{t.amount} {t.symbol}</p>
										</div>
										<div className="text-right">
											<p className="text-sm font-semibold text-white">{t.value}</p>
											<p className="text-[10px] text-[#14F195]">{t.change}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ══════════════════╡ PRO SECTION ╞══════════════════════ */}
			<section className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/4">
				<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					{/* Graphic (left on desktop) */}
					<div className="relative flex justify-center order-2 lg:order-1">
						<div className="absolute inset-0 bg-[#9945FF]/6 rounded-3xl blur-3xl" />
						<div className="relative w-full max-w-sm rounded-2xl border border-white/8 bg-[#0d1117] p-7 shadow-2xl">
							<p className="text-[10px] tracking-[0.18em] uppercase font-bold text-[#9945FF] mb-4">
								Bulk Distribution
							</p>
							<h4 className="text-xl font-bold text-white mb-6">
								Send to 10,000 recipients in seconds
							</h4>
							<div className="flex flex-col gap-3">
								{[
									{ step: "1", text: "Upload CSV of recipients", done: true },
									{ step: "2", text: "Select token & amount", done: true },
									{ step: "3", text: "Generate magic links", done: true },
									{ step: "4", text: "Recipients claim instantly", done: false },
								].map((item) => (
									<div key={item.step} className="flex items-center gap-3">
										<div
											className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${item.done ? "bg-[#9945FF] text-white" : "bg-white/6 text-[#8a99b3] border border-white/10"}`}
										>
											{item.done ? <Check size={13} /> : item.step}
										</div>
										<p
											className={`text-sm ${item.done ? "text-white" : "text-[#8a99b3]"}`}
										>
											{item.text}
										</p>
									</div>
								))}
							</div>
							<div className="mt-7 p-4 rounded-xl bg-[#9945FF]/10 border border-[#9945FF]/20">
								<p className="text-xs text-[#8a99b3] mb-1">Total distributed</p>
								<p className="text-2xl font-bold text-white">$124,800</p>
								<p className="text-xs text-[#9945FF] mt-1">across 9,872 links</p>
							</div>
						</div>
					</div>

					{/* Text */}
					<div className="order-1 lg:order-2">
						<p className="text-xs tracking-[0.2em] uppercase text-[#9945FF] font-semibold mb-5">
							DashLink Pro
						</p>
						<h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
							Send digital assets at scale, even to non-crypto users
						</h2>
						<p className="text-[#8a99b3] text-lg leading-relaxed mb-8">
							DashLink makes distributing digital assets as simple as
							clicking a link. From employee rewards to mass airdrops,
							DashLink Pro handles it all.
						</p>
						<ul className="flex flex-col gap-4 mb-10">
							{[
								"Bulk generate thousands of claim links",
								"Email & CSV delivery built-in",
								"Real-time dashboard tracking",
								"No crypto knowledge needed by recipients",
							].map((feat) => (
								<li
									key={feat}
									className="flex items-start gap-3 text-sm text-[#8a99b3]"
								>
									<Check
										size={15}
										className="text-[#9945FF] mt-0.5 shrink-0"
									/>
									{feat}
								</li>
							))}
						</ul>
						<button className="flex items-center gap-2 text-sm font-semibold text-[#9945FF] hover:gap-3 transition-all">
							Learn about DashLink Pro <ArrowRight size={14} />
						</button>
					</div>
				</div>
			</section>

			{/* ══════════════════╡ API / DEVELOPERS SECTION ╞═════════ */}
			<section
				id="developers"
				className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/4"
			>
				<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					{/* Text */}
					<div>
						<p className="text-xs tracking-[0.2em] uppercase text-[#F5AA14] font-semibold mb-5">
							DashLink API
						</p>
						<h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
							Ready for developers
						</h2>
						<p className="text-[#8a99b3] text-lg leading-relaxed mb-8">
							DashLink wallets can be programmatically generated to hold
							tokens and NFTs at scale. Our clean REST API gets you from
							zero to production in minutes.
						</p>
						<div className="flex items-center gap-4">
							<button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-all">
								<ExternalLink size={14} />
								Read the Docs
							</button>
							<button className="flex items-center gap-2 text-sm font-semibold text-[#F5AA14] hover:gap-3 transition-all">
								API Reference <ArrowRight size={14} />
							</button>
						</div>
					</div>

					{/* Code snippet mock */}
					<div className="relative">
						<div className="absolute inset-0 bg-[#F5AA14]/4 rounded-3xl blur-3xl" />
						<div className="relative rounded-2xl border border-white/8 bg-[#0a0d12] overflow-hidden shadow-2xl">
							{/* Code topbar */}
							<div className="flex items-center justify-between px-5 py-3 border-b border-white/6">
								<div className="flex gap-1.5">
									{["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
										<div
											key={c}
											className="w-3 h-3 rounded-full"
											style={{ background: c }}
										/>
									))}
								</div>
								<span className="text-[11px] text-[#8a99b3]">
									create-link.ts
								</span>
								<div className="w-16" />
							</div>

							{/* Code content */}
							<pre className="p-6 text-[13px] leading-relaxed font-mono overflow-x-auto">
								<code>
									<span className="text-[#8a99b3]">// Create a DashLink in one line</span>
									{"\n"}
									<span className="text-[#9945FF]">import</span>
									<span className="text-white"> {"{"} DashLink {"}"} </span>
									<span className="text-[#9945FF]">from</span>
									<span className="text-[#F5AA14]"> '@dashlink/sdk'</span>
									{"\n\n"}
									<span className="text-[#9945FF]">const</span>
									<span className="text-white"> link </span>
									<span className="text-[#F5AA14]">=</span>
									<span className="text-[#9945FF]"> await</span>
									<span className="text-white"> DashLink.</span>
									<span className="text-[#14F195]">create</span>
									<span className="text-white">{"({"}</span>
									{"\n"}
									<span className="text-white">{"  "}token</span>
									<span className="text-[#F5AA14]">:</span>
									<span className="text-[#F5AA14]"> 'SOL'</span>
									<span className="text-white">,</span>
									{"\n"}
									<span className="text-white">{"  "}amount</span>
									<span className="text-[#F5AA14]">:</span>
									<span className="text-[#14F195]"> 0.5</span>
									<span className="text-white">,</span>
									{"\n"}
									<span className="text-white">{"  "}recipient</span>
									<span className="text-[#F5AA14]">:</span>
									<span className="text-[#F5AA14]"> 'alice@example.com'</span>
									{"\n"}
									<span className="text-white">{"}"});</span>
									{"\n\n"}
									<span className="text-[#8a99b3]">// → {"{"} url: 'https://dashlink.app/c/xK9mP2qR' {"}"}</span>
									{"\n"}
									<span className="text-[#8a99b3]">// Share the URL — recipient claims with one click</span>
								</code>
							</pre>
						</div>
					</div>
				</div>
			</section>

			{/* ══════════════════╡ HOW IT WORKS ╞══════════════════════ */}
			<section className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/4">
				<div className="max-w-5xl mx-auto text-center">
					<p className="text-xs tracking-[0.2em] uppercase text-[#14F195] font-semibold mb-4">
						How it works
					</p>
					<h2 className="text-4xl sm:text-5xl font-bold text-white mb-16 tracking-tight">
						Three steps to send crypto to anyone
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
						{/* Connector line (desktop) */}
						<div className="hidden md:block absolute top-9 left-[20%] right-[20%] h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

						{[
							{
								step: "01",
								title: "Create your wallet",
								desc: "Sign in with Google in two clicks. Your non-custodial wallet is created instantly — no seed phrases.",
								color: "#14F195",
							},
							{
								step: "02",
								title: "Generate a link",
								desc: "Choose the token and amount, then click Create Link. A unique URL with the funds is ready to share.",
								color: "#9945FF",
							},
							{
								step: "03",
								title: "Recipient claims",
								desc: "Anyone with the link can claim the crypto in seconds — no wallet or app needed on their side.",
								color: "#F5AA14",
							},
						].map((s) => (
							<div key={s.step} className="relative flex flex-col items-center text-center">
								<div
									className="w-18 h-18 rounded-2xl flex items-center justify-center text-xl font-extrabold mb-6 relative z-10"
									style={{
										background: `${s.color}12`,
										border: `1px solid ${s.color}30`,
										color: s.color,
									}}
								>
									{s.step}
								</div>
								<h3 className="text-lg font-bold text-white mb-3">{s.title}</h3>
								<p className="text-sm text-[#8a99b3] leading-relaxed">{s.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ══════════════════╡ STATS ╞═════════════════════════════  */}
			<section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/4">
				<div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
					{[
						{ value: "$2B+", label: "Total Volume" },
						{ value: "5M+", label: "Links Created" },
						{ value: "150+", label: "Countries" },
						{ value: "99.9%", label: "Uptime" },
					].map((stat) => (
						<div key={stat.label} className="text-center">
							<p className="text-4xl font-extrabold text-white mb-2">
								{stat.value}
							</p>
							<p className="text-sm text-[#8a99b3]">{stat.label}</p>
						</div>
					))}
				</div>
			</section>

			{/* ══════════════════╡ SECURITY ╞═══════════════════════════ */}
			<section className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/4">
				<div className="max-w-5xl mx-auto text-center">
					<p className="text-xs tracking-[0.2em] uppercase text-[#14F195] font-semibold mb-4">
						Security
					</p>
					<h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
						Built with security at its core
					</h2>
					<p className="text-[#8a99b3] text-lg max-w-2xl mx-auto mb-16">
						DashLink uses MPC (Multi-Party Computation) cryptography so no single party ever holds complete access to your keys.
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
						{[
							{
								icon: <Shield size={22} className="text-[#14F195]" />,
								title: "MPC Key Architecture",
								desc: "Your private key is never reconstructed in a single location. Splits are held across secure parties.",
								color: "#14F195",
							},
							{
								icon: <Globe size={22} className="text-[#9945FF]" />,
								title: "Non-Custodial",
								desc: "You own your assets. DashLink never holds your funds — they live on-chain in your wallet.",
								color: "#9945FF",
							},
							{
								icon: <Zap size={22} className="text-[#F5AA14]" />,
								title: "Built on Solana",
								desc: "Sub-second finality, near-zero fees. Solana's performance makes DashLink possible.",
								color: "#F5AA14",
							},
						].map((card) => (
							<div
								key={card.title}
								className="p-7 rounded-2xl border border-white/7 bg-[#0d1117] text-left"
							>
								<div
									className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
									style={{
										background: `${card.color}14`,
										border: `1px solid ${card.color}22`,
									}}
								>
									{card.icon}
								</div>
								<h3 className="text-base font-bold text-white mb-2">{card.title}</h3>
								<p className="text-sm text-[#8a99b3] leading-relaxed">{card.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ══════════════════╡ BACKERS ╞════════════════════════════ */}
			<section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/4">
				<div className="max-w-5xl mx-auto text-center">
					<p className="text-xs tracking-[0.2em] uppercase text-[#8a99b3] font-semibold mb-10">
						Our Backers — Supported by the top firms in the industry
					</p>
					<div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
						{[
							"Sequoia",
							"Multicoin",
							"Circle Ventures",
							"Solana Ventures",
							"Paxos",
							"Asymmetric",
						].map((name) => (
							<div
								key={name}
								className="px-6 py-3 rounded-xl border border-white/8 bg-white/2"
							>
								<span className="text-sm font-semibold text-[#8a99b3]">
									{name}
								</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ══════════════════╡ FINAL CTA ╞══════════════════════════ */}
			<section className="relative py-32 px-4 sm:px-6 lg:px-8 border-t border-white/4">
				{/* Glow */}
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="w-150 h-75 bg-[#14F195]/6 rounded-full blur-[100px]" />
				</div>

				<div className="relative max-w-3xl mx-auto text-center">
					<h2 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
						Try it for{" "}
						<span className="bg-linear-to-r from-[#14F195] to-[#5af5c0] bg-clip-text text-transparent">
							yourself
						</span>
					</h2>
					<p className="text-[#8a99b3] text-lg mb-10">
						Create and send crypto with DashLink — it takes less than 30
						seconds.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<button
							onClick={() => void handleSignIn()}
							disabled={ctaLoading}
							className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-[#060810] font-bold text-base hover:bg-white/90 transition-all active:scale-[0.97] shadow-xl shadow-white/10 disabled:opacity-60"
						>
							{ctaLoading ? (
								<div className="w-4 h-4 border-2 border-[#060810]/30 border-t-[#060810] rounded-full animate-spin" />
							) : (
								<GoogleIcon />
							)}
							Create a DashLink
							<ArrowRight
								size={16}
								className="opacity-60 group-hover:translate-x-0.5 transition-transform"
							/>
						</button>
					</div>
				</div>
			</section>

			{/* ══════════════════════ FOOTER ══════════════════════════ */}
			<footer className="border-t border-white/6 py-16 px-4 sm:px-6 lg:px-8 bg-[#060810]">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
						{/* Brand */}
						<div className="md:col-span-1">
							<div className="flex items-center gap-2.5 mb-4">
								<div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#14F195] to-[#0ea572] flex items-center justify-center">
									<Link2 size={14} className="text-[#060810]" strokeWidth={2.5} />
								</div>
								<span className="font-bold text-white text-base">DashLink</span>
							</div>
							<p className="text-sm text-[#8a99b3] leading-relaxed mb-5">
								Instant crypto transfers via URL. Non-custodial, lightweight, and built on Solana.
							</p>
							<div className="flex items-center gap-3">
								{/* Twitter/X */}
								<a
									href="#"
									className="w-9 h-9 rounded-lg border border-white/8 bg-white/3 flex items-center justify-center text-[#8a99b3] hover:text-white hover:bg-white/8 transition-all"
								>
									<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
										<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
									</svg>
								</a>
								{/* Discord */}
								<a
									href="#"
									className="w-9 h-9 rounded-lg border border-white/8 bg-white/3 flex items-center justify-center text-[#8a99b3] hover:text-white hover:bg-white/8 transition-all"
								>
									<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
										<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.112 18.1.132 18.117a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.128 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
									</svg>
								</a>
								{/* GitHub */}
								<a
									href="#"
									className="w-9 h-9 rounded-lg border border-white/8 bg-white/3 flex items-center justify-center text-[#8a99b3] hover:text-white hover:bg-white/8 transition-all"
								>
									<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
									</svg>
								</a>
							</div>
						</div>

						{/* Product links */}
						<div>
							<h4 className="text-sm font-semibold text-white mb-5">
								Product & Docs
							</h4>
							<ul className="flex flex-col gap-3">
								{[
									{ label: "Create DashLink", href: "/links/create" },
									{ label: "Documentation", href: "#" },
									{ label: "API Reference", href: "#" },
									{ label: "SDK", href: "#" },
								].map((item) => (
									<li key={item.label}>
										<a
											href={item.href}
											className="text-sm text-[#8a99b3] hover:text-white transition-colors"
										>
											{item.label}
										</a>
									</li>
								))}
							</ul>
						</div>

						{/* Company */}
						<div>
							<h4 className="text-sm font-semibold text-white mb-5">Company</h4>
							<ul className="flex flex-col gap-3">
								{[
									{ label: "FAQ", href: "#faq" },
									{ label: "Blog", href: "#" },
									{ label: "Careers", href: "#" },
									{ label: "Brand Resources", href: "#" },
								].map((item) => (
									<li key={item.label}>
										<a
											href={item.href}
											className="text-sm text-[#8a99b3] hover:text-white transition-colors"
										>
											{item.label}
										</a>
									</li>
								))}
							</ul>
						</div>

						{/* Legal */}
						<div>
							<h4 className="text-sm font-semibold text-white mb-5">Legal</h4>
							<ul className="flex flex-col gap-3">
								{[
									{ label: "Terms of Service", href: "#" },
									{ label: "Privacy Policy", href: "#" },
								].map((item) => (
									<li key={item.label}>
										<a
											href={item.href}
											className="text-sm text-[#8a99b3] hover:text-white transition-colors"
										>
											{item.label}
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Bottom bar */}
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/6">
						<p className="text-sm text-[#8a99b3]">
							© 2026 DashLink. All rights reserved.
						</p>
						<div className="flex items-center gap-2 text-sm text-[#8a99b3]">
							<Zap size={12} className="text-[#14F195]" />
							Powered by Solana
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
