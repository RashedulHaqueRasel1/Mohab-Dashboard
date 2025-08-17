"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlogs, deleteBlog } from "@/hooks/api";
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
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

interface Blog {
  _id: string;
  blogTitle: string;
  blogDescription: string;
  imageLink: string;
  createdAt: string;
}

export default function Blogs() {
  const queryClient = useQueryClient();
  const { data: blogs, isLoading, isError } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  // dialog states
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // image preview state
  const [preview, setPreview] = useState<string | null>(null);

  const { mutate: removeBlog, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog deleted successfully!");
      setDeleteOpen(false);
    },
    onError: () => toast.error("Delete failed!"),
  });

  // file change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // update handler (dummy for now)
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentBlog) return;

    const form = e.currentTarget;

    const updatedData = {
      blogTitle: (form.blogTitle as HTMLInputElement).value,
      blogDescription: (form.blogDescription as HTMLTextAreaElement).value,
    };

    // file include করব যদি থাকে
    const fileInput = document.getElementById("fileUpload") as HTMLInputElement;
    const file = fileInput?.files?.[0];

    console.log("Update payload:", { id: currentBlog._id, data: updatedData, file });

    toast.success("Blog updated successfully! (demo only)");
    setEditOpen(false);
  };

  if (isLoading) return <p className="p-6">Loading blogs...</p>;
  if (isError) return <p className="p-6 text-red-500">Failed to load blogs!</p>;

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blogs</h1>
          <p className="text-gray-500 text-sm">Dashboard &gt; Blogs</p>
        </div>
        <Link href="/dashboard/blogs/add-blog">
          <Button className="flex items-center gap-2 cursor-pointer">
            <Plus size={16} /> Add Blog
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border shadow-sm bg-white">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="p-4 text-left">Blog Name</TableHead>
              <TableHead className="p-4 text-left">Added</TableHead>
              <TableHead className="p-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {blogs?.data?.map((blog: Blog) => (
              <TableRow key={blog._id} className="hover:bg-gray-50 transition">
                {/* Blog Info */}
                <TableCell className="flex items-center gap-3 p-4">
                  <div className="w-14 h-14 relative rounded-md overflow-hidden border">
                    <Image
                      src={blog.imageLink}
                      alt={blog.blogTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold">{blog.blogTitle}</h2>
                    <p className="text-gray-500 text-sm line-clamp-1 w-280 truncate">
                      {stripHtml(blog.blogDescription)}
                    </p>
                  </div>
                </TableCell>

                {/* Date */}
                <TableCell className="text-sm text-gray-500 p-4">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right flex items-center gap-3 justify-end p-4">
                  {/* View */}
                  <Dialog
                    open={viewOpen && currentBlog?._id === blog._id}
                    onOpenChange={(open) => {
                      setViewOpen(open);
                      if (open) setCurrentBlog(blog);
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
                        <DialogTitle>Blog Details</DialogTitle>
                      </DialogHeader>
                      {currentBlog && (
                        <div className="space-y-4">
                          <Image
                            src={currentBlog.imageLink}
                            alt={currentBlog.blogTitle}
                            width={400}
                            height={250}
                            className="rounded-xl object-cover w-full"
                          />
                          <h2 className="text-xl font-bold">
                            {currentBlog.blogTitle}
                          </h2>
                          <p className="text-gray-600">
                            {stripHtml(currentBlog.blogDescription)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Added:{" "}
                            {new Date(
                              currentBlog.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Edit */}
                  <Dialog
                    open={editOpen && currentBlog?._id === blog._id}
                    onOpenChange={(open) => {
                      setEditOpen(open);
                      if (open) {
                        setCurrentBlog(blog);
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
                        <DialogTitle>Edit Blog</DialogTitle>
                      </DialogHeader>
                      {currentBlog && (
                        <form
                          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
                          onSubmit={handleUpdate}
                        >
                          {/* Left Side */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Blog Title
                              </label>
                              <input
                                name="blogTitle"
                                defaultValue={currentBlog.blogTitle}
                                className="w-full border px-3 py-2 rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Description
                              </label>
                              <textarea
                                name="blogDescription"
                                rows={4}
                                defaultValue={stripHtml(
                                  currentBlog.blogDescription
                                )}
                                className="w-full border px-3 py-2 rounded"
                              />
                            </div>
                          </div>

                          {/* Right Side */}
                          <div className="space-y-4">
                            <label className="block text-sm font-medium">
                              Blog Image
                            </label>
                            <div className="relative w-full h-40">
                              <Image
                                src={preview || currentBlog.imageLink}
                                alt="Blog"
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
                              type="button"
                              className="w-full"
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
                              onClick={() => setEditOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-blue-600 hover:bg-blue-700"
                              type="submit"
                            >
                              Update Blog
                            </Button>
                          </div>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Delete */}
                  <Dialog
                    open={deleteOpen && currentBlog?._id === blog._id}
                    onOpenChange={(open) => {
                      setDeleteOpen(open);
                      if (open) setCurrentBlog(blog);
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
                          {currentBlog?.blogTitle}
                        </span>
                        ?
                      </p>
                      <div className="flex justify-end gap-3 mt-6">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setDeleteOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() =>
                            currentBlog && removeBlog(currentBlog._id)
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

// Remove HTML
function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
}
