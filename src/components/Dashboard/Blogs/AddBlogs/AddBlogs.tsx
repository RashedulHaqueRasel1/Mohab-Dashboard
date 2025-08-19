"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import { useState } from "react";
import { useForm, FormProvider, useFormContext, SubmitHandler } from "react-hook-form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { FormControl } from "@/components/ui/form";
import { createBlogs } from "@/hooks/api";
import { toast } from "sonner";
import { X } from "lucide-react";

// Define TypeScript types for form
interface BlogForm {
  description: string;
}

interface Payload {
  blogTitle: string;
  blogDescription: string;
}

// RichTextField integrated with React Hook Form
function RichTextField() {
  const { setValue, watch } = useFormContext<BlogForm>();
  const content = watch("description");
  // if (!content) {
  //   setValue("description", "");
    
  // }

  return (
    <FormControl>
      <RichTextEditor
        content={content}
        onChange={(value) => setValue("description", value)}
        placeholder="Description..."
      />
    </FormControl>
  );
}

export default function AddBlogPage() {
  const methods = useForm<BlogForm>({
    defaultValues: { description: "" },
  });

  const [title, setTitle] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[250px]",
      },
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSave: SubmitHandler<BlogForm> = async (data) => {
    if (!title) {
      toast.error("Please enter a blog title.");
      return;
    }

    if (!data.description) {
      toast.error("Please enter blog content.");
      return;
    }

    if (!image) {
      toast.error("Please select an image.");
      return;
    }

    setLoading(true);

    try {
      const payload: Payload = {
        blogTitle: title,
        blogDescription: data.description,
      };

      await createBlogs(payload, image);

      toast.success("Blog created successfully!");

      // Clear form
      setTitle("");
      methods.reset({ description: "" });
      setImage(null);
      editor?.commands.setContent("");
    } catch (err) {
      toast.error("Failed to create blog. Please try again.");
      console.error("Error creating blog:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Add Blog</h1>
        <p className="text-sm text-gray-500 mb-8">
          Dashboard &gt; Blogs &gt; Add Blog
        </p>

        <div className="flex gap-6">
          {/* Left side: Blog Details */}
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Blog Details</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Blog Title</label>
              <input
                type="text"
                placeholder="Type Blog Title here..."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Blog Content</label>
              <div className="border border-gray-300 rounded p-2">
                <RichTextField />
              </div>
            </div>
          </div>

          {/* Right side: Image Upload */}
          <div className="w-80 flex flex-col gap-4">
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 relative">
              {image ? (
                <>
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="Selected"
                    className="h-full object-contain"
                    width={300}
                    height={300}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer"
                  >
                    <X />
                  </button>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-blue-500 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3M12 3v9"
                    />
                  </svg>
                  <p className="text-gray-500 mb-2 text-center">
                    Drag and drop image here, or click add image
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                  >
                    Add Image
                  </label>
                </>
              )}
            </div>

            <button
              onClick={methods.handleSubmit(handleSave)}
              className={`w-full rounded-lg py-2 text-white cursor-pointer ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 cursor-not-allowed"
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
