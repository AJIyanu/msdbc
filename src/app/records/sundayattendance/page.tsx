import SundayAttendanceForm from "@/auth/forms/sundayattendance";
import { Separator } from "@/components/ui/separator";

export default function SundayAttendancePage() {
  return (
    <div className="flex flex-col gap-6 m-9 p-12 rounded-lg bg-white shadow-md">
      <h1 className="text-2xl font-bold">Sunday Attendance</h1>
      <Separator className="my-4 bg-gray-300" />
      <SundayAttendanceForm />
    </div>
  );
}
