"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserProfile } from "@/hooks/api";
import { useQuery } from "@tanstack/react-query";

type ApiResponse = {
  success: boolean;
  message: string;
  data: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    phone: string;
    imageLink: string;
    role: string;
    country: string;
    cityOrState: string;
    roadOrArea: string;
    postalCode: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export default function DashboardHeader() {
  const { data: response, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  const section = "Dashboard";

  const handleLogout = () => {
    alert("Logout clicked!");
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }
  if (isError || !response?.data) {
    return <div className="text-red-500">Failed to load user data</div>;
  }

  const user = response.data;

  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-[#131313] shadow-sm">
      {/* Left side - Section name */}
      <h1 className="text-lg sm:text-xl font-semibold text-white">{section}</h1>

      {/* Right side - Profile dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex cursor-pointer items-center gap-2">
            {/* Avatar */}
            <Avatar className="w-9 h-9 border">
              <AvatarImage src={user.imageLink || ""} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
            </Avatar>

            {/* Name + role (hidden on small screens) */}
            <span className="hidden sm:inline text-sm font-medium text-white">
              {user.firstName}{" "}
              <span className="text-red-400 text-xs">({user.role})</span>
            </span>

            {/* Arrow */}
            <ChevronDown className="h-4 w-4 text-white" />
          </div>
        </DropdownMenuTrigger>

        {/* Dropdown content */}
        <DropdownMenuContent align="end" className="w-64">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 border-b">
            <Avatar className="w-10 h-10 border">
              <AvatarImage src={user.imageLink || ""} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="truncate">
              <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Extra info */}
          <div className="p-3 space-y-1 text-xs text-gray-600">
            <p>
              <span className="font-semibold">Role:</span> {user.role}
            </p>
            {user.companyName && (
              <p>
                <span className="font-semibold">Company:</span> {user.companyName}
              </p>
            )}
            {user.phone && (
              <p>
                <span className="font-semibold">Phone:</span> {user.phone}
              </p>
            )}
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="cursor-pointer">
              Dashboard
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600 focus:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}