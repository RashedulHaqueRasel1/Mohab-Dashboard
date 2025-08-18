"use client";

import { fetchServices, editService, deleteService } from "@/hooks/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

interface IService {
  _id: string;
  serviceTitle: string;
  serviceDescription: string;
  price: number;
  imageLink: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function Services() {
  const page = 1;
  const limit = 10;

  const {
    data: services,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["services", page, limit],
    queryFn: () => fetchServices(page, limit),
  });

  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentService, setCurrentService] = useState<IService | null>(null);

  // mutation for update
  const { mutate: updateService, isPending: isUpdating } = useMutation({
    mutationFn: ({
      id,
      data,
      image,
    }: {
      id: string;
      data: Partial<IService>;
      image?: File;
    }) => editService(id, data, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Services Update successfully! ");
      setEditOpen(false);
    },
    onError: () => {
      toast.warning("Update Failed!");
    },
  });


  // mutation for delete
  const { mutate: removeService, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Services Delete successfully! ");
      setDeleteOpen(false);
    },
    onError: () => {
      toast.warning("Delete Failed!");
      // alert(err.message || "Delete failed!");
    },
  });

  // file change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // update handler
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentService) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    // File input handle
    const fileInput = document.getElementById("fileUpload") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      formData.set("image", file); 
    }

    // API Call
    updateService({
      id: currentService._id,
      data: Object.fromEntries(formData.entries()),  
       image: file,
    });
  };


  if (isLoading) return <p className="p-6">Loading services...</p>;
  if (isError)
    return <p className="p-6 text-red-500">Failed to load services!</p>;

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-gray-500 text-sm">Dashboard &gt; Services</p>
        </div>
        <Link href="/dashboard/services/add-service">
          <Button className="flex items-center gap-2 cursor-pointer">
            <Plus size={16} /> Add Service
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-lg border shadow-sm bg-white overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 ">
            <TableRow>
              <TableHead className="p-6">Service</TableHead>
              <TableHead className="p-6">Price</TableHead>
              <TableHead className="p-6">Added</TableHead>
              <TableHead className="p-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services?.data?.map((service: IService) => (
              <TableRow key={service._id} className="hover:bg-gray-50">
                {/* Service Info */}
                <TableCell>
                  <div className="flex gap-3 w-full">
                    <Image
                      src={service.imageLink}
                      alt={service.serviceTitle}
                      width={100}
                      height={105}
                      className="rounded-3xl object-cover w-[110px] h-[105px] p-2"
                    />
                    <div className="flex flex-col justify-center max-w-[250px] sm:max-w-xs p-2">
                      <h2 className="font-semibold text-xl">
                        {service.serviceTitle}
                      </h2>
                      <p className="text-gray-500 text-[16px] whitespace-normal line-clamp-3 w-full">
                        {service.serviceDescription
                          ?.split(" ")
                          .slice(0, 100)
                          .join(" ")}
                        {service.serviceDescription?.split(" ").length > 100 &&
                          " ..."}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Price */}
                <TableCell>
                  <span className="px-2 py-1 rounded bg-gray-100 text-sm font-medium">
                    ${service.price}
                  </span>
                </TableCell>

                {/* Created At */}
                <TableCell className="text-sm">
                  {new Date(service.createdAt).toLocaleDateString()}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right flex items-center gap-3 justify-end ">
                  {/* View */}
                  <Dialog
                    open={viewOpen && currentService?._id === service._id}
                    onOpenChange={(open) => {
                      setViewOpen(open);
                      if (open) setCurrentService(service);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Eye
                        className="cursor-pointer text-blue-600 hover:text-blue-800 transition"
                        size={18}
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-lg w-full">
                      <DialogHeader>
                        <DialogTitle>Service Details</DialogTitle>
                      </DialogHeader>
                      {currentService && (
                        <div className="space-y-4">
                          <Image
                            src={currentService.imageLink}
                            alt={currentService.serviceTitle}
                            width={400}
                            height={250}
                            className="rounded-xl object-cover w-full"
                          />
                          <h2 className="text-xl font-bold">
                            {currentService.serviceTitle}
                          </h2>
                          <p className="text-gray-600">
                            {currentService.serviceDescription}
                          </p>
                          <p className="font-semibold">
                            Price: ${currentService.price}
                          </p>
                          <p className="text-sm text-gray-500">
                            Added:{" "}
                            {new Date(
                              currentService.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Edit */}
                  <Dialog
                    open={editOpen && currentService?._id === service._id}
                    onOpenChange={(open) => {
                      setEditOpen(open);
                      if (open) {
                        setCurrentService(service);
                        setPreview(null);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Pencil
                        className="cursor-pointer text-green-600 hover:text-green-800 transition"
                        size={18}
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl w-full">
                      <DialogHeader>
                        <DialogTitle>Edit Service</DialogTitle>
                      </DialogHeader>

                      {currentService && (
                        <form
                          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
                          onSubmit={handleUpdate}
                        >
                          {/* Left Side */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Service Name
                              </label>
                              <input
                                name="serviceTitle"
                                defaultValue={currentService.serviceTitle}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Price
                              </label>
                              <input
                                type="number"
                                name="price"
                                defaultValue={currentService.price}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Description
                              </label>
                              <textarea
                                name="serviceDescription"
                                rows={4}
                                defaultValue={currentService.serviceDescription}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                          </div>

                          {/* Right Side */}
                          <div className="space-y-4">
                            <label className="block text-sm font-medium cursor-pointer">
                              Service Image
                            </label>
                            <div className="relative w-full h-40">
                              <Image
                                src={preview || currentService.imageLink}
                                alt="Service"
                                fill
                                className="object-cover rounded border"
                              />
                            </div>
                            <input
                              id="fileUpload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                            <Button
                              variant="outline"
                              className="w-full cursor-pointer"
                              type="button"
                              onClick={() =>
                                document.getElementById("fileUpload")?.click()
                              }
                            >
                              Change Image
                            </Button>
                          </div>

                          {/* Footer */}
                          <div className="flex justify-end gap-3 mt-6 col-span-2">
                            <Button
                              variant="outline"
                              type="button"
                              className="cursor-pointer"
                              onClick={() => setEditOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                              type="submit"
                              disabled={isUpdating}
                            >
                              {isUpdating ? "Updating..." : "Update Service"}
                            </Button>
                          </div>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Delete */}
                  <Dialog
                    open={deleteOpen && currentService?._id === service._id}
                    onOpenChange={(open) => {
                      setDeleteOpen(open);
                      if (open) setCurrentService(service);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Trash2
                        className="cursor-pointer text-red-600 hover:text-red-800 transition"
                        size={18}
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-md w-full">
                      <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                      </DialogHeader>
                      <p>
                        Are you sure you want to delete{" "}
                        <span className="font-semibold">
                          {currentService?.serviceTitle}
                        </span>{" "}
                        ?
                      </p>
                      <div className="flex justify-end gap-3 mt-6 ">
                        <Button
                          variant="outline"
                          type="button"
                          className="cursor-pointer"
                          onClick={() => setDeleteOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-red-600 hover:bg-red-700 cursor-pointer"
                          onClick={() =>
                            currentService && removeService(currentService._id)
                          }
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
