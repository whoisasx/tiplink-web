import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./index.css";
import App from "./App.tsx";
import { AuthBootstrap } from "@/providers/AuthBootstrap";
import { SolanaProviders } from "@/providers/SolanaProviders";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

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
