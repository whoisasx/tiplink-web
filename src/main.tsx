import { StrictMode, useEffect, useRef, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
	PhantomWalletAdapter,
	SolflareWalletAdapter,
	CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./index.css";
import App from "./App.tsx";
import { useAuthStore } from "@/store/auth.store";

const SOLANA_RPC_ENDPOINT =
	import.meta.env.VITE_SOLANA_RPC_URL ??
	"https://api.mainnet-beta.solana.com";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

/** Boots auth state before rendering children by attempting a silent token refresh. */
function AuthBootstrap({ children }: { children: React.ReactNode }) {
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

/** Provides Solana connection + wallet adapter context */
function SolanaProviders({ children }: { children: React.ReactNode }) {
	const wallets = useMemo(
		() => [
			new PhantomWalletAdapter(),
			new SolflareWalletAdapter(),
			new CoinbaseWalletAdapter(),
		],
		[],
	);

	return (
		<ConnectionProvider endpoint={SOLANA_RPC_ENDPOINT}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<SolanaProviders>
				<AuthBootstrap>
					<App />
				</AuthBootstrap>
				<Toaster richColors position="top-right" closeButton />
			</SolanaProviders>
		</QueryClientProvider>
	</StrictMode>,
);
