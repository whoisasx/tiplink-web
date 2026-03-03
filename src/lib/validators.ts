import { z } from "zod";

export const createLinkSchema = z.object({
	amount: z
		.number()
		.positive("Amount must be positive")
		.max(1_000_000, "Amount seems too large"),
	mint: z.string().optional(),
	note: z.string().max(200, "Note must be 200 characters or less").optional(),
	expiry_at: z.string().optional(),
});
export type CreateLinkFormData = z.infer<typeof createLinkSchema>;

export const claimLinkSchema = z.object({
	claimer_wallet: z
		.string()
		.min(32, "Invalid Solana address")
		.max(44, "Invalid Solana address")
		.regex(/^[1-9A-HJ-NP-Za-km-z]+$/, "Invalid Solana address (Base58)"),
});
export type ClaimLinkFormData = z.infer<typeof claimLinkSchema>;

export const sendTransactionSchema = z.object({
	to: z
		.string()
		.min(32, "Invalid Solana address")
		.max(44, "Invalid Solana address")
		.regex(/^[1-9A-HJ-NP-Za-km-z]+$/, "Invalid Solana address"),
	amount: z.number().positive("Amount must be positive"),
	mint: z.string().optional(),
});
export type SendTransactionFormData = z.infer<typeof sendTransactionSchema>;
