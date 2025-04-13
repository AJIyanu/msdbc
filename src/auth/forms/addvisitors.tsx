"use client";

import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  //   CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  //   FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

export default function SundaySchoolVisitorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation schema
  const formSchema = z.object({
    date: z.date({
      required_error: "Date is required",
    }),
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    middlename: z.string().optional(),
    sex: z.enum(["male", "female"], {
      required_error: "Please select your gender",
    }),
    phonenumber: z.string().min(1, "Phone number is required"),
    address: z.string().optional(),
  });

  const form = useForm({
    defaultValues: {
      date: new Date(),
      firstname: "",
      lastname: "",
      middlename: "",
      sex: undefined,
      phonenumber: "",
      address: "",
    },
    resolver: zodResolver(formSchema),
  });

  interface FormValues {
    date: Date;
    firstname: string;
    lastname: string;
    middlename?: string;
    sex: "male" | "female" | undefined;
    phonenumber: string;
    address?: string;
  }

  async function onSubmit(values: FormValues): Promise<void> {
    try {
      setIsSubmitting(true);

      // Convert the sex field to boolean (male = true, female = false)
      const formattedValues = {
        ...values,
        male: values.sex === "male",
      };

      // Remove the sex field as it's not in your table schema
      delete formattedValues.sex;

      const { error } = await supabase
        .from("sun_sch_visitor_record")
        .insert(formattedValues);

      if (error?.code === "23505") {
        toast.error("Visitor already exists", {
          description: "This visitor has already been registered.",
        });
        return;
      }

      if (error) throw error;

      toast("Visitor recorded successfully!", {
        description: `${values.firstname} ${values.lastname} has been added to the system.`,
      });

      // Reset form
      form.reset({
        date: new Date(),
        firstname: "",
        lastname: "",
        middlename: "",
        sex: undefined,
        phonenumber: "",
        address: "",
      });
    } catch (error) {
      toast.error("Error saving visitor", {
        description: "Something went wrong. Please try again.",
      });
      console.error("Error saving visitor:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto border-none">
      <CardHeader>
        <CardTitle>Sunday School Visitor Form</CardTitle>
        <CardDescription>
          Register a new visitor to the Sunday School program
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Visit Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="pl-3 text-left font-normal flex justify-between items-center"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="middlename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Middle name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Sex</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phonenumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter address here"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Visitor"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
