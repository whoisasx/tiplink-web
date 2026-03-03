import { create } from "zustand";
import type { UserProfile } from "@/types/user";
import * as authApi from "@/api/auth";
import * as userApi from "@/api/user";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthStore {
	jwt: string | null;
	user: UserProfile | null;
	status: AuthStatus;

	/** Called once at app boot; tries to exchange the refresh_token cookie for a JWT */
	init: () => Promise<void>;
	/** Called after OAuth callback; sets the JWT then fetches the user profile */
	applyNewJwt: (token: string) => Promise<void>;
	/** Hard logout: clears state + revokes refresh token on server */
	logout: () => Promise<void>;
	/** Internal: set JWT directly (used by 401 interceptor) */
	_setJwt: (token: string) => void;
}

// Module-level singleton so concurrent init() calls share one in-flight request
// instead of racing and triggering two token rotations.
let _initPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthStore>((set, get) => ({
	jwt: null,
	user: null,
	status: "loading",

	init: () => {
		// If already in-flight, return the same promise — don't make a second request.
		if (_initPromise) return _initPromise;

		// If we're already authenticated (e.g. AuthBootstrap already ran init()
		// and rotated the refresh token), skip — a second call would hit an
		// already-consumed token and incorrectly set status → "unauthenticated".
		const { status, jwt } = get();
		if (status === "authenticated" && jwt) return Promise.resolve();

		_initPromise = (async () => {
			set({ status: "loading" });
			let jwt: string;
			try {
				jwt = await authApi.refreshToken();
			} catch {
				// No valid refresh token — user is genuinely logged out.
				set({ jwt: null, user: null, status: "unauthenticated" });
				syncJwtToWindow(null);
				_initPromise = null;
				return;
			}
			// JWT is valid — make the JWT available to axios immediately so the
			// profile request below can be authenticated.
			syncJwtToWindow(jwt);
			// Fetch user profile before flipping status; ProtectedRoute will keep
			// showing the loading spinner until both JWT + profile are ready.
			// A profile failure must NOT log the user out — stay authenticated.
			let user: UserProfile | null = null;
			try {
				user = await userApi.getCurrentUser();
			} catch {
				// Profile fetch failed (e.g. network hiccup). User stays authenticated.
			}
			set({ jwt, user, status: "authenticated" });
			_initPromise = null;
		})();

		return _initPromise;
	},

	applyNewJwt: async (token: string) => {
		syncJwtToWindow(token);
		try {
			const user = await userApi.getCurrentUser();
			set({ jwt: token, user, status: "authenticated" });
		} catch {
			set({ jwt: token, user: null, status: "authenticated" });
		}
	},

	logout: async () => {
		// Best-effort server-side revocation
		try {
			if (get().jwt) await authApi.logout();
		} catch {
			// ignore
		}
		set({ jwt: null, user: null, status: "unauthenticated" });
		syncJwtToWindow(null);
	},

	_setJwt: (token: string) => {
		syncJwtToWindow(token);
		set({ jwt: token });
	},
}));

/** Expose JWT on window so the axios request interceptor can read it without a circular import */
function syncJwtToWindow(jwt: string | null) {
	(window as unknown as Record<string, unknown>).__AUTH_JWT__ = jwt;
}
