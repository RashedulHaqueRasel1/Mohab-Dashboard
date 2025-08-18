"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getUserProfile, updateUserProfile } from "@/hooks/api";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

type UserProfile = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  cityOrState: string;
  companyName: string;
  roadOrArea: string;
  postalCode: string;
  imageLink: string;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
  isVerified?: boolean;
};

type ApiResponse = {
  data: UserProfile;
};

export default function PersonalInformation() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  React.useEffect(() => {
    if (data?.data) {
      setFormData(data.data);
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSave = () => {
    if (formData) {
      updateProfileMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    if (data?.data) {
      setFormData(data.data);
    }
    setIsEditing(false);
  };

  if (isLoading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (isError) return <div className="text-red-500 text-center p-4">Failed to load user profile.</div>;
  if (!formData) return <div className="text-center p-4">No profile data available.</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <nav className="flex items-center text-sm text-muted-foreground gap-1.5 flex-wrap">
          <Link href="/dashboard" className="hover:underline hover:text-primary">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/dashboard/settings" className="hover:underline hover:text-primary">
            Settings
          </Link>
          <span>/</span>
          <span className="text-primary">Personal Information</span>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100">
            <Image
              src={formData.imageLink || "/default-avatar.png"}
              alt="Profile"
              width={128}
              height={128}
              className="object-cover"
              priority
            />
          </div>
          {isEditing && (
            <Button variant="outline" className="mt-4 w-full">
              Change Photo
            </Button>
          )}
        </div>

        {/* Personal Information Section */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2 cursor-pointer">
                <Pencil size={16} /> Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleCancel} variant="outline" className="gap-2 cursor-pointer">
                  <X size={16} /> Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="gap-2 cursor-pointer"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save size={16}/>
                  )}
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="my-2">First Name</Label>
              <Input
                name="firstName"
                value={formData.firstName}
                readOnly={!isEditing}
                onChange={handleChange}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label className="my-2">Last Name</Label>
              <Input
                name="lastName"
                value={formData.lastName}
                readOnly={!isEditing}
                onChange={handleChange}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label className="my-2">Email Address</Label>
              <Input
                name="email"
                value={formData.email}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label className="my-2">Phone</Label>
              <Input
                name="phone"
                value={formData.phone}
                readOnly={!isEditing}
                onChange={handleChange}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label className="my-2">Country</Label>
              <Input
                name="country"
                value={formData.country}
                readOnly={!isEditing}
                onChange={handleChange}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label className="my-2">City/State</Label>
              <Input
                name="cityOrState"
                value={formData.cityOrState}
                readOnly={!isEditing}
                onChange={handleChange}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label className="my-2">Company Name</Label>
              <Input
                name="companyName"
                value={formData.companyName}
                readOnly={!isEditing}
                onChange={handleChange}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label className="my-2">Road/Area</Label>
              <Input
                name="roadOrArea"
                value={formData.roadOrArea}
                readOnly={!isEditing}
                onChange={handleChange}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label className="my-2">Postal Code</Label>
              <Input
                name="postalCode"
                value={formData.postalCode}
                readOnly={!isEditing}
                onChange={handleChange}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}