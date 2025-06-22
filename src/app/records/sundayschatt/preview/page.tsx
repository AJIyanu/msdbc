"use client";

import { useState, useEffect } from "react";
import { Check, X, Minus, Loader2, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import { getMockDataForPeriod } from "./mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Initialize Supabase client
const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

interface AttendanceRecord {
  student_id: string;
  name: string;
  class: string;
  totalPresent: number;
  [key: string]: string | number | boolean; // For dynamic date properties
}

interface AttendanceData {
  dates: string[];
  records: AttendanceRecord[];
  summary: {
    totalStudents: number;
    totalDates: number;
    totalAttendanceRecord: number;
  };
}

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [selectedQuarter, setSelectedQuarter] = useState<string>("First");

  const fetchAttendanceData = async (year?: string, quarter?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use mock data with simulated filtering
      //   const filteredData = getMockDataForPeriod(
      //     year || selectedYear,
      //     quarter || selectedQuarter
      //   );
      //   setAttendanceData(filteredData);

      // Comment out Supabase function call - when ready to use real API:
      const { data, error: functionError } = await supabase.functions.invoke(
        "structuredattendance",
        {
          body: JSON.stringify({
            year: year || selectedYear,
            quarter: quarter || selectedQuarter,
          }),
        }
      );
      if (functionError) {
        throw new Error(`Function error: ${functionError.message}`);
      }
      if (!data) {
        throw new Error("No data received from the function");
      }
      setAttendanceData(data);
      console.log("Attendance data fetched:", data);
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    fetchAttendanceData(year, selectedQuarter);
  };

  const handleQuarterChange = (quarter: string) => {
    setSelectedQuarter(quarter);
    fetchAttendanceData(selectedYear, quarter);
  };

  const getCurrentYear = () => new Date().getFullYear();

  const getYearOptions = () => {
    const currentYear = getCurrentYear();
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year.toString());
    }
    return years.reverse();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getAttendanceIcon = (attendance: boolean | undefined, date: string) => {
    const currentDate = new Date();
    const attendanceDate = new Date(date);

    // If the date is in the future, show dash
    if (attendanceDate > currentDate) {
      return <Minus className="h-4 w-4 text-muted-foreground mx-auto" />;
    }

    // If attendance is true, show check
    if (attendance === true) {
      return <Check className="h-4 w-4 text-green-600 mx-auto" />;
    }

    // If attendance is false, show X
    return <X className="h-4 w-4 text-red-600 mx-auto" />;
  };

  const getClassColor = (className: string) => {
    const colors: { [key: string]: string } = {
      Men: "bg-blue-100 text-blue-800",
      Women: "bg-pink-100 text-pink-800",
      English: "bg-green-100 text-green-800",
      Teenage: "bg-purple-100 text-purple-800",
      Primary: "bg-orange-100 text-orange-800",
      Children: "bg-yellow-100 text-yellow-800",
    };
    return colors[className] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading attendance data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading attendance data: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!attendanceData) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No attendance data available.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Attendance Record</h1>
        <p className="text-muted-foreground">
          Track student attendance across all classes and dates
        </p>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Options</CardTitle>
          <CardDescription>
            Select year and quarter to view attendance data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="year-select"
                className="block text-sm font-medium mb-2"
              >
                Year
              </label>
              <Select value={selectedYear} onValueChange={handleYearChange}>
                <SelectTrigger id="year-select">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {getYearOptions().map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label
                htmlFor="quarter-select"
                className="block text-sm font-medium mb-2"
              >
                Quarter
              </label>
              <Select
                value={selectedQuarter}
                onValueChange={handleQuarterChange}
              >
                <SelectTrigger id="quarter-select">
                  <SelectValue placeholder="Select quarter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="First">First Quarter</SelectItem>
                  <SelectItem value="Second">Second Quarter</SelectItem>
                  <SelectItem value="Third">Third Quarter</SelectItem>
                  <SelectItem value="Fourth">Fourth Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceData.summary.totalStudents}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceData.summary.totalDates}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceData.summary.totalAttendanceRecord}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        {/* <CardHeader> */}
        {/* <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            Student attendance tracking with present (✓), absent (✗), and future
            (-) indicators
          </CardDescription>
        </CardHeader> */}
        <CardContent className="p-0">
          <div className="hidden lg:block p-6">
            <Table className="rounded-lg">
              <TableHeader className="bg-primary rounded-t-lg overflow-hidden">
                <TableRow>
                  <TableHead className="min-w-[200px] bg-blue-500">
                    Student Name
                  </TableHead>
                  <TableHead className="min-w-[100px]">Class</TableHead>
                  {attendanceData.dates.map((date) => (
                    <TableHead key={date} className="min-w-[80px] text-center">
                      {formatDate(date)}
                    </TableHead>
                  ))}
                  <TableHead className="min-w-[80px] text-center">
                    Present
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.records.map((record) => (
                  <TableRow key={record.student_id}>
                    <TableCell className="font-medium">
                      {record.name.trim()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getClassColor(record.class)}
                      >
                        {record.class}
                      </Badge>
                    </TableCell>
                    {attendanceData.dates.map((date) => (
                      <TableCell key={date} className="text-center px-auto">
                        {getAttendanceIcon(record[date] as boolean, date)}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-semibold">
                      {record.totalPresent}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile and Tablet View - With horizontal scroll and sticky name column */}
          <div className="lg:hidden">
            <div className="overflow-x-auto">
              <div className="min-w-max">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 z-20 bg-card min-w-[180px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        Student Name
                      </TableHead>
                      <TableHead className="hidden md:table-cell min-w-[100px]">
                        Class
                      </TableHead>
                      {attendanceData.dates.map((date) => (
                        <TableHead
                          key={date}
                          className="min-w-[70px] text-center whitespace-nowrap"
                        >
                          {formatDate(date)}
                        </TableHead>
                      ))}
                      <TableHead className="min-w-[70px] text-center bg-muted/50">
                        Present
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceData.records.map((record) => (
                      <TableRow key={record.student_id}>
                        <TableCell className="sticky left-0 z-10 bg-background font-medium min-w-[180px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] pr-4">
                          <div className="truncate" title={record.name.trim()}>
                            {record.name.trim()}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell min-w-[100px]">
                          <Badge
                            variant="secondary"
                            className={getClassColor(record.class)}
                          >
                            {record.class}
                          </Badge>
                        </TableCell>
                        {attendanceData.dates.map((date) => (
                          <TableCell
                            key={date}
                            className="text-center min-w-[70px]"
                          >
                            {getAttendanceIcon(record[date] as boolean, date)}
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-semibold min-w-[70px] bg-muted/30">
                          {record.totalPresent}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Mobile scroll hint */}
            <div className="md:hidden p-4 text-center">
              <p className="text-xs text-muted-foreground">
                ← Swipe left to view more dates →
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
