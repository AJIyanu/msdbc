"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// import { addStudent } from "./actions/student";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
// import { revalidatePath } from "next/cache";
import { toast } from "sonner";

const studentSchema = z.object({
  surname: z.string().min(1, "Surname is required"),
  firstname: z.string().min(1, "First name is required"),
  middlename: z.string().optional(),
  sex: z.enum(["male", "female"], {
    required_error: "Please select a gender",
  }),
  active: z.boolean().default(true).optional(),
  class: z.string().optional(),
});

const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface AddStudentFormProps {
  onSuccess?: () => void;
}

function formatName(name: string | undefined): string {
  if (!name) {
    return "";
  }

  // Trim leading and trailing whitespace
  const trimmedName = name.trim();

  if (trimmedName === "") {
    return "";
  }

  // Capitalize the first letter and lowercase the rest
  const capitalizedName =
    trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1).toLowerCase();

  return capitalizedName;
}

export default function AddStudentForm({ onSuccess }: AddStudentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      surname: "",
      firstname: "",
      middlename: "",
      sex: undefined,
      active: true,
      class: "",
    },
  });

  async function onSubmit(studentData: StudentFormValues) {
    setIsSubmitting(true);

    try {
      // const formData = new FormData();
      // formData.append("surname", data.surname);
      // formData.append("firstname", data.firstname);
      // if (data.middlename) formData.append("middlename", data.middlename);
      // formData.append("sex", data.sex);
      // formData.append("active", data.active ? "on" : "off");
      // if (data.class) formData.append("class", data.class);

      const formData = {
        ...studentData,
        surname: formatName(studentData.surname),
        firstname: formatName(studentData.firstname),
        middlename: formatName(studentData.middlename),
        class: formatName(studentData.class),
        male: studentData.sex === "male",
      };

      delete (formData as Partial<typeof formData>).sex;

      const { error } = await supabase
        .from("sundayschoolstudent")
        .insert([formData]);

      if (error) throw error;

      // revalidatePath("/");

      if (!error) {
        toast("Success", {
          description: "Student added successfully",
        });
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast("Error", {
          description: "Failed to add student",
        });
      }
    } catch (error) {
      toast("Error", {
        description: "An unexpected error occurred",
      });
      console.error("Error adding student:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surname</FormLabel>
              <FormControl>
                <Input placeholder="Enter surname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="middlename"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter middle name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sex</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="class"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter class" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active</FormLabel>
                <FormDescription>
                  Is this student currently active?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Student"}
        </Button>
      </form>
    </Form>
  );
}
