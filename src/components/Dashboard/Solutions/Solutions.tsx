"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteSolution, getSolutions, updateSolution, createSolution } from '@/hooks/api';
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {  Trash2, Plus, SquarePen } from 'lucide-react';
import { toast } from 'sonner';

interface Solution {
  _id: string;
  solutionName: string;
  solutionDescription: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SolutionsResponse {
  data: Solution[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export default function Solutions() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<SolutionsResponse>({
    queryKey: ["solutions"],
    queryFn: getSolutions,
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentSolution, setCurrentSolution] = useState<Solution | null>(null);
  const [formData, setFormData] = useState({
    solutionName: '',
    solutionDescription: ''
  });

  // Delete Mutation
  const { mutate: deleteSolutionMutation, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteSolution(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solutions"] });
      setShowDeleteModal(false);
      toast.success("Solution deleted successfully");
    },
    onError: () => {
      toast.warning( "Failed to delete solution");
    }
  });

  // Update Mutation
  const { mutate: updateSolutionMutation, isPending: isUpdating } = useMutation({
    mutationFn: () => {
      if (!currentSolution?._id) throw new Error("No solution ID");
      return updateSolution(currentSolution._id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solutions"] });
      setShowEditModal(false);
      toast.success("Solution updated successfully");
    },
    onError: () => {
      toast.warning("Failed to update solution");
    }
  });

  // Create Mutation
  const { mutate: createSolutionMutation, isPending: isCreating } = useMutation({
    mutationFn: () => createSolution(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solutions"] });
      setShowAddModal(false);
      setFormData({
        solutionName: '',
        solutionDescription: ''
      });
      toast.success("Solution created successfully");
    },
    onError: () => {
      toast.warning("Failed to create solution");
    }
  });

  const handleEditClick = (solution: Solution) => {
    setCurrentSolution(solution);
    setFormData({
      solutionName: solution.solutionName,
      solutionDescription: solution.solutionDescription
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (solution: Solution) => {
    setCurrentSolution(solution);
    setShowDeleteModal(true);
  };

  const handleAddClick = () => {
    setFormData({
      solutionName: '',
      solutionDescription: ''
    });
    setShowAddModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSolutionMutation();
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSolutionMutation();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  if (isLoading) return <div>Loading solutions...</div>;
  if (isError) return <div>Error loading solutions</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Solutions</h1>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" /> Add Solution
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Dashboard &gt; Solutions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solutions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.map((solution) => (
                <tr key={solution._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{solution.solutionName}</div>
                    {solution.solutionDescription && (
                      <div className="text-gray-500">{solution.solutionDescription}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {solution.createdAt && format(new Date(solution.createdAt), 'MM/dd/yyyy, hh:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-4">
                      <button 
                        onClick={() => handleEditClick(solution)}
                        className="text-gray-500 hover:text-blue-500 cursor-pointer"
                      >
                        <SquarePen className="h-5 w-5"/>
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(solution)}
                        className="text-red-500 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-gray-50 text-right text-sm text-gray-500">
          Showing 1 to {data?.data?.length || 0} of {data?.pagination?.totalItems || 0} results
        </div>
      </div>

      {/* Edit Solution Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Solution</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="solutionName" className='my-2'>Solution Name</Label>
              <Input
                id="solutionName"
                value={formData.solutionName}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <Label htmlFor="solutionDescription" className='my-2'>Description</Label>
              <Textarea
                id="solutionDescription"
                value={formData.solutionDescription}
                onChange={handleFormChange}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                className='cursor-pointer'
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating} className='cursor-pointer'>
                {isUpdating ? "Updating..." : "Update Solution"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Solution Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Solution</DialogTitle>
            <p className='text-gray-400'>Fill in the form below to add a new solution.</p>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <Label htmlFor="solutionName" className='my-2'>Solution Name</Label>
              <Input
                id="solutionName"
                value={formData.solutionName}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <Label htmlFor="solutionDescription" className='my-2'>Description</Label>
              <Textarea
                id="solutionDescription"
                value={formData.solutionDescription}
                onChange={handleFormChange}
              />
            </div>
            <div className="flex justify-end space-x-2 ">
              <Button 
                type="button" 
                variant="outline" 
                className='cursor-pointer'
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating} className='cursor-pointer'>
                {isCreating ? "Creating..." : "Create Solution"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the solution.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => currentSolution && deleteSolutionMutation(currentSolution._id)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}