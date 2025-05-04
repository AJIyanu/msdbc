import { z } from "zod";

export const developmentFundSchema = z.object({
  date_received: z.date({
    required_error: "Date received is required",
  }),
  amount_received: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0;
      },
      {
        message: "Amount must be a positive number",
      }
    ),
});

export type DevelopmentFundFormValues = z.infer<typeof developmentFundSchema>;

export const developmentFundInsertSchema = z.object({
  date_received: z.date(),
  project: z.string().default("general"),
  donator: z.string().default("church offering"),
  amount_promised: z.number().default(0),
  paid_status: z.boolean().default(true),
  amount_received: z.number(),
  currency: z.string().default("naira"),
  payment_breakdown: z
    .array(
      z.object({
        date: z.date(),
        amount: z.number(),
      })
    )
    .default([]),
});

export type DevelopmentFundInsert = z.infer<typeof developmentFundInsertSchema>;
