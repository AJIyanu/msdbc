import { SermonForm } from "@/auth/forms/sermonform";
import SundayAttendanceForm from "@/auth/forms/sundayattendance";
import { Separator } from "@/components/ui/separator";

export default function SundayAttendancePage() {
  return (
    <div className="flex flex-col gap-6 m-9 p-12 rounded-lg bg-white shadow-md">
      <Separator className="my-4 bg-gray-300" />
      <h1 className="text-2xl font-bold">Sunday Attendance</h1>
      <SundayAttendanceForm />
      <Separator />
      <div className="max-w-2xl flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Sermon Form</h1>
        <SermonForm preachers={preacher} />
      </div>
    </div>
  );
}

const preacher = [
  {
    id: "987ac250-837e-41d1-943a-a421439df865",
    name: "Pastor Iyanu",
  },
];
