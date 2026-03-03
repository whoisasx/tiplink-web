import { useQuery } from "@tanstack/react-query";
import { getTransactions, getTransaction } from "@/api/wallet";
import type { TransactionFilterQuery } from "@/types/wallet";

export function useTransactions(query: TransactionFilterQuery = {}) {
	return useQuery({
		queryKey: ["wallet", "transactions", query],
		queryFn: () => getTransactions(query),
		placeholderData: (prev) => prev, // Keep previous data during page changes
		staleTime: 30 * 1000,
	});
}

export function useTransaction(id: string) {
	return useQuery({
		queryKey: ["wallet", "transaction", id],
		queryFn: () => getTransaction(id),
		enabled: !!id,
		staleTime: 60 * 1000,
	});
}
