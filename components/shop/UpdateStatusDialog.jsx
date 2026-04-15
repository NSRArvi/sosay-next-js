"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_DEV_URL;

const STATUS_OPTIONS = [
  { value: "active", label: "Active", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "sold", label: "Sold", style: "bg-gray-100 text-gray-600 border-gray-200" },
  { value: "pending", label: "Pending", style: "bg-amber-50 text-amber-700 border-amber-200" },
];

export default function UpdateStatusDialog({ open, onClose, item, accessToken, onSuccess }) {
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
        <DialogHeader className="sr-only">
          <DialogTitle>Update Listing Status</DialogTitle>
        </DialogHeader>

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
