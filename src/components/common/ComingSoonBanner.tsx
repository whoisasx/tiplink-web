import { Clock } from "lucide-react";

interface ComingSoonBannerProps {
	title: string;
	description: string;
}

export function ComingSoonBanner({
	title,
	description,
}: ComingSoonBannerProps) {
	return (
		<div className="relative overflow-hidden rounded-xl border border-[hsl(216_34%_17%)] bg-[hsl(224_71%_6%)] p-6">
			{/* Subtle glow */}
			<div className="absolute inset-0 bg-linear-to-br from-white/2 to-transparent pointer-events-none" />
			<div className="flex items-start gap-4">
				<div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
					<Clock size={18} className="text-[hsl(215_20%_55%)]" />
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<h3 className="text-sm font-semibold text-white">
							{title}
						</h3>
						<span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-amber-500/15 text-amber-400 border border-amber-500/20">
							Coming Soon
						</span>
					</div>
					<p className="text-xs text-[hsl(215_20%_55%)] leading-relaxed">
						{description}
					</p>
				</div>
			</div>
		</div>
	);
}
