import type React from "react";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar/DashboardSidebar";
import DashboardHeader from "@/components/Dashboard/DashboardHeader/DashboardHeader";
import DashboardProvider from "@/providers/DashboardProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} `}>
      <DashboardProvider>
        <SidebarProvider>
          <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1 md:w-[calc(100vw-108px)]">
              <div className="sticky top-0 z-10 flex ">
                <DashboardHeader />
              </div>
              <main className="md:ml-[15px]">{children}</main>
            </div>
          </div>
          <Toaster  position="top-center"/>
        </SidebarProvider>
      </DashboardProvider>
    </div>
  );
}
