"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

// Define the Zod schema for form validation
const offeringSchema = z.object({
  offeringTitle: z.string(),
  offeringAmount: z.coerce.number().min(0, "Amount must be a positive number"),
});

const formSchema = z.object({
  date: z.date({
    required_error: "Event date is required",
  }),
  programTitle: z
    .string()
    .min(2, "Program title must be at least 2 characters"),
  theme: z.string().min(2, "Theme must be at least 2 characters"),
  men: z.coerce.number().min(0, "Men count must be a positive number"),
  women: z.coerce.number().min(0, "Women count must be a positive number"),
  boys: z.coerce.number().min(0, "Boys count must be a positive number"),
  girls: z.coerce.number().min(0, "Girls count must be a positive number"),
  preacher: z.string().optional(),
  offerings: z.array(offeringSchema),
  // .default([{ offeringTitle: "Event Offering", offeringAmount: 0 }]),
});

type FormValues = z.infer<typeof formSchema>;

export function SpecialEventForm() {
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      men: 0,
      women: 0,
      boys: 0,
      girls: 0,
      offerings: [{ offeringTitle: "Event Offering", offeringAmount: 0 }],
    },
  });

  // Set up field array for dynamic offering fields
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "offerings",
  });

  // Calculate total attendance
  const calculateTotalAttendance = () => {
    const men = Number(form.watch("men")) || 0;
    const women = Number(form.watch("women")) || 0;
    const boys = Number(form.watch("boys")) || 0;
    const girls = Number(form.watch("girls")) || 0;

    return men + women + boys + girls;
  };

  // Calculate total offering
  const calculateTotalOffering = () => {
    const offerings = form.watch("offerings") || [];
    return offerings.reduce(
      (total, offering) => total + (Number(offering.offeringAmount) || 0),
      0
    );
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      // Calculate totals
      // const total = calculateTotalAttendance();
      const offeringTotal = calculateTotalOffering();

      // Prepare offering breakdown JSON
      const offeringBreakdown = data.offerings.map((offering) => ({
        offeringTitle: offering.offeringTitle,
        offeringAmount: offering.offeringAmount,
      }));

      // Insert data into Supabase
      const { error } = await supabase.from("specialevents").insert({
        date: data.date,
        program_title: data.programTitle,
        theme: data.theme,
        men: data.men,
        women: data.women,
        boys: data.boys,
        girls: data.girls,
        // total: total,
        preacher: data.preacher || null,
        offering_total: offeringTotal,
        offering_breakdown: offeringBreakdown,
      });

      if (error) {
        throw error;
      }

      toast("Special Event Created", {
        description: "Your special event has been successfully recorded.",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error", {
        description:
          "There was an error saving your special event. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${
                          !field.value ? "text-muted-foreground" : ""
                        }`}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select a date</span>
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Program Title Field */}
          <FormField
            control={form.control}
            name="programTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter program title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Theme Field */}
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter event theme"
                  className="min-h-[100px]"
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Attendance Fields */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Attendance</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="men"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Men</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
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
                      <Input type="number" min="0" {...field} />
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
                      <Input type="number" min="0" {...field} />
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
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4 text-right">
              <p className="text-sm text-muted-foreground">
                Total Attendance:{" "}
                <span className="font-medium">
                  {calculateTotalAttendance()}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preacher Field */}
        <FormField
          control={form.control}
          name="preacher"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preacher</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter preacher's name (optional)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Offerings Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Offerings</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ offeringTitle: "Event Offering", offeringAmount: 0 })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Offering
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-end"
              >
                <div className="md:col-span-7">
                  <FormField
                    control={form.control}
                    name={`offerings.${index}.offeringTitle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Offering Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:col-span-4">
                  <FormField
                    control={form.control}
                    name={`offerings.${index}.offeringAmount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:col-span-1 flex justify-end">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-10 w-10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-4 text-right">
              <p className="text-sm text-muted-foreground">
                Total Offering:{" "}
                <span className="font-medium">{calculateTotalOffering()}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Special Event"}
        </Button>
      </form>
    </Form>
  );
}
