"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, SaveIcon, UserCheckIcon, UsersIcon } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
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

// Define types for our data
type Student = {
  id: number;
  surname: string;
  firstname: string;
  middlename?: string;
  class: string;
};

type AttendanceRecord = {
  student_id: number;
  class: string;
  date: string;
};

interface AttendanceTableProps {
  students: Student[];
  classes: string[];
}
const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

export default function AttendanceTable({
  students,
  classes,
}: AttendanceTableProps) {
  //   const { toast } = useToast();

  // State for date selection
  const [date, setDate] = useState<Date>(new Date());
  const formattedDate = format(date, "yyyy-MM-dd");

  // State for class filter
  const [selectedClass, setSelectedClass] = useState<string>("all");

  // State for filtered students
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);

  // State for attendance records
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);

  // State for visitors count
  const [visitors, setVisitors] = useState<number>(0);

  // State for total present
  const [totalPresent, setTotalPresent] = useState<number>(0);

  // Filter students when class selection changes
  useEffect(() => {
    if (selectedClass === "all") {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(
        students.filter((student) => student.class === selectedClass)
      );
    }
  }, [selectedClass, students]);

  // Update total present whenever attendance or visitors change
  useEffect(() => {
    setTotalPresent(attendanceRecords.length + visitors);
  }, [attendanceRecords, visitors]);

  // Handle attendance status change
  const handleStatusChange = (checked: boolean, student: Student) => {
    if (checked) {
      // Add student to attendance records with the selected date
      setAttendanceRecords((prev) => [
        ...prev,
        {
          student_id: student.id,
          class: student.class,
          date: formattedDate,
        },
      ]);
    } else {
      // Remove student from attendance records
      setAttendanceRecords((prev) =>
        prev.filter((record) => record.student_id !== student.id)
      );
    }
  };

  // Handle visitors count change
  const handleVisitorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = Number.parseInt(e.target.value) || 0;
    setVisitors(count);
  };

  // Handle saving attendance records
  const handleSaveAttendance = async () => {
    // In a real application, this would save to a database or API
    const attendanceData = {
      date: formattedDate,
      presentStudents: attendanceRecords,
      visitors: visitors,
      totalPresent: totalPresent,
      class: selectedClass !== "all" ? selectedClass : "All Classes",
    };

    const { error } = await supabase
      .from("sundayschoolattendance")
      .insert(attendanceRecords);

    if (error) {
      console.error("Error saving attendance:", error);
      toast.error("Error saving attendance", {
        description: "An error occurred while saving attendance records.",
      });
    } else {
      toast.success("Attendance saved successfully", {
        description: `Attendance for ${attendanceData.class} on ${attendanceData.date} saved successfully.`,
      });
    }

    console.log("Saving attendance records:", attendanceData);

    // Show success toast
    // toast({
    //   title: "Attendance Saved",
    //   description: `Successfully saved attendance for ${attendanceData.date}: ${attendanceData.presentStudents.length} students and ${attendanceData.visitors} visitors.`,
    //   duration: 3000,
    // });
  };

  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);

      // Update all existing attendance records with the new date
      setAttendanceRecords((prev) =>
        prev.map((record) => ({
          ...record,
          date: format(newDate, "yyyy-MM-dd"),
        }))
      );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">
            Attendance Register
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className="flex gap-1 items-center px-3 py-1"
            >
              <UserCheckIcon className="h-4 w-4" />
              <span>Students: {attendanceRecords.length}</span>
            </Badge>
            <Badge
              variant="outline"
              className="flex gap-1 items-center px-3 py-1"
            >
              <UsersIcon className="h-4 w-4" />
              <span>Visitors: {visitors}</span>
            </Badge>
            <Badge variant="secondary" className="text-md px-3 py-1">
              Total Present: {totalPresent}
            </Badge>
            <Button
              onClick={handleSaveAttendance}
              className="ml-2"
              variant="default"
            >
              <SaveIcon className="h-4 w-4 mr-2" />
              Save Attendance
            </Button>
          </div>
        </div>

        <div className="flex flex-row items-center gap-4">
          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Date:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Class:</span>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((className) => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">S/N</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className="w-[100px] text-center">Present</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student, index) => (
              <TableRow key={student.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {student.surname} {student.firstname}{" "}
                  {student.middlename && student.middlename}
                </TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Switch
                      onCheckedChange={(checked) =>
                        handleStatusChange(checked, student)
                      }
                      checked={attendanceRecords.some(
                        (record) => record.student_id === student.id
                      )}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/30">
              <TableCell colSpan={2} className="font-medium">
                Visitors
              </TableCell>
              <TableCell colSpan={1}></TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Input
                    id="visitors"
                    type="number"
                    min="0"
                    value={visitors}
                    onChange={handleVisitorsChange}
                    className="w-20 text-center"
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>

      {/* <CardFooter className="flex flex-col items-start">
        <h3 className="text-sm font-semibold mb-2">
          Attendance Records Preview
        </h3>
        <div className="bg-muted p-4 rounded-md overflow-auto max-h-40 w-full text-xs">
          <pre>{JSON.stringify(attendanceRecords, null, 2)}</pre>
        </div>
      </CardFooter> */}
    </Card>
  );
}
