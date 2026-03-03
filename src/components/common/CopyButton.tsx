import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
	text: string;
	className?: string;
	label?: string;
}

export function CopyButton({ text, className, label }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const copy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			// Fallback for older browsers
			const el = document.createElement("textarea");
			el.value = text;
			document.body.appendChild(el);
			el.select();
			document.execCommand("copy");
			document.body.removeChild(el);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		}
	}, [text]);

	return (
		<button
			onClick={() => void copy()}
			aria-label={label ?? "Copy to clipboard"}
			className={cn(
				"inline-flex items-center gap-1.5 text-[hsl(215_20%_55%)] hover:text-white transition-colors text-xs",
				className,
			)}
		>
			{copied ? (
				<Check size={13} className="text-green-400" />
			) : (
				<Copy size={13} />
			)}
			{label && <span>{copied ? "Copied!" : label}</span>}
		</button>
	);
}
