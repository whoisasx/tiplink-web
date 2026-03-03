import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getCookie, deleteCookie } from "@/lib/cookies";
import { useAuthStore } from "@/store/auth.store";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
	state_not_found: "Security check failed. Please try again.",
	failed_to_save_user: "Failed to create your account. Please try again.",
	failed_to_save_refresh_token: "Session setup failed. Please try again.",
	failed_to_save_wallet: "Wallet setup failed. Please try again.",
};

export function AuthCallbackPage() {
	const navigate = useNavigate();
	const { init } = useAuthStore();
	const ranRef = useRef(false);

	useEffect(() => {
		if (ranRef.current) return;
		ranRef.current = true;

		const handle = async () => {
			const status = getCookie("auth_status");
			const message = getCookie("auth_message");

			// Always clean up auth cookies
			deleteCookie("auth_status");
			deleteCookie("auth_message");

			if (status === "success") {
				// Explicitly init here — the refresh_token cookie is guaranteed
				// present right now. AuthBootstrap also calls init() but the
				// store deduplicates concurrent calls so only one HTTP request
				// is ever made.
				await init();
				toast.success("Signed in successfully!");
				void navigate("/dashboard", { replace: true });
			} else if (status === "error") {
				const errorMsg =
					(message && AUTH_ERROR_MESSAGES[message]) ??
					"Sign-in failed. Please try again.";
				toast.error(errorMsg);
				void navigate("/login", { replace: true });
			} else {
				// No auth cookies — someone navigated here directly
				void navigate("/login", { replace: true });
			}
		};

		void handle();
	}, [init, navigate]);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-4">
			<LoadingSpinner size="lg" />
			<p className="text-sm text-[hsl(215_20%_55%)]">Signing you in…</p>
		</div>
	);
}
