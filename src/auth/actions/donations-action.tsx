"use server";

import { revalidatePath } from "next/cache";

import {
  developmentFundInsertSchema,
  type DevelopmentFundFormValues,
} from "@/lib/schemas/building-offering";
import {
  donationInsertSchema,
  type DonationsFormValues,
} from "@/lib/schemas/donations";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { cookies } from "next/headers";

// Initialize Supabase client
const supabase = createServerComponentClient({ cookies });

export async function createDevelopmentFundEntry(
  formData: DevelopmentFundFormValues
) {
  try {
    // Prepare data with defaults for Sunday development offering
    const data = developmentFundInsertSchema.parse({
      date_received: formData.date_received,
      project: "general",
      donator: "church offering",
      amount_promised: 0,
      paid_status: true,
      amount_received: parseInt(formData.amount_received),
      currency: "naira",
      payment_breakdown: [
        {
          date: formData.date_received,
          amount: parseInt(formData.amount_received),
        },
      ],
    });

    // Insert data into Supabase
    const { error } = await supabase.from("developmentfund").insert({
      date_received: data.date_received.toISOString(),
      project: data.project,
      donator: data.donator,
      amount_promised: Number(data.amount_promised),
      paid_status: data.paid_status,
      amount_received: Number(data.amount_received),
      currency: data.currency,
      payment_breakdown: data.payment_breakdown.map((item) => ({
        date: item.date.toISOString(),
        amount: Number(item.amount),
      })),
    });

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(
        `Failed to create development fund entry: ${error.message}`
      );
    }

    // Revalidate the development fund page
    revalidatePath("/development-fund");

    return { success: true };
  } catch (error) {
    console.error("Error creating development fund entry:", error);
    throw error;
  }
}

export async function createDonationEntries(formData: DonationsFormValues) {
  try {
    const entries = formData.donors.map((donor) => {
      // Prepare data for each donor
      const data = donationInsertSchema.parse({
        date_received: formData.date_received,
        project: formData.project,
        donator: donor.donator,
        amount_promised: Number(donor.amount_promised || "0"),
        paid_status: donor.paid_status,
        amount_received: Number(donor.amount_received || "0"),
        currency: donor.currency,
        payment_breakdown: [
          {
            date: formData.date_received,
            amount: Number(donor.amount_received || "0"),
          },
        ],
      });

      return {
        date_received: data.date_received.toISOString(),
        project: data.project,
        donator: data.donator,
        amount_promised: Number(data.amount_promised),
        paid_status: data.paid_status,
        amount_received: Number(data.amount_received),
        currency: data.currency,
        payment_breakdown: data.payment_breakdown.map((item) => ({
          date: item.date.toISOString(),
          amount: Number(item.amount),
        })),
      };
    });

    // Insert all entries into Supabase
    const { error } = await supabase.from("developmentfund").insert(entries);

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to create donation entries: ${error.message}`);
    }

    // Revalidate the development fund page
    revalidatePath("/development-fund");

    return { success: true };
  } catch (error) {
    console.error("Error creating donation entries:", error);
    throw error;
  }
}
