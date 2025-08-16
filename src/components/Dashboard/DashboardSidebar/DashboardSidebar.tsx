"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Settings,
  FileText,
  CreditCard,
  LogOut,
  Lightbulb,
  MessageSquare,
  Grid3X3,
  Users,
  Database,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import Image from "next/image";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Services",
    url: "/dashboard/services",
    icon: Grid3X3,
  },
  {
    title: "Strategy",
    url: "/dashboard/strategy",
    icon: MessageSquare,
  },
  {
    title: "Blogs",
    url: "/dashboard/blogs",
    icon: FileText,
  },
  {
    title: "Solutions",
    url: "/dashboard/solutions",
    icon: Lightbulb,
  },
  {
    title: "Payments",
    url: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Data Sets",
    url: "/dashboard/data-sets",
    icon: Database,
  },
  {
    title: "Staffing Need",
    url: "/dashboard/staffing-need",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <div>
      <Sidebar className="border-r-0 w-[108px]" collapsible="none" {...props}>
        <SidebarContent className="p-4 bg-[#131313]">
          <Link href={"/"} className="text-white">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="mx-auto h-[80px] w-[80px] object-contain mb-4"
            />
          </Link>
          <SidebarMenu className="space-y-2">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={isActive(item.url)}
                  className="group py-8 flex justify-center hover:bg-[#ffffff] data-[active=true]:bg-[#ffffff]"
                >
                  <Link href={item.url} className="flex flex-col items-center">
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive(item.url)
                          ? "text-[#212121]"
                          : "text-[#ffffff] group-hover:text-[#212121]"
                      }`}
                    />
                    <span
                      className={`text-[12px] font-medium text-center ${
                        isActive(item.url)
                          ? "text-[#212121]"
                          : "text-[#ffffff] group-hover:text-[#212121]"
                      }`}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        {/* Logout Section */}
        <div className="mt-auto p-4 bg-[#212121] border-t border-[#5c5343]">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setIsLogoutDialogOpen(true)}
                className="group py-8 flex justify-center hover:bg-[#ffffff]"
              >
                <div className="flex flex-col items-center">
                  <LogOut className="h-5 w-5 text-[#ffffff] group-hover:text-[#212121]" />
                  <span className="text-[12px] font-medium text-[#ffffff] group-hover:text-[#212121]">
                    Logout
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </Sidebar>

      {/* Logout Confirm Modal */}
      {isLogoutDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsLogoutDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
