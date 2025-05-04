"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

import {
  developmentFundSchema,
  type DevelopmentFundFormValues,
} from "@/lib/schemas/building-offering";
import { createDevelopmentFundEntry } from "@/auth/actions/donations-action";
import { DonationsForm } from "./donationsform";

export function DevelopmentFundForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DevelopmentFundFormValues>({
    resolver: zodResolver(developmentFundSchema),
    defaultValues: {
      date_received: new Date(),
      amount_received: "",
    },
  });

  async function onSubmit(data: DevelopmentFundFormValues) {
    try {
      setIsSubmitting(true);

      // Pass amount as string
      const formattedData = {
        ...data,
        amount_received: data.amount_received,
      };

      await createDevelopmentFundEntry(formattedData);

      toast.success("Development fund entry saved successfully");
      form.reset({
        date_received: new Date(),
        amount_received: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save development fund entry");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Sunday Development Offering</CardTitle>
          <CardDescription>
            Record the development offering collected during Sunday service.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="date_received"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Received</FormLabel>
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The date when the offering was collected.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount_received"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Received (Naira)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The total amount collected in the offering.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Offering"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <DonationsForm />
    </div>
  );
}
