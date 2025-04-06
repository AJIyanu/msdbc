import Link from "next/link";
import { Bell, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center gap-4 bg-background px-6 min-w-full">
      <SidebarTrigger className="md:hidden" />
      {/* <Link href="/" className="flex items-center gap-2 font-semibold">
        <div className="size-6 rounded-full bg-accent" />
        <span>Acme Inc</span>
      </Link> */}
      <div className="ml-auto me-9 relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full pl-8 md:w-[300px] lg:w-[400px]"
        />
      </div>
      <button className="me-9 rounded-full">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </button>
    </header>
  );
}
