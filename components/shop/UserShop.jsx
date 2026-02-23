"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  MoreVertical,
  Pencil,
  Trash2,
  Tag,
  Loader2,
  ImagePlus,
  X,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import toast from "react-hot-toast";
import { ListingCardSkeleton } from "./Listingcard";
import { NewListingDialog } from "./Newlistingdialog";

const BASE_URL = process.env.NEXT_PUBLIC_API_DEV_URL;

const CONDITION_OPTIONS = [
  { value: "new", label: "New" },
  { value: "used_like_new", label: "Like New" },
  { value: "used_good", label: "Good" },
  { value: "used_fair", label: "Fair" },
  { value: "used_poor", label: "Poor" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "sold", label: "Sold", style: "bg-gray-100 text-gray-600 border-gray-200" },
  { value: "pending", label: "Pending", style: "bg-amber-50 text-amber-700 border-amber-200" },
];

// Update Listing Dialog 

function UpdateListingDialog({ open, onClose, item, accessToken, onSuccess }) {
  const [form, setForm] = useState({
    title: item?.title || "",
    description: item?.description || "",
    price: item?.price || "",
    currency: item?.currency || "BDT",
    condition: item?.condition || "used_good",
    location: item?.location || "",
    category_id: item?.category_id || "",
  });
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/marketplace/categories", accessToken],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/marketplace/categories`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.json();
    },
    enabled: !!accessToken && open,
    staleTime: 1000 * 60 * 5,
  });
  const categories = categoriesData?.data || [];

  // Sync form when item changes
  React.useEffect(() => {
    if (item) {
      setForm({
        title: item.title || "",
        description: item.description || "",
        price: item.price || "",
        currency: item.currency || "BDT",
        condition: item.condition || "used_good",
        location: item.location || "",
        category_id: item.category_id || "",
      });
      setNewImages([]);
      setNewPreviews([]);
      setError(null);
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const merged = [...newImages, ...files].slice(0, 5);
    setNewImages(merged);
    setNewPreviews(merged.map((f) => URL.createObjectURL(f)));
  };

  const removeNewImage = (index) => {
    const imgs = newImages.filter((_, i) => i !== index);
    setNewImages(imgs);
    setNewPreviews(imgs.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("category_id", form.category_id || "1");
      formData.append("condition", form.condition);
      formData.append("location", form.location);
      if (form.description) formData.append("description", form.description);
      newImages.forEach((img, i) => formData.append(`images[${i}]`, img));

      const res = await fetch(`${BASE_URL}/marketplace/listings/${item.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await res.json();
      if (data.status === true || res.ok) {
        toast.success(data.message || "Listing updated!");
        onSuccess?.();
        onClose();
      } else {
        throw new Error(data.message || "Failed to update listing");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const existingImages = item?.images || [];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="mb-1">
          <h2 className="text-base font-bold text-gray-800">Edit Listing</h2>
          <p className="text-xs text-gray-400 mt-0.5">Update your listing details below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. iPhone 13 Pro Max 256GB"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your item..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition resize-none"
            />
          </div>

          {/* Price + Currency */}
          <div className="flex gap-2">
            <div className="space-y-1 w-28 flex-shrink-0">
              <label className="text-xs font-medium text-gray-600">Currency</label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-secondary/50 bg-white transition"
              >
                <option value="BDT">BDT</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="space-y-1 flex-1">
              <label className="text-xs font-medium text-gray-600">
                Price <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition"
              />
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Condition <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CONDITION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, condition: opt.value }))}
                  className={`px-3 py-1.5 text-xs rounded-full border font-medium transition ${
                    form.condition === opt.value
                      ? "bg-secondary text-white border-secondary"
                      : "border-gray-200 text-gray-500 hover:border-secondary/40"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location + Category */}
          <div className="flex gap-2">
            <div className="space-y-1 flex-1">
              <label className="text-xs font-medium text-gray-600">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Dhaka, BD"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition"
              />
            </div>
            <div className="space-y-1 flex-1">
              <label className="text-xs font-medium text-gray-600">
                Category <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  disabled={categoriesLoading}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 bg-white appearance-none transition disabled:opacity-60"
                >
                  <option value="" disabled>
                    {categoriesLoading ? "Loading..." : "Select category"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Current Images</label>
              <div className="flex flex-wrap gap-2">
                {existingImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200"
                  >
                    <img src={img.image_path} alt="" className="w-full h-full object-cover" />
                    {img.is_thumbnail === 1 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-secondary/80 text-white text-[8px] text-center py-0.5">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Add New Images{" "}
              <span className="text-gray-400 font-normal">(replaces existing)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {newPreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200"
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
              {newPreviews.length < 5 && (
                <label className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-secondary/50 transition text-gray-300 hover:text-secondary/60">
                  <ImagePlus className="h-5 w-5" />
                  <span className="text-[10px] mt-0.5">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-full bg-secondary hover:bg-secondary/90 gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Status Update Dialog 

function UpdateStatusDialog({ open, onClose, item, accessToken, onSuccess }) {
  const [selectedStatus, setSelectedStatus] = useState(item?.status || "active");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (item) setSelectedStatus(item.status || "active");
  }, [item]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("status", selectedStatus);

      const res = await fetch(`${BASE_URL}/marketplace/listings/${item.id}/status`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await res.json();
      if (data.status === true || res.ok) {
        toast.success(data.message || "Status updated!");
        onSuccess?.();
        onClose();
      } else {
        throw new Error(data.message || "Failed to update status");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm rounded-2xl">
        <div className="mb-4">
          <h2 className="text-base font-bold text-gray-800">Update Status</h2>
          <p className="text-xs text-gray-400 mt-0.5">Change the listing status.</p>
        </div>

        <div className="space-y-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedStatus(opt.value)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition ${
                selectedStatus === opt.value
                  ? "border-secondary bg-secondary/5 text-secondary"
                  : "border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs border ${opt.style}`}>
                  {opt.label}
                </Badge>
              </span>
              {selectedStatus === opt.value && (
                <CheckCircle2 className="h-4 w-4 text-secondary" />
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 rounded-full bg-secondary hover:bg-secondary/90 gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// My Listing Card (with action menu) 

function MyListingCard({ item, onEdit, onDelete, onStatusUpdate }) {
  const thumbnail = item.images?.find((img) => img.is_thumbnail === 1) || item.images?.[0];

  const statusConfig = STATUS_OPTIONS.find((s) => s.value === item.status) || STATUS_OPTIONS[0];

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Image */}
      <div className="relative bg-gray-100 h-44 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail.image_path}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
            <Package className="h-10 w-10 mb-1" />
            <span className="text-xs">No image</span>
          </div>
        )}
        {/* Status badge */}
        <Badge
          variant="outline"
          className={`absolute top-2 left-2 text-xs border capitalize ${statusConfig.style}`}
        >
          {statusConfig.label}
        </Badge>

        {/* Action menu */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition">
                <MoreVertical className="h-3.5 w-3.5 text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuItem
                onClick={() => onEdit(item)}
                className="cursor-pointer gap-2 text-sm"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Listing
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusUpdate(item)}
                className="cursor-pointer gap-2 text-sm"
              >
                <Tag className="h-3.5 w-3.5" />
                Update Status
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(item)}
                className="cursor-pointer gap-2 text-sm text-red-500 focus:text-red-500 focus:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-1.5">
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug">
          {item.title}
        </h3>
        {item.location && (
          <p className="text-xs text-gray-400 truncate">{item.location}</p>
        )}
        <p className="text-base font-bold text-secondary">
          {item.currency} {parseFloat(item.price).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

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