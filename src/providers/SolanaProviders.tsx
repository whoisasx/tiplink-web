import { useMemo } from "react";
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

const SOLANA_RPC_ENDPOINT =
	import.meta.env.VITE_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

export function SolanaProviders({ children }: { children: React.ReactNode }) {
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
