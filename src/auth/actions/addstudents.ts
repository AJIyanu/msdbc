"use server";

import { createClient } from "@supabase/supabase-js";
import { studentSchema } from "../schema";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function addStudent(values: FormData) {
  const rawData = {
    surname: values.get("surname"),
    firstname: values.get("firstname"),
    middlename: values.get("middlename") || null,
    sex: values.get("sex"),
    active: values.get("active") === "on",
    class: values.get("class") || null,
  };

  // Validate the data
  const validationResult = studentSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  // Transform sex to male boolean value
  const studentData = {
    ...validationResult.data,
    male: validationResult.data.sex === "male",
  };

  // Remove the sex field as we're using male in the database
  delete (studentData as any).sex;

  try {
    const { error } = await supabase
      .from("sundayschoolstudent")
      .insert([studentData]);

    if (error) throw error;

    revalidatePath("/");
    return {
      success: true,
      message: "Student added successfully",
    };
  } catch (error) {
    console.error("Error adding student:", error);
    return {
      success: false,
      message: "Failed to add student",
    };
  }
}
