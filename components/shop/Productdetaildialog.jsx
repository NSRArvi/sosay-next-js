"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithToken } from "@/helpers/api";
import { MapPin, Package, Tag, Loader2, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CONDITION_STYLES = {
  new: "bg-emerald-50 text-emerald-700 border-emerald-200",
  used_like_new: "bg-blue-50 text-blue-700 border-blue-200",
  used_good: "bg-amber-50 text-amber-700 border-amber-200",
  used_fair: "bg-orange-50 text-orange-700 border-orange-200",
  used_poor: "bg-red-50 text-red-700 border-red-200",
};

const CONDITION_LABELS = {
  new: "New",
  used_like_new: "Like New",
  used_good: "Good",
  used_fair: "Fair",
  used_poor: "Poor",
};

function DetailContent({
  itemId,
  accessToken,
  onContactSeller,
}) {
  const [activeImage, setActiveImage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: [`/marketplace/listings/${itemId}`, accessToken],
    queryFn: fetchWithToken,
    enabled: !!itemId && !!accessToken,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-6">
        <Package className="h-10 w-10 text-gray-200 mb-3" />
        <p className="text-gray-400 font-medium">Failed to load listing.</p>
        <p className="text-gray-300 text-xs mt-1">Please try again later.</p>
      </div>
    );
  }

  const item = data.data;
  const conditionStyle =
    CONDITION_STYLES[item.condition] || CONDITION_STYLES["used_fair"];
  const conditionLabel = CONDITION_LABELS[item.condition] || item.condition;
  const images = item.images || [];

  return (
    <div className="flex flex-col sm:flex-row gap-0 overflow-hidden">
      {/* Left: Images */}
      <div className="sm:w-60 shrink-0 bg-gray-50">
        <div className="relative h-56 sm:h-72 bg-gray-100 overflow-hidden">
          {images.length > 0 ? (
            <img
              src={images[activeImage]?.image_path}
              alt={item.title}
              className="w-full h-full object-cover transition-opacity duration-200"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
              <Package className="h-12 w-12 mb-1" />
              <span className="text-xs">No image</span>
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-1.5 p-2 flex-wrap">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`w-10 h-10 rounded-md overflow-hidden border-2 transition-all ${
                  i === activeImage
                    ? "border-secondary shadow-sm"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img.image_path}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Details */}
      <div className="flex-1 p-5 overflow-y-auto max-h-[70vh] space-y-4">
        {/* Title + condition */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-800 leading-snug">
            {item.title}
          </h2>
          <Badge
            className={`capitalize text-xs border shrink-0 mt-0.5 ${conditionStyle}`}
            variant="outline"
          >
            {conditionLabel}
          </Badge>
        </div>

        {/* Price */}
        <p className="text-2xl font-extrabold text-secondary">
          {item.currency} {parseFloat(item.price).toLocaleString()}
        </p>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {item.description}
          </p>
        )}

        {/* Meta */}
        <div className="space-y-2">
          {item.location && (
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{item.location}</span>
            </div>
          )}
          {item.category && (
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <Tag className="h-4 w-4 shrink-0" />
              <span>{item.category}</span>
            </div>
          )}
        </div>

        {/* Seller */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <Avatar className="h-9 w-9">
            <AvatarImage src={item.user?.profile_picture} />
            <AvatarFallback className="text-sm bg-secondary/10 text-secondary capitalize">
              {item.user?.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {item.user?.name}
            </p>
            <p className="text-xs text-gray-400">Seller</p>
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={() => {
            onContactSeller?.(item.user);
          }}
          className="w-full bg-secondary hover:bg-secondary/90 rounded-full gap-2 mt-2"
        >
          <MessageCircle className="h-4 w-4" />
          Contact Seller
        </Button>
      </div>
    </div>
  );
}

export function ProductDetailDialog({
  itemId,
  open,
  onClose,
  accessToken,
  setOpenChatDialog,
  setReceiver,
}) {
  const handleContactSeller = (seller) => {
    onClose?.();
    setReceiver?.(seller);
    setOpenChatDialog?.(true);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg overflow-hidden rounded-2xl gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>

        {/* Only render (and fetch) when open and itemId is set */}
        {open && itemId && (
          <DetailContent
            itemId={itemId}
            accessToken={accessToken}
            onContactSeller={handleContactSeller}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}