"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Initialize Supabase client
const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

// Define the form schema with Zod
const formSchema = z.object({
  title: z.string().optional(),
  date: z.date({
    required_error: "Service date is required",
  }),
  day: z.string({
    required_error: "Day of week is required",
  }),
  anchor: z.string({
    required_error: "Anchor name is required",
  }),
  time_started: z.string().optional(),
  time_ended: z.string().optional(),
  first_offering: z.number(),
  second_offering: z.number(),
  third_offering: z.number(),
  men: z.number(),
  women: z.number(),
  girls: z.number(),
  boys: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

export function MidweekServiceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [attendanceTotal, setAttendanceTotal] = useState(0);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      day: "Monday",
      anchor: "",
      time_started: "18:00",
      time_ended: "19:00",
      first_offering: 0,
      second_offering: 0,
      third_offering: 0,
      men: 0,
      women: 0,
      girls: 0,
      boys: 0,
    },
  });

  // Watch the offering fields to calculate total
  const firstOffering = form.watch("first_offering") || 0;
  const secondOffering = form.watch("second_offering") || 0;
  const thirdOffering = form.watch("third_offering") || 0;

  // Watch the attendance fields to calculate total
  const men = form.watch("men") || 0;
  const women = form.watch("women") || 0;
  const girls = form.watch("girls") || 0;
  const boys = form.watch("boys") || 0;

  // Calculate total whenever offerings change
  useEffect(() => {
    setTotal(firstOffering + secondOffering + thirdOffering);
  }, [firstOffering, secondOffering, thirdOffering]);

  useEffect(() => {
    setAttendanceTotal(men + women + girls + boys);
  }, [men, women, girls, boys]);

  // Handle form submission
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      // Format the data for Supabase
      const formattedData = {
        ...data,
        // Ensure date is in the correct format for PostgreSQL
        date: format(data.date, "yyyy-MM-dd"),
        // time_started and time_ended are already in the correct format for PostgreSQL time
      };

      // Insert data into Supabase
      const { error } = await supabase
        .from("midweekservice")
        .insert([formattedData]);

      // Simulate an error for testing purposes
      //error = new Error("Simulated Supabase error");

      if (error) throw error;

      toast("Service record created", {
        description: "The midweek service has been successfully recorded.",
      });

      // Reset form after successful submission
      form.reset({
        title: "",
        day: "Monday",
        anchor: "",
        time_started: "18:00", // Reset to default 6pm
        time_ended: "19:00", // Reset to default 7pm
        first_offering: 0,
        second_offering: 0,
        third_offering: 0,
        men: 0,
        women: 0,
        girls: 0,
        boys: 0,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast("Error", {
        description: "There was an error saving the service record.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl p-6 bg-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Title</FormLabel>
                <FormControl>
                  <Input placeholder="Bible Study..." {...field} />
                </FormControl>
                <FormDescription>
                  The title or name of the program (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Service Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day of Week</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Monday">Monday</SelectItem>
                      <SelectItem value="Tuesday">Tuesday</SelectItem>
                      <SelectItem value="Wednesday">Wednesday</SelectItem>
                      <SelectItem value="Thursday">Thursday</SelectItem>
                      <SelectItem value="Friday">Friday</SelectItem>
                      <SelectItem value="Saturday">Saturday</SelectItem>
                      <SelectItem value="Sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="anchor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anchor</FormLabel>
                <FormControl>
                  <Input placeholder="Pastor..." {...field} />
                </FormControl>
                <FormDescription>
                  The name of who anchored the program
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="time_started"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Started</FormLabel>
                  <div className="flex items-center">
                    <FormControl>
                      <Input type="time" placeholder="HH:MM" {...field} />
                    </FormControl>
                    <Clock className="ml-2 h-4 w-4 opacity-50" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time_ended"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Ended</FormLabel>
                  <div className="flex items-center">
                    <FormControl>
                      <Input type="time" placeholder="HH:MM" {...field} />
                    </FormControl>
                    <Clock className="ml-2 h-4 w-4 opacity-50" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormField
              control={form.control}
              name="men"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Men</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber || 0);
                      }}
                    />
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
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber || 0);
                      }}
                    />
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
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber || 0);
                      }}
                    />
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
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Display attendance total */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Attendance:</span>
              <span className="text-xl font-bold">{attendanceTotal}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              This total is calculated automatically and will be stored by the
              database.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="first_offering"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Offering</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="second_offering"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Second Offering</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="third_offering"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Third Offering</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Offering:</span>
              <span className="text-xl font-bold">{total}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              This total is calculated automatically and will be stored by the
              database.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Service Record"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
