import { Link, useLocation } from "react-router-dom";
import { FileQuestion } from "lucide-react";

export function NotFoundPage() {
	const { pathname } = useLocation();

	// Check if it looks like someone navigated to /claim/<something>
	const looksLikeClaimPath = /^\/claim\/.+/.test(pathname);

	return (
		<div className="min-h-screen bg-[hsl(224_71%_4%)] flex flex-col items-center justify-center p-4 text-center">
			<div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
				<FileQuestion size={28} className="text-[hsl(215_20%_55%)]" />
			</div>
			<h1 className="text-4xl font-bold text-white mb-2">404</h1>
			<p className="text-base text-[hsl(215_20%_65%)] mb-1">
				Page not found
			</p>
			<p className="text-xs text-[hsl(215_20%_45%)] max-w-xs mb-6 leading-relaxed">
				{looksLikeClaimPath
					? "Looking to claim a DashLink? Make sure the full claim URL is correct."
					: "The page you're looking for doesn't exist or has been moved."}
			</p>
			<div className="flex gap-3">
				<Link
					to="/dashboard"
					className="px-4 py-2.5 rounded-xl bg-white text-[hsl(222_47%_11%)] font-semibold text-sm hover:bg-white/90 transition-colors"
				>
					Go to Dashboard
				</Link>
				{looksLikeClaimPath && (
					<Link
						to="/"
						className="px-4 py-2.5 rounded-xl border border-[hsl(216_34%_17%)] text-sm text-[hsl(215_20%_65%)] hover:text-white transition-colors"
					>
						Home
					</Link>
				)}
			</div>
		</div>
	);
}
