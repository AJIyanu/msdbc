"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import {
  donationsFormSchema,
  type DonationsFormValues,
} from "@/lib/schemas/donations";
import { createDonationEntries } from "@/auth/actions/donations-action";

export function DonationsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");

  const form = useForm<DonationsFormValues>({
    resolver: zodResolver(donationsFormSchema),
    defaultValues: {
      project: "",
      date_received: new Date(),
      donors: [
        {
          donator: "",
          amount_promised: "0", // Changed to "0" to match the string type in the schema
          currency: "naira",
          paid_status: false,
          amount_received: "0", // Changed to "0" to match the string type in the schema
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "donors",
  });

  // Watch paid_status to update amount_received
  const watchedDonors = form.watch("donors");

  // Update amount_received when paid_status changes
  const handlePaidStatusChange = (index: number, value: boolean) => {
    if (value) {
      const amountPromised = form.getValues(`donors.${index}.amount_promised`);
      if (amountPromised) {
        form.setValue(`donors.${index}.amount_received`, amountPromised);
      }
    }
  };

  const handleShowForm = () => {
    if (projectTitle.trim()) {
      form.setValue("project", projectTitle);
      setIsFormVisible(true);
    }
  };

  async function onSubmit(data: DonationsFormValues) {
    try {
      setIsSubmitting(true);

      // Submit the form data as-is; conversion is handled in the action
      await createDonationEntries(data);

      toast.success("Donations saved successfully");
      form.reset({
        project: "",
        date_received: new Date(),
        donors: [
          {
            donator: "",
            amount_promised: "",
            currency: "naira",
            paid_status: false,
            amount_received: "0",
          },
        ],
      });
      setProjectTitle("");
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save donations");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Donations</CardTitle>
        <CardDescription>
          Record donations for specific projects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isFormVisible ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="project-title"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Project Title
              </label>
              <Input
                id="project-title"
                className="mt-2"
                placeholder="Enter project title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />
            </div>
            <Button
              type="button"
              onClick={handleShowForm}
              disabled={!projectTitle.trim()}
            >
              Add Donations
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="project"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter project title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        The date when the donations were received.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div className="text-lg font-medium">Donors</div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border rounded-lg space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Donor {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove donor</span>
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`donors.${index}.donator`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Donor Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter donor name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`donors.${index}.amount_promised`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount Promised</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="Enter amount promised"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name={`donors.${index}.currency`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="naira">Naira</SelectItem>
                                <SelectItem value="usd">USD</SelectItem>
                                <SelectItem value="cad">CAD</SelectItem>
                                <SelectItem value="euro">Euro</SelectItem>
                                <SelectItem value="pounds">Pounds</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`donors.${index}.paid_status`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Paid Status</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={(value) => {
                                    field.onChange(value);
                                    handlePaidStatusChange(index, value);
                                  }}
                                />
                              </FormControl>
                              <span className="text-sm text-muted-foreground">
                                {field.value ? "Paid" : "Not Paid"}
                              </span>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`donors.${index}.amount_received`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount Received</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="Enter amount received"
                                disabled={watchedDonors[index]?.paid_status}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    append({
                      donator: "",
                      amount_promised: "",
                      currency: "naira",
                      paid_status: false,
                      amount_received: "0",
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Donor
                </Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormVisible(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Donations"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
