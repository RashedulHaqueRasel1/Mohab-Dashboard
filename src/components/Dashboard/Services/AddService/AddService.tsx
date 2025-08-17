"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createService } from "@/hooks/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface FormData {
  serviceTitle: string;
  serviceDescription: string;
  price: string;
}

interface ServiceFormData {
  serviceTitle: string;
  serviceDescription: string;
  price: number;
}

export default function AddService() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    serviceTitle: "",
    serviceDescription: "",
    price: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // React Query Mutation
  const mutation = useMutation({
    mutationFn: ({ data, image }: { data: ServiceFormData; image?: File }) =>
      createService(data, image),
    onSuccess: () => {
      router.push("/dashboard/services");
    },
    onError: (err: Error) => {
      toast.error(err.message || "❌ Failed to add service!");
    },
  });

  // Handle text input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setImage(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.serviceTitle || !formData.price || !formData.serviceDescription) {
      return;
    }

    const data = {
      serviceTitle: formData.serviceTitle,
      price: Number(formData.price),
      serviceDescription: formData.serviceDescription,
    };

    mutation.mutate({ data, image: image || undefined });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Services</h1>
        <p className="text-gray-500 text-sm">
          Dashboard &gt; Categories &gt; Add Service
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Side - Service Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Service Name
              </label>
              <Input
                placeholder="Type Service name here..."
                name="serviceTitle"
                value={formData.serviceTitle}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <Input
                placeholder="Enter price..."
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                placeholder="Type Service description here..."
                name="serviceDescription"
                rows={5}
                value={formData.serviceDescription}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Photo Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition">
              {preview ? (
                <>
                  <Image
                    src={preview}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3"
                    onClick={() => {
                      setImage(null);
                      setPreview(null);
                    }}
                  >
                    Remove Image
                  </Button>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-blue-500 mb-2" />
                  <p className="text-gray-500 text-sm">
                    Drag and drop image here, or click add image
                  </p>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() =>
                      document.getElementById("fileUpload")?.click()
                    }
                    className="mt-2 cursor-pointer"
                  >
                    Add Image
                  </Button>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                id="fileUpload"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bottom Save Button */}
        <div className="lg:col-span-3 flex justify-end">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            <Save className="w-4 h-4 mr-2 " />
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}