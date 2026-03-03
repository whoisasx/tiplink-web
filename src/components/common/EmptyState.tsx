import type { LucideIcon } from "lucide-react";
import { InboxIcon } from "lucide-react";

interface EmptyStateProps {
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: React.ReactNode;
}

export function EmptyState({
	icon: Icon = InboxIcon,
	title,
	description,
	action,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
			<div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
				<Icon size={22} className="text-[hsl(215_20%_55%)]" />
			</div>
			<div>
				<p className="text-sm font-medium text-white">{title}</p>
				{description && (
					<p className="text-xs text-[hsl(215_20%_55%)] mt-1 max-w-xs">
						{description}
					</p>
				)}
			</div>
			{action && <div className="mt-2">{action}</div>}
		</div>
	);
}
