import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { baseMenu } from "./menu-config";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex flex-1">
          <DashboardSidebar menuConfig={baseMenu} />
          <main className="flex-1 p-6 gap-6 flex flex-col">
            <DashboardHeader />
            {children}
            <Toaster />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
