"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Trash2, Plus } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

// Initialize Supabase client
const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

// Define offering item schema
const offeringItemSchema = z.object({
  offeringTitle: z.string().min(1, "Offering title is required"),
  amount: z.number().min(0, "Amount must be a positive number"),
});

// Define form schema
const formSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  offerings: z
    .array(offeringItemSchema)
    .min(1, "At least one offering is required"),
});

type PayloadType = {
  date: Date;
  amount: number;
  breakdown: {
    offeringTitle: string;
    amount: number;
  }[];
};

type FormValues = z.infer<typeof formSchema>;

type SundayOfferingFormProps = {
  defaultValues?: Partial<PayloadType>;
  offId?: string;
  onSuccess?: () => void;
};

export function SundayOfferingForm({
  defaultValues,
  offId,
  onSuccess,
}: SundayOfferingFormProps) {
  console.log("SundayOfferingForm rendered with defaultValues:", defaultValues);

  // const formCompatibleDefaults = {
  //   offerings: defaultValues?.breakdown,
  //   ...defaultValues,
  // };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      offerings: defaultValues?.breakdown ?? [
        { offeringTitle: "General", amount: 0 },
      ],
      ...defaultValues,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total offering amount
  const totalOffering = form
    .watch("offerings")
    .reduce((total, offering) => total + (offering.amount || 0), 0);

  // Add new offering row
  const addOfferingRow = () => {
    const currentOfferings = form.getValues("offerings");
    form.setValue("offerings", [
      ...currentOfferings,
      { offeringTitle: "", amount: 0 },
    ]);
  };

  // Remove offering row
  const removeOfferingRow = (index: number) => {
    const currentOfferings = form.getValues("offerings");
    if (currentOfferings.length > 1) {
      form.setValue(
        "offerings",
        currentOfferings.filter((_, i) => i !== index)
      );
    }
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      const breakdown = data.offerings.map((offering) => ({
        offeringTitle: offering.offeringTitle,
        amount: offering.amount,
      }));

      const totalAmount = data.offerings.reduce(
        (sum, offering) => sum + offering.amount,
        0
      );

      const payload = {
        date: format(data.date, "yyyy-MM-dd"),
        amount: totalAmount,
        breakdown: breakdown,
      };

      let response;

      if (defaultValues && offId) {
        response = await supabase
          .from("sundayofffering")
          .update(payload)
          .eq("id", offId);
      } else {
        response = await supabase.from("sundayofffering").insert(payload);
      }

      const { error } = response;

      if (error) {
        throw new Error(error.message);
      }

      toast("Offering recorded successfully", {
        description: `Total amount: ₦${totalAmount}`,
      });

      // Reset form to default values
      if (!defaultValues) {
        form.reset({
          date: new Date(),
          offerings: [{ offeringTitle: "General", amount: 0 }],
        });
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast("Error saving offering", {
        description: "Failed to save offering. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto lg:mx-0">
      <CardHeader>
        <CardTitle>Sunday Offering</CardTitle>
        <CardDescription>Record the Sunday offering collection</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full md:w-[240px] pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="text-lg font-medium">Offerings</div>
              {form.watch("offerings").map((_, index) => (
                <div key={index} className="flex items-end gap-3">
                  <FormField
                    control={form.control}
                    name={`offerings.${index}.offeringTitle`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Offering Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`offerings.${index}.amount`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Amount (₦)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value) || 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mb-2"
                    onClick={() => removeOfferingRow(index)}
                    disabled={form.watch("offerings").length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOfferingRow}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Offering
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-md bg-slate-50">
              <span className="font-medium">Total Offering</span>
              <span className="text-xl font-bold">
                ₦{totalOffering.toFixed(2)}
              </span>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? offId
                  ? "Updating..."
                  : "Saving..."
                : offId
                ? "Update Offering"
                : "Save Offering"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
