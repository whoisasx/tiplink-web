import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLink } from "@/api/link";
import type { CreateLinkRequest } from "@/types/link";

export function useCreateLink() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (req: CreateLinkRequest) => createLink(req),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["links"] });
		},
	});
}
