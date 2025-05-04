import { z } from "zod";

// Schema for a single donor
const donorSchema = z.object({
  donator: z.string().min(1, "Donor name is required"),
  amount_promised: z.string().min(1, "Amount promised is required"),
  currency: z.enum(["naira", "usd", "cad", "euro", "pounds"]).default("naira"),
  paid_status: z.boolean().default(false),
  amount_received: z.string().default("0"),
});

// Schema for the entire donations form
export const donationsFormSchema2 = z.object({
  project: z.string().min(1, "Project title is required"),
  date_received: z.date({
    required_error: "Date received is required",
  }),
  donors: z.array(donorSchema).min(1, "At least one donor is required"),
});

export type DonorFormValues = z.infer<typeof donorSchema>;

// Schema for database insertion
export const donationInsertSchema = z.object({
  project: z.string(),
  date_received: z.date(),
  donator: z.string(),
  amount_promised: z.number(),
  currency: z.enum(["naira", "usd", "cad", "euro", "pounds"]),
  paid_status: z.boolean(),
  amount_received: z.number(),
  payment_breakdown: z
    .array(
      z.object({
        date: z.date(),
        amount: z.number(),
      })
    )
    .default([]),
});

// Zod schema for the entire form, including an array of donors
export const donationsFormSchema = z.object({
  project: z.string(),
  date_received: z.date(),
  donors: z.array(
    z.object({
      // Schema for a single donor
      donator: z.string(),
      amount_promised: z.string(), // Changed to string to match your form default,  consider using bigint and changing the default
      currency: z.enum(["naira", "usd", "cad", "euro", "pounds"]),
      paid_status: z.boolean(),
      amount_received: z.string(), // Changed to string to match your form default, consider using bigint and changing the default
    })
  ),
});

export type DonationsFormValues = z.infer<typeof donationsFormSchema>;
export type DonationInsert = z.infer<typeof donationInsertSchema>;
