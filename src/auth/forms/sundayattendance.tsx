"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the form schema with Zod
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
  sermonByIsVisitor: z.boolean().default(false).optional(),
  sermonBy: z.string().nullable(),
  sermonText: z
    .string()
    .min(1, {
      message: "Sermon text/scripture reference is required.",
    })
    .max(255, {
      message:
        "Sermon text/scripture reference must be less than 255 characters.",
    }),
  sermonTopic: z.string().min(1, {
    message: "Sermon topic is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SundayAttendanceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  // Mock current user UUID - in a real app, this would come from your auth system
  const currentUserUuid = "123e4567-e89b-12d3-a456-426614174000";

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      men: 0,
      women: 0,
      boys: 0,
      girls: 0,
      visitors: 0,
      sermonByIsVisitor: false,
      sermonBy: "",
      sermonText: "",
      sermonTopic: "",
    },
  });

  // Watch for changes to the sermonByIsVisitor field
  const sermonByIsVisitor = form.watch("sermonByIsVisitor");

  // When sermonByIsVisitor changes to true, set sermonBy to null
  useEffect(() => {
    if (sermonByIsVisitor) {
      form.setValue("sermonBy", null);
    }
  }, [sermonByIsVisitor, form]);

  // Form submission handler
  async function onSubmit(formData: FormValues) {
    try {
      setIsSubmitting(true);

      // Add the automatic fields
      const submissionData = {
        ...formData,
        // recordedBy: currentUserUuid,
        createdAt: new Date().toISOString(),
        // Calculate total attendance
        // total: data.men + data.women + data.boys + data.girls + data.visitors,
      };

      // Here you would typically send the data to your API
      console.log("Submitting data:", submissionData);

      // Simulate API call
      const { data, error } = await supabase
        .schema('"Church Attendance Record"')
        .from('"Sunday Service"')
        .insert(submissionData);

      if (data) {
        toast("Attendance recorded successfully", {
          description: "The Sunday attendance record has been saved.",
        });
        console.log("Data inserted:", data);
      } else if (error) {
        toast("An Error Occurred", {
          description: error.message,
        });
        console.error("Error inserting data:", error);
      }

      // Reset the form
      form.reset();

      // Optionally redirect to another page
      // router.push('/dashboard')
    } catch (error) {
      console.error("Error submitting form:", error);
      toast("Error", {
        description: "There was a problem saving the attendance record.",
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
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="sermonByIsVisitor"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Visitor Speaker</FormLabel>
                    <FormDescription>
                      Toggle if the sermon was given by a visitor
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sermonBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sermon By</FormLabel>
                  <FormControl>
                    <Select
                      disabled={sermonByIsVisitor}
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select speaker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="123e4567-e89b-12d3-a456-426614174000">
                          Pastor John Doe
                        </SelectItem>
                        <SelectItem value="223e4567-e89b-12d3-a456-426614174001">
                          Elder Jane Smith
                        </SelectItem>
                        <SelectItem value="323e4567-e89b-12d3-a456-426614174002">
                          Deacon Michael Johnson
                        </SelectItem>
                        <SelectItem value="423e4567-e89b-12d3-a456-426614174003">
                          Rev. Sarah Williams
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="sermonText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sermon Text</FormLabel>
                <FormControl>
                  <Input placeholder="Enter scripture reference" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the scripture reference (e.g., John 3:16)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sermonTopic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sermon Topic</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter sermon topic and details"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Attendance Record"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
