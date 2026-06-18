"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken } from "@/helpers/api";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ContentCard from "@/components/contents/ContentCard";
import ContentCardSkeleton from "@/components/contents/ContentCardSkeleton";
import { Play, Upload } from "lucide-react";
import toast from "react-hot-toast";

export default function MyContentTab({
  accessToken,
  onUploadClick,
  onContentClick,
}) {
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["/contents/me", accessToken, page],
    queryFn: () =>
      fetchWithToken({
        queryKey: [`/contents/me?page=${page}`, accessToken],
      }),
    enabled: !!accessToken,
    keepPreviousData: true,
  });

  const contents = Array.isArray(data?.data) ? data.data : [];
  const paginationData = data?.pagination || null;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ contentId, type }) => {
      const url = `${process.env.NEXT_PUBLIC_API_DEV_URL}/contents/${contentId}/toggle-${type}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (!response.ok || !result.status) {
        throw new Error(result.message || "Failed to toggle status");
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/contents/me"] });
      toast.success(data.message || "Status updated");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const handleTogglePremium = (contentId) => {
    toggleStatusMutation.mutate({ contentId, type: "premium" });
  };

  const handleToggleActive = (contentId) => {
    toggleStatusMutation.mutate({ contentId, type: "active" });
  };

  const handleDeleteClick = (contentId) => {
    setContentToDelete(contentId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!contentToDelete) return;

    setDeletingId(contentToDelete);
    setShowDeleteConfirm(false);

    try {
      const formData = new FormData();
      formData.append("_method", "DELETE");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_DEV_URL}/contents/${contentToDelete}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await res.json();

      if (data.status === true || res.ok) {
        toast.success(data.message || "Content deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["/contents/me"] });
      } else {
        toast.error(data.message || "Failed to delete content");
      }
    } catch (err) {
      toast.error("Error deleting content");
      console.error(err);
    } finally {
      setDeletingId(null);
      setContentToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <ContentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Play className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No content uploaded yet</p>
        <p className="text-sm text-gray-400">
          Upload your first content to get started
        </p>
        <Button onClick={onUploadClick} className="mt-4 gap-2 cursor-pointer">
          <Upload className="h-4 w-4" />
          Upload Content
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contents.map((content) => (
          <ContentCard
            key={content.id}
            content={content}
            onView={() => onContentClick?.(content.id)}
            onTogglePremium={() => handleTogglePremium(content.id)}
            onToggleActive={() => handleToggleActive(content.id)}
            onDelete={() => handleDeleteClick(content.id)}
            isDeleting={deletingId === content.id}
          />
        ))}
      </div>

      {/* Pagination */}
      {paginationData?.last_page > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="cursor-pointer"
          >
            Previous
          </Button>
          <div className="flex gap-1">
            {Array.from(
              { length: paginationData.last_page },
              (_, i) => i + 1,
            ).map((p) => (
              <Button
                key={p}
                variant={page === p ? "default" : "outline"}
                onClick={() => handlePageChange(p)}
                className="w-10 h-10 p-0 cursor-pointer"
              >
                {p}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === paginationData.last_page}
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this content? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 cursor-pointer text-white"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
