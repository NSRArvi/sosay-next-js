"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ImagePlus, X, ChevronDown } from "lucide-react";
import { useAppContext } from "@/context/context";

const BASE_URL = process.env.NEXT_PUBLIC_API_DEV_URL;

const CONDITION_OPTIONS = [
  { value: "new", label: "New" },
  { value: "used_like_new", label: "Like New" },
  { value: "used_good", label: "Good" },
  { value: "used_fair", label: "Fair" },
];

const INITIAL_FORM = {
  title: "",
  description: "",
  price: "",
  currency: "USD",
  condition: "used_good",
  country_id: "",
  location: "",
  category_id: "",
};

export function NewListingDialog({ open, onClose, onSuccess }) {
  const { accessToken, countries, countriesLoading } = useAppContext();
  const [form, setForm] = useState(INITIAL_FORM);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const merged = [...images, ...files].slice(0, 5);
    setImages(merged);
    setPreviews(merged.map((f) => URL.createObjectURL(f)));
    if (merged.length > 0 && thumbnailIndex >= merged.length) {
      setThumbnailIndex(0);
    }
  };

  const removeImage = (index) => {
    const imgs = images.filter((_, i) => i !== index);
    setImages(imgs);
    setPreviews(imgs.map((f) => URL.createObjectURL(f)));
    if (imgs.length === 0) {
      setThumbnailIndex(0);
    } else if (thumbnailIndex >= imgs.length) {
      setThumbnailIndex(0);
    }
  };

  const resetAndClose = () => {
    setForm(INITIAL_FORM);
    setImages([]);
    setPreviews([]);
    setThumbnailIndex(0);
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!form.category_id) {
        throw new Error("Category is required.");
      }

      if (!form.location?.trim()) {
        throw new Error("Location is required.");
      }

      if (!form.country_id) {
        throw new Error("Country is required.");
      }

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("currency", form.currency);
      formData.append("category_id", form.category_id);
      formData.append("condition", form.condition);
      formData.append("country_id", form.country_id);
      formData.append("location", form.location.trim());
      if (form.description) formData.append("description", form.description);
      images.forEach((img, i) => formData.append(`images[${i}]`, img));
      if (images[thumbnailIndex]) {
        formData.append("thumbnail_image", images[thumbnailIndex]);
      }

      const res = await fetch(`${BASE_URL}/marketplace/listings`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await res.json();

      if (data.status === true || res.ok) {
        setSuccess(true);
        onSuccess?.(); // refetch the listings list
      } else {
        throw new Error(data.message || "Failed to create listing");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && resetAndClose()}>
      <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Create New Listing</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-base font-bold text-gray-800">Create New Listing</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Fill in the details to post your item.
            </p>
          </div>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <span className="text-2xl font-bold">✓</span>
            </div>
            <p className="text-gray-700 font-semibold">Listing Created!</p>
            <p className="text-sm text-gray-400">
              Your item has been posted to the marketplace.
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
                placeholder="Describe your item, features, any defects..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition resize-none"
              />
            </div>

            {/* Price + Currency */}
            <div className="flex gap-2">
              <div className="space-y-1 w-28 shrink-0">
                <label className="text-xs font-medium text-gray-600">Currency</label>
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-secondary/50 bg-white transition"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
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

            {/* Location + Country + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="space-y-1 flex-1">
                <label className="text-xs font-medium text-gray-600">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Dhaka, BD"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition"
                />
              </div>
              <div className="space-y-1 flex-1">
                <label className="text-xs font-medium text-gray-600">
                  Country <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="country_id"
                    value={form.country_id}
                    onChange={handleChange}
                    required
                    disabled={countriesLoading}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 bg-white appearance-none transition disabled:opacity-60"
                  >
                    <option value="" disabled>
                      {countriesLoading ? "Loading..." : "Select country"}
                    </option>
                    {countries.map((country) => (
                      <option key={country.id} value={String(country.id)}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
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

            {/* Images */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Images <span className="text-gray-400 font-normal">(up to 5)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {previews.map((src, i) => (
                  <div
                    key={i}
                    className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200"
                  >
                    <Image src={src} alt="" fill unoptimized className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setThumbnailIndex(i)}
                      className={`absolute bottom-0 left-0 right-0 text-[8px] text-white py-0.5 ${thumbnailIndex === i ? "bg-secondary/90" : "bg-black/50"}`}
                    >
                      {thumbnailIndex === i ? "Thumbnail" : "Set Thumbnail"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
                {previews.length < 5 && (
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
                {isSubmitting ? "Posting..." : "Post Listing"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}