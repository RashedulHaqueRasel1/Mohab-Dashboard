"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllNeededStaff } from "@/hooks/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {  Eye } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  businessEmail: string;
  companyName: string;
  staffDescription: string;
  createdAt: string;
  status?: "pending" | "active" | "rejected";  
}

export default function StaffingNeed() {
  const { data: staff, isLoading } = useQuery({
    queryKey: ["neededStaff"],
    queryFn: getAllNeededStaff,
  });

  if (isLoading) return <p className="text-center py-6">Loading staff...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <nav className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-1">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <span>&gt;</span>
          <Link href="/dashboard/data-sets" className="hover:underline">
            Staff Management
          </Link>
        </nav>
      </div>

      {/* Staff List */}
      <Card className="shadow-md rounded-2xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Data-Driven Staffing Need</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff?.data?.map((member: StaffMember) => (
                <TableRow key={member._id}>
                  <TableCell className="font-medium">
                    <div>
                      {member.firstName} {member.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {member.businessEmail}
                    </div>
                  </TableCell>
                  <TableCell>{member.companyName}</TableCell>
                  <TableCell className="line-clamp-1 max-w-xs">
                    {member.staffDescription}
                  </TableCell>
                  <TableCell>
                    {new Date(member.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 bg-[#4BB9EC] p-4 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" /> View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Staff Details</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                          {/* Business Email */}
                          <div className="space-y-1">
                            <label className="text-sm font-medium">
                              Business Email:
                            </label>
                            <div className="flex items-center justify-between border rounded-md px-3 py-2">
                              <span className="text-sm text-gray-700">
                                {member.businessEmail}
                              </span>
                              <a
                                href={`mailto:${member.businessEmail}`}
                                className="text-sm text-blue-600 hover:underline"
                              >
                                Send Email
                              </a>
                            </div>
                          </div>

                          {/* Staff Description */}
                          <div className="space-y-1">
                            <label className="text-sm font-medium">
                              Staff Description:
                            </label>
                            <div className="border rounded-md px-3 py-2">
                              <p className="text-sm text-gray-700">
                                {member.staffDescription}
                              </p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
