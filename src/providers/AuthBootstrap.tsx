import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
	const init = useAuthStore((s) => s.init);
	// StrictMode mounts effects twice in development. Without this guard both
	// invocations race to call /auth/refresh. The backend rotates the token on
	// every refresh, so the second call hits an already-revoked token, fails,
	// and sets status → "unauthenticated", causing an immediate redirect to /login.
	const ranRef = useRef(false);

	useEffect(() => {
		if (ranRef.current) return;
		ranRef.current = true;
		void init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <>{children}</>;
}
