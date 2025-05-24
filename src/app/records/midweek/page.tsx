import { MidweekServiceForm } from "@/auth/forms/midweekserviceform";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MidweekAttendancePage() {
  return (
    <main>
      <MidweekServiceForm />
      <div className="mt-4">
        <Link href="/records/midweek/preview">
          <Button
            variant="outline"
            className="w-full max-w-2xl border-3 text-accent border-accent"
            size="lg"
          >
            View Records
          </Button>
        </Link>
      </div>
    </main>
  );
}
