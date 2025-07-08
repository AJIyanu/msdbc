"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Error from "next/error";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

const formSchema = z.object({
  men: z.coerce.number().int().min(0, {
    message: "Number of men must be a positive integer or zero.",
  }),
  women: z.coerce.number().int().min(0, {
    message: "Number of women must be a positive integer or zero.",
  }),
  boys: z.coerce.number().int().min(0, {
    message: "Number of boys must be a positive integer or zero.",
  }),
  girls: z.coerce.number().int().min(0, {
    message: "Number of girls must be a positive integer or zero.",
  }),
  visitors: z.coerce.number().int().min(0, {
    message: "Number of visitors must be a positive integer or zero.",
  }),
  date: z.date(),
});
type FormValues = z.infer<typeof formSchema>;

type SundayAttendanceFormProps = {
  defaultValues?: Partial<FormValues>;
  attId?: string;
};

export default function SundayAttendanceForm({
  defaultValues,
  attId,
}: SundayAttendanceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      men: 0,
      women: 0,
      boys: 0,
      girls: 0,
      visitors: 0,
      date: new Date(),
      ...defaultValues,
    },
  });

  async function onSubmit(formData: FormValues) {
    try {
      setIsSubmitting(true);

      const submissionData = {
        ...formData,
        created_at: new Date().toISOString(),
      };

      // console.log("Submitting data:", submissionData);

      let response;

      if (defaultValues && attId) {
        response = await supabase
          .from("sundayserviceattendance")
          .update(submissionData)
          .eq("id", attId);
      } else {
        response = await supabase
          .from("sundayserviceattendance")
          .insert(submissionData);
      }

      const { data, error } = response;

      if (!error || data) {
        toast("Attendance recorded successfully", {
          description: "The Sunday attendance record has been saved.",
        });
        // console.log("Data inserted:", data);
      } else if (error) {
        if (error.code === "23505") {
          toast("Attendance record already exists for this date", {
            description: "Please try updating the record instead.",
          });
        } else {
          toast("An Error Occurred", {
            description: error.message,
          });
          // console.error("Error inserting data:", error);
        }
      }
      if (!defaultValues) {
        form.reset();
      }
    } catch (error: unknown | Error) {
      // console.error("Error submitting form:", error);
      toast("Error saving attendance Record", {
        description:
          error instanceof Error
            ? (error as unknown as string)
            : "An unknown error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container max-w-[900px] py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="men"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Men</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="women"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Women</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="boys"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Boys</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="girls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Girls</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visitors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visitors</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("2025-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-start">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? attId
                  ? "Updating..."
                  : "Saving..."
                : attId
                ? "Update Attendance Record"
                : "Save Attendance Record"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
