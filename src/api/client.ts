import axios, {
	type AxiosRequestConfig,
	type InternalAxiosRequestConfig,
} from "axios";

const BASE_URL =
	(import.meta.env.VITE_API_URL as string | undefined) ??
	"http://localhost:8080";

export const apiClient = axios.create({
	baseURL: `${BASE_URL}/api`,
	withCredentials: true, // Send http-only refresh_token cookie
	headers: { "Content-Type": "application/json" },
});

// ─── Refresh-queue machinery ──────────────────────────────────────────────────
let isRefreshing = false;

interface QueueEntry {
	resolve: (token: string) => void;
	reject: (err: unknown) => void;
}
let failedQueue: QueueEntry[] = [];

function processQueue(error: unknown, token: string | null) {
	failedQueue.forEach((entry) => {
		if (error) entry.reject(error);
		else if (token) entry.resolve(token);
	});
	failedQueue = [];
}

// ─── Request interceptor: attach JWT ────────────────────────────────────────
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	// Dynamically import to avoid circular dependency
	const jwt = getStoredJwt();
	if (jwt) {
		config.headers.Authorization = `Bearer ${jwt}`;
	}
	return config;
});

// ─── Response interceptor: 401 → auto-refresh ───────────────────────────────
apiClient.interceptors.response.use(
	(res) => res,
	async (err: unknown) => {
		if (!axios.isAxiosError(err)) return Promise.reject(err);

		const originalRequest = err.config as
			| (AxiosRequestConfig & { _retry?: boolean })
			| undefined;

		// Never intercept the refresh endpoint itself — it uses a cookie, not a
		// JWT, so a 401 there means the session is genuinely expired. Let the
		// caller (init / manual refresh) handle it directly.
		const isRefreshUrl = originalRequest?.url?.includes("/auth/refresh");

		if (
			err.response?.status === 401 &&
			originalRequest &&
			!originalRequest._retry &&
			!isRefreshUrl
		) {
			if (isRefreshing) {
				return new Promise<string>((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						if (originalRequest.headers) {
							(
								originalRequest.headers as Record<
									string,
									string
								>
							).Authorization = `Bearer ${token}`;
						}
						return apiClient(originalRequest);
					})
					.catch(Promise.reject.bind(Promise));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				// Call refresh directly without interceptors to avoid infinite loop
				const { data } = await axios.get(
					`${BASE_URL}/api/auth/refresh`,
					{
						withCredentials: true,
					},
				);
				const newJwt: string = data?.result?.jwt_token;
				if (!newJwt) throw new Error("No JWT in refresh response");

				// Only update the JWT in the window/store. Do NOT call applyNewJwt
				// here — that internally calls getCurrentUser() via apiClient, which
				// would get a 401, queue behind isRefreshing=true, and deadlock.
				const { useAuthStore } = await import("@/store/auth.store");
				useAuthStore.getState()._setJwt(newJwt);

				processQueue(null, newJwt);

				if (originalRequest.headers) {
					(
						originalRequest.headers as Record<string, string>
					).Authorization = `Bearer ${newJwt}`;
				}
				return apiClient(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
				// Only force a logout when the refresh endpoint itself explicitly
				// rejected the token (401). Any other failure (network down, 5xx)
				// should NOT wipe the session — just let the original request fail.
				const is401 =
					axios.isAxiosError(refreshError) &&
					refreshError.response?.status === 401;
				if (is401) {
					const { useAuthStore } = await import("@/store/auth.store");
					await useAuthStore.getState().logout();
				}
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(err);
	},
);

// Lazy getter — reads JWT from the auth store without importing it at module load
function getStoredJwt(): string | null {
	try {
		// Access zustand store state directly without subscribing
		const rawStore = (window as unknown as Record<string, unknown>)
			.__AUTH_JWT__;
		return typeof rawStore === "string" ? rawStore : null;
	} catch {
		return null;
	}
}

export default apiClient;
