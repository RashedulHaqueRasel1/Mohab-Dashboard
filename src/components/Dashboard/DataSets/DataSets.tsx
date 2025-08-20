"use client";

import {
  addDataSet,
  deleteDataSet,
  getAllDataSet,
  getAllUsers,
  updateDataSet,
} from "@/hooks/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";

type DataSet = {
  _id: string;
  dataSetName: string;
  dataSets: string;
  createdAt: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    imageLink?: string;
  };
};

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
};

export default function DataSets() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [datasetToDelete, setDatasetToDelete] = useState<DataSet | null>(null);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDataSet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["DataSets"] });
      setDeleteModalOpen(false);
      setDatasetToDelete(null);
    },
  });

  // Handle delete button click
  const handleDeleteClick = (ds: DataSet) => {
    setDatasetToDelete(ds);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!datasetToDelete) return;
    setDeleteModalOpen(false);
    deleteMutation.mutate(datasetToDelete._id);
    toast.success(
      `Dataset ${datasetToDelete.dataSetName} deleted successfully`
    );
  };
  const queryClient = useQueryClient();

  const {
    data: allDataSets,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["DataSets"],
    queryFn: getAllDataSet,
  });

  const { data: allUsersData } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });

  const [open, setOpen] = useState(false);
  const [datasetName, setDatasetName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  // console.log(selectedCompany, "selectedCompany");

  // Create Dataset
  const createMutation = useMutation({
    mutationFn: (data: {
      dataSetName: string;
      userId: string;
      dataSets: File;
    }) => addDataSet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["DataSets"] });
      setOpen(false);
      setDatasetName("");
      setSelectedCompany("");
      setFile(null);
      toast.success("created successfully");
    },
  });

  // Edit Dataset
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDataSet, setSelectedDataSet] = useState<DataSet | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateDataSet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["DataSets"] });
      setIsEditModalOpen(false);
      setSelectedDataSet(null);
      setUploadedFile(null);
      setLoadingEdit(false);
    },
    onError: () => setLoadingEdit(false),
  });

  const handleCreateDataSet = () => {
    console.log(`Creating dataset with:
    Name: ${datasetName},
    Company: ${selectedCompany},
    File: ${file ? file.name : "No file selected"}`);

    if (!datasetName || !selectedCompany || !file) return;

    const formData = new FormData();
    formData.append("dataSetName", datasetName);
    formData.append("userId", selectedCompany);
    formData.append("dataSets", file);

    // Debug FormData contents

    createMutation.mutate({
      dataSetName: datasetName,
      userId: selectedCompany,
      dataSets: file,
    });
  };

  const handleEditDataSet = () => {
    if (!selectedDataSet) return;

    setLoadingEdit(true);

    const formData = new FormData();

    // Append file
    if (uploadedFile) {
      formData.append("file", uploadedFile);
    }

    // Append other fields
    formData.append("dataSetName", datasetName || selectedDataSet.dataSetName);
    formData.append("userId", selectedCompany || selectedDataSet.userId._id);

    // Call mutation
    // editMutation.mutate(formData);
    editMutation.mutate({
      id: selectedDataSet._id,
      data: formData,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-sky-500" />
        <span className="ml-2 text-sky-600 font-medium">
          Loading Data Sets...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 font-medium p-4">
        Error fetching data sets:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Data Set</h1>

        {/* Add Dataset Modal */}
        {/* Add Dataset Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sky-500 hover:bg-sky-600 cursor-pointer">
              + Add Data Set
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Dataset</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Dataset Name */}
              <div className="space-y-2">
                <Label>Dataset Name</Label>
                <Input
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  placeholder="Enter dataset name"
                />
              </div>

              {/* Company Selection */}
              <div className="space-y-2">
                <Label>Company Name</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                >
                  <option value="">Select the company</option>
                  {allUsersData?.data?.map((user: User) => (
                    <option key={user._id} value={user._id}>
                      {user.companyName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Upload Dataset</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="add-file-upload"
                  />
                  <Label
                    htmlFor="add-file-upload"
                    className="cursor-pointer block text-gray-500 py-4"
                  >
                    Click & Upload your JSON file
                  </Label>
                  {file && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button onClick={handleCreateDataSet} className="cursor-pointer">Create Dataset</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dataset Table */}
      <div className="bg-white rounded-2xl shadow p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Data Set Name</th>
              <th className="p-3">Company Name</th>
              <th className="p-3">User Info</th>
              <th className="p-3">Added</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allDataSets?.data?.map((ds: DataSet) => (
              <tr key={ds._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{ds.dataSetName}</td>
                <td className="p-3">{ds.userId.companyName}</td>
                <td className="p-3 flex items-center gap-2">
                  {ds.userId.imageLink && (
                    <Image
                      src={ds.userId.imageLink}
                      alt={ds.userId.firstName}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-medium">
                      {ds.userId.firstName} {ds.userId.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {ds.userId.email}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  {new Date(ds.createdAt).toLocaleString()}
                </td>
                <td className="p-3 text-center flex gap-3 justify-center">
                  <button
                    onClick={() => window.open(ds.dataSets, "_blank")}
                    className="cursor-pointer text-2xl"
                  >
                    👁
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDataSet(ds);
                      setIsEditModalOpen(true);
                    }}
                    className="cursor-pointer text-2xl"
                  >
                    ✏️
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 cursor-pointer text-2xl"
                    onClick={() => handleDeleteClick(ds)}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Dataset Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Dataset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Dataset Name</Label>
              <Input
                value={selectedDataSet?.dataSetName || ""}
                onChange={(e) =>
                  selectedDataSet &&
                  setSelectedDataSet({
                    ...selectedDataSet,
                    dataSetName: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Upload New Data Set</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="edit-file-upload"
                />
                <Label htmlFor="edit-file-upload" className="cursor-pointer">
                  <div className="text-gray-500 py-4">
                    Click & Upload your JSON file
                  </div>
                </Label>
                {uploadedFile && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {uploadedFile.name}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={handleEditDataSet}
              className="w-full"
              disabled={!selectedDataSet?.dataSetName && !uploadedFile}
            >
              {loadingEdit ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" /> Updating
                </div>
              ) : (
                "Update Dataset"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dataset Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Dataset</DialogTitle>
          </DialogHeader>
          <p className="mb-4">
            Are you sure you want to delete the dataset{" "}
            <strong>{datasetToDelete?.dataSetName}</strong>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>

            <Button
              className="bg-red-500 hover:bg-red-600 cursor-pointer"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
