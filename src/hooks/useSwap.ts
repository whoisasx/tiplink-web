import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSwapQuote, executeSwap, getSwapHistory } from "@/api/swap";
import type {
	SwapQuoteQuery,
	SwapExecuteRequest,
	SwapHistoryQuery,
} from "@/types/swap";

export function useSwapQuote(query: SwapQuoteQuery | null) {
	return useQuery({
		queryKey: ["swap", "quote", query],
		queryFn: () => getSwapQuote(query!),
		enabled: !!query && query.amount > 0,
		staleTime: 10 * 1000, // quotes expire quickly
		retry: false,
	});
}

export function useExecuteSwap() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (req: SwapExecuteRequest) => executeSwap(req),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ["wallet", "balances"],
			});
			void queryClient.invalidateQueries({
				queryKey: ["wallet", "transactions"],
			});
			void queryClient.invalidateQueries({
				queryKey: ["swap", "history"],
			});
		},
	});
}

export function useSwapHistory(query: SwapHistoryQuery = {}) {
	return useQuery({
		queryKey: ["swap", "history", query],
		queryFn: () => getSwapHistory(query),
		placeholderData: (prev) => prev,
		staleTime: 30 * 1000,
	});
}
