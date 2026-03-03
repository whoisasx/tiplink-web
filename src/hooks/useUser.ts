import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/user";

export function useUser() {
	return useQuery({
		queryKey: ["user"],
		queryFn: getCurrentUser,
		staleTime: 5 * 60 * 1000, // 5 min
	});
}
