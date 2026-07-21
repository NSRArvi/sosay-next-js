"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken } from "@/helpers/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ReelCard from "@/components/reels/ReelCard";
import ReelCardSkleton from "@/components/reels/ReelCardSkleton";
import { Play, Upload, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_DEV_URL;

export default function MyReelsTab({
  accessToken,
  onReelClick,
  onUploadClick,
}) {
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reelToDelete, setReelToDelete] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["/my-reels", accessToken, page],
    queryFn: () =>
      fetchWithToken({
        queryKey: [`/my-reels?page=${page}`, accessToken],
      }),
    enabled: !!accessToken,
    keepPreviousData: true,
  });

  const myReelsPayload = data?.data;
  const reels = Array.isArray(myReelsPayload)
    ? myReelsPayload
    : Array.isArray(myReelsPayload?.data)
      ? myReelsPayload.data
      : [];
  const paginationData = Array.isArray(myReelsPayload) ? null : myReelsPayload;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (reelId, e) => {
    e.stopPropagation();
    setReelToDelete(reelId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!reelToDelete) return;

    setDeletingId(reelToDelete);
    setShowDeleteConfirm(false);

    try {
      const formData = new FormData();
      formData.append("_method", "DELETE");

      const res = await fetch(`${BASE_URL}/reels/${reelToDelete}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await res.json();

      if (data.status === true) {
        toast.success("Reel deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["/my-reels"] });
      } else {
        toast.error(data.message || "Failed to delete reel");
      }
    } catch (err) {
      toast.error("Error deleting reel");
      console.error(err);
    } finally {
      setDeletingId(null);
      setReelToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <ReelCardSkleton key={i} />
        ))}
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Play className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No reels uploaded yet</p>
        <p className="text-sm text-gray-400">
          Upload your first reel to get started
        </p>
        <Button onClick={onUploadClick} className="mt-4 gap-2 cursor-pointer">
          <Upload className="h-4 w-4" />
          Upload Reel
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-800">My Reels</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {reels.length} item{reels.length !== 1 ? "s" : ""} listed
          </p>
        </div>
        <Link
          href="/app/reels"
          className="cursor-pointer text-xs px-4 py-2 bg-secondary rounded-full text-white"
        >
          Explore Reels
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className="relative group"
            onClick={() => onReelClick(reels, index)}
          >
            <ReelCard reel={reel} onView={() => {}} />
            <button
              onClick={(e) => handleDeleteClick(reel.id, e)}
              disabled={deletingId === reel.id}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/90 hover:bg-red-600 disabled:opacity-50 text-white rounded-full p-2 z-10"
              title="Delete reel"
            >
              {deletingId === reel.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
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
            <AlertDialogTitle>Delete Reel?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reel? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
