"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, User, Lock } from "lucide-react";

export default function Settings() {
  const settings = [
    { title: "Personal Information", href: "/dashboard/settings/personal-information", icon: <User className="w-5 h-5 text-primary" /> },
    { title: "Change Password", href: "/dashboard/settings/password", icon: <Lock className="w-5 h-5 text-primary" /> },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Title with Breadcrumb */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <nav className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-1">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <span>&gt;</span>
          <Link href="/dashboard/settings" className="hover:underline">Settings</Link>
          <span>&gt;</span>
        </nav>
      </div>

      {/* Settings List */}
      <div className="space-y-3">
        {settings.map((item, index) => (
          <Link key={index} href={item.href}>
            <Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-border my-2">
              <CardContent className="flex items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium text-lg">{item.title}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
