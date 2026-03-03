import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyLinks, lookupLink, cancelLink } from "@/api/link";
import type { MyLinksQuery } from "@/types/link";

export function useLinks(query: MyLinksQuery = {}) {
	return useQuery({
		queryKey: ["links", query],
		queryFn: () => getMyLinks(query),
		placeholderData: (prev) => prev,
		staleTime: 30 * 1000,
	});
}

export function useLookupLink(token: string | undefined) {
	return useQuery({
		queryKey: ["link", "public", token],
		queryFn: () => lookupLink(token!),
		enabled: !!token,
		staleTime: 10 * 1000,
		retry: false,
	});
}

export function useCancelLink() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: cancelLink,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["links"] });
		},
	});
}
