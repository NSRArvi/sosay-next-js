"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Link2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_DEV_URL;

export default function ShopUrlDialog({
  open,
  onClose,
  accessToken,
  onSuccess,
  existingShopUrl,
}) {
  const [shopUrl, setShopUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const resetAndClose = () => {
    setShopUrl("");
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shopUrl.trim()) {
      toast.error("Please enter a shop URL.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("shop_url", shopUrl.trim());

      const res = await fetch(`${BASE_URL}/marketplace/create-shop`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await res.json();

      if (data.status === true) {
        setSuccess(true);
        toast.success(data.message || "Shop created successfully!");
        queryClient.invalidateQueries({
          queryKey: ["/marketplace/check-if-shop-available"],
        });
        onSuccess?.();
      } else {
        toast.error(data.message || "Failed to create shop.");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && resetAndClose()}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Set Shop URL</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-base font-bold text-gray-800">Set Shop URL</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Link your external shop to the marketplace.
            </p>
          </div>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="text-gray-700 font-semibold">Shop URL Saved!</p>
            <p className="text-sm text-gray-400">
              Your shop has been linked to the marketplace.
            </p>
            <Button
              type="button"
              onClick={resetAndClose}
              className="mt-2 rounded-full bg-secondary hover:bg-secondary/90 px-8"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Shop URL <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="url"
                  value={shopUrl || existingShopUrl}
                  onChange={(e) => setShopUrl(e.target.value)}
                  required
                  placeholder="https://example.com"
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={resetAndClose}
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
                {isSubmitting ? "Saving..." : "Save URL"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
