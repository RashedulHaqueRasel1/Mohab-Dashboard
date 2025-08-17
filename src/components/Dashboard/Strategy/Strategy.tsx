"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStrategy, deleteStrategy } from "@/hooks/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Trash2 } from "lucide-react";
import { useState } from "react";
import { IStrategy, IStrategyResponse } from "@/types/next-auth";

export default function Strategy() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<IStrategyResponse>({
    queryKey: ["strategy"],
    queryFn: getStrategy,
  });

  const [selectedStrategy, setSelectedStrategy] = useState<IStrategy | null>(
    null
  );
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [answer, setAnswer] = useState("");

  // Delete Mutation
  const { mutate: removeStrategy, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteStrategy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strategy"] });
      setShowDeleteModal(false);
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Strategy</h1>
        <p className="text-gray-500 text-sm">
          Dashboard &gt; Strategy Management
        </p>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>User</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Data Strategy Focus Area</TableHead>
              <TableHead>Data Strategy Notes &amp; Requests</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data && data.data.length > 0 ? (
              data.data.map((item) => (
                <TableRow key={item._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.email}</div>
                  </TableCell>
                  <TableCell>{item.companyName}</TableCell>
                  <TableCell>{item.dataStrategy}</TableCell>
                  <TableCell className="truncate max-w-[220px]">
                    {item.strategyDescription}
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="flex justify-center gap-4">
                    <MessageSquare
                      className="w-5 h-5 cursor-pointer text-gray-600 hover:text-black"
                      onClick={() => {
                        setSelectedStrategy(item);
                        setShowMessageModal(true);
                      }}
                    />
                    <Trash2
                      className="w-5 h-5 cursor-pointer text-red-500 hover:text-red-700"
                      onClick={() => {
                        setSelectedStrategy(item);
                        setShowDeleteModal(true);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No strategies found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-500">
        Showing {data?.data?.length || 0} of {data?.totalItems || 0} results
      </div>

      {/* Message Modal */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Data Strategy Notes &amp; Requests</DialogTitle>
            <DialogDescription>
              {selectedStrategy?.strategyDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <label className="text-sm font-medium">Answer</label>
            <Textarea
              placeholder="Write..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button className="w-full">Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Strategy</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this strategy? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedStrategy && removeStrategy(selectedStrategy._id)
              }
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
