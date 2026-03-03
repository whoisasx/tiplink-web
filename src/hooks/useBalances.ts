import { useQuery } from "@tanstack/react-query";
import { getAllBalances } from "@/api/wallet";

export function useBalances() {
	return useQuery({
		queryKey: ["wallet", "balances"],
		queryFn: getAllBalances,
		staleTime: 30 * 1000, // 30 seconds — balances update frequently
		refetchInterval: 60 * 1000, // auto-refresh every 60s
	});
}
