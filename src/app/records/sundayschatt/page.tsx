import AttendanceTable from "@/components/sundayschatt_table";
// import { restfulClient } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
// import { useState } from "react";
import AddStudentForm from "@/auth/forms/addstudentform";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import SundaySchoolVisitorForm from "@/auth/forms/addvisitors";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample data that would typically come from a database

const students = [
  { id: 1, surname: "Smith", firstname: "John", class: "JSS 1" },
  {
    id: 2,
    surname: "Johnson",
    firstname: "Mary",
    middlename: "Elizabeth",
    class: "JSS 1",
  },
  { id: 3, surname: "Williams", firstname: "Robert", class: "JSS 2" },
  { id: 4, surname: "Brown", firstname: "Patricia", class: "JSS 2" },
  { id: 5, surname: "Jones", firstname: "Michael", class: "JSS 3" },
  {
    id: 6,
    surname: "Miller",
    firstname: "Linda",
    middlename: "Susan",
    class: "JSS 3",
  },
  { id: 7, surname: "Davis", firstname: "James", class: "SSS 1" },
  { id: 8, surname: "Garcia", firstname: "Jennifer", class: "SSS 1" },
  { id: 9, surname: "Rodriguez", firstname: "David", class: "SSS 2" },
  { id: 10, surname: "Wilson", firstname: "Elizabeth", class: "SSS 3" },
];

// Extract unique classes for the filter dropdown
export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const { data, error } = await supabase
    .from("sundayschoolstudent")
    .select("*");

  if (error) {
    console.error("Error fetching students:", error);
    return <div>Error loading students. Please try again later.</div>;
  }
  const classes = Array.from(new Set(data.map((student) => student.class)));

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-6">Class Attendance</h1>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add New Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Sunday School Student</DialogTitle>
                <DialogDescription>
                  Enter the student&apos;s information to add them to the
                  database.
                </DialogDescription>
              </DialogHeader>
              <AddStudentForm />
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Visitor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <SundaySchoolVisitorForm />
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <AttendanceTable students={data || students} classes={classes} />
    </main>
  );
}
