"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

const formSchema = z.object({
  date: z.date({
    required_error: "Sermon date is required",
  }),
  preacherId: z.string().uuid({
    message: "Please select a valid preacher",
  }),
  sermon_exist: z.boolean(),
  sermon_title: z.string().nullable().optional(),
  sermon_text: z.string().nullable().optional(),
  preacher_sign: z.boolean(),
});

export function SermonForm({
  preachers = [],
}: {
  preachers: { id: string; name: string }[];
}) {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sermon_exist: true,
      preacher_sign: true,
    },
  });

  const sermonExists = form.watch("sermon_exist");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    try {
      // If sermon doesn't exist, nullify the sermon fields
      if (!values.sermon_exist) {
        values.sermon_title = null;
        values.sermon_text = null;
      }
    } catch (error) {
      console.error(error);
      toast("Error", {
        description: "Failed to save the sermon. Please try again.",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    disabled={(date) => date < new Date("1900-01-01")}
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
          name="preacherId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preacher</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                >
                  <option value="">Select a preacher</option>
                  {preachers.map((preacher) => (
                    <option key={preacher.id} value={preacher.id}>
                      {preacher.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sermon_exist"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Sermon Exists</FormLabel>
                <FormDescription>
                  Toggle if a sermon was delivered on this date
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
          name="sermon_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sermon Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter sermon title"
                  {...field}
                  value={field.value || ""}
                  disabled={!sermonExists}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sermon_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sermon Text</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter sermon text or scripture reference"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                  disabled={!sermonExists}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preacher_sign"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Preacher Signature</FormLabel>
                <FormDescription>
                  Indicate if the preacher has signed off on this sermon
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

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Sermon"}
        </Button>
      </form>
    </Form>
  );
}
