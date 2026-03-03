import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
	title?: string;
	message?: string;
	onRetry?: () => void;
}

export function ErrorState({
	title = "Something went wrong",
	message,
	onRetry,
}: ErrorStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
			<div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
				<AlertCircle size={22} className="text-red-400" />
			</div>
			<div>
				<p className="text-sm font-medium text-white">{title}</p>
				{message && (
					<p className="text-xs text-[hsl(215_20%_55%)] mt-1 max-w-xs">
						{message}
					</p>
				)}
			</div>
			{onRetry && (
				<button
					onClick={onRetry}
					className="text-xs text-[hsl(215_20%_55%)] hover:text-white underline underline-offset-2 transition-colors mt-1"
				>
					Try again
				</button>
			)}
		</div>
	);
}
