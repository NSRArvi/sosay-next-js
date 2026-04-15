"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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
import {
  Plus,
  Package,
  Loader2,
} from "lucide-react";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import toast from "react-hot-toast";
import { ListingCardSkeleton } from "./Listingcard";
import { NewListingDialog } from "./Newlistingdialog";
import UpdateListingDialog from "./UpdateListingDialog";
import UpdateStatusDialog from "./UpdateStatusDialog";
import MyListingCard from "./MyListingCard";

const BASE_URL = process.env.NEXT_PUBLIC_API_DEV_URL;

// UserShop 
export default function UserShop() {
  const { accessToken } = useAppContext();
  const queryClient = useQueryClient();

  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [statusItem, setStatusItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["/marketplace/me/listings", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  const handleDelete = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("_method", "DELETE");

      const res = await fetch(`${BASE_URL}/marketplace/listings/${deleteItem.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await res.json();
      if (data.status === true || res.ok) {
        toast.success(data.message || "Listing deleted.");
        queryClient.invalidateQueries(["/marketplace/me/listings"]);
      } else {
        throw new Error(data.message || "Failed to delete listing");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsDeleting(false);
      setDeleteItem(null);
    }
  };

  const refetch = () => queryClient.invalidateQueries(["/marketplace/me/listings"]);

  const listings = data?.data || [];

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">My Listings</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {listings.length} item{listings.length !== 1 ? "s" : ""} listed
          </p>
        </div>
        <Button
          onClick={() => setShowNewDialog(true)}
          className="rounded-full bg-secondary hover:bg-secondary/90 gap-1.5 text-sm"
        >
          <Plus className="h-4 w-4" />
          New Listing
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 text-sm mb-3">Failed to load your listings.</p>
          <Button variant="outline" onClick={refetch} className="rounded-full text-sm">
            Try Again
          </Button>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl">
          <Package className="h-12 w-12 mx-auto text-gray-200 mb-3" />
          <h3 className="text-sm font-semibold text-gray-500 mb-1">No listings yet</h3>
          <p className="text-xs text-gray-400 mb-4">
            Start selling by creating your first listing.
          </p>
          <Button
            onClick={() => setShowNewDialog(true)}
            className="rounded-full bg-secondary hover:bg-secondary/90 gap-1.5 text-sm"
          >
            <Plus className="h-4 w-4" />
            Create Listing
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {listings.map((item) => (
            <MyListingCard
              key={item.id}
              item={item}
              onEdit={(item) => setEditItem(item)}
              onDelete={(item) => setDeleteItem(item)}
              onStatusUpdate={(item) => setStatusItem(item)}
            />
          ))}
        </div>
      )}

      {/* New Listing Dialog */}
      <NewListingDialog
        open={showNewDialog}
        onClose={() => setShowNewDialog(false)}
        accessToken={accessToken}
        onSuccess={refetch}
      />

      {/* Edit Dialog */}
      {editItem && (
        <UpdateListingDialog
          open={!!editItem}
          onClose={() => setEditItem(null)}
          item={editItem}
          accessToken={accessToken}
          onSuccess={refetch}
        />
      )}

      {/* Status Dialog */}
      {statusItem && (
        <UpdateStatusDialog
          open={!!statusItem}
          onClose={() => setStatusItem(null)}
          item={statusItem}
          accessToken={accessToken}
          onSuccess={refetch}
        />
      )}

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteItem} onOpenChange={(v) => !v && setDeleteItem(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-700">{deleteItem?.title}</span>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-full bg-red-500 hover:bg-red-600 gap-2"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}