import { SpecialEventForm } from "@/auth/forms/specialevent";

export default function CreateSpecialEventPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Create Special Event</h1>
      <SpecialEventForm />
    </div>
  );
}
