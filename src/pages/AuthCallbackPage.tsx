import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getCookie, deleteCookie } from "@/lib/cookies";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
	state_not_found: "Security check failed. Please try again.",
	failed_to_save_user: "Failed to create your account. Please try again.",
	failed_to_save_refresh_token: "Session setup failed. Please try again.",
	failed_to_save_wallet: "Wallet setup failed. Please try again.",
};

export function AuthCallbackPage() {
	const navigate = useNavigate();
	const ranRef = useRef(false);

	useEffect(() => {
		if (ranRef.current) return;
		ranRef.current = true;

		const status = getCookie("auth_status");
		const message = getCookie("auth_message");

		deleteCookie("auth_status");
		deleteCookie("auth_message");

		if (status === "success") {
			toast.success("Signed in successfully!");
			navigate("/dashboard", { replace: true });
		} else if (status === "error") {
			const errorMsg =
				(message && AUTH_ERROR_MESSAGES[message]) ??
				"Sign-in failed. Please try again.";
			toast.error(errorMsg);
			navigate("/login", { replace: true });
		} else {
			navigate("/login", { replace: true });
		}
	}, [navigate]);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-4">
			<LoadingSpinner size="lg" />
			<p className="text-sm text-[hsl(215_20%_55%)]">Signing you in…</p>
		</div>
	);
}
