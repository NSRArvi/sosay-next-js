"use client";

import React from "react";
import { MapPin, Package, ChevronRight, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="bg-gray-200 h-44 w-full" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-5 bg-gray-200 rounded w-1/4 mt-2" />
      </div>
    </div>
  );
}

export function ListingCard({ item, onSelect }) {
  const thumbnail =
    item.images?.find((img) => img.is_thumbnail === 1) || item.images?.[0];
  const conditionStyle =
    CONDITION_STYLES[item.condition] || CONDITION_STYLES["used_fair"];
  const conditionLabel = CONDITION_LABELS[item.condition] || item.condition;

  return (
    <div
      onClick={() => onSelect(item.id)}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
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
        <Badge
          className={`absolute top-2 left-2 capitalize text-xs border ${conditionStyle}`}
          variant="outline"
        >
          {conditionLabel}
        </Badge>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug group-hover:text-secondary transition-colors">
          {item.title}
        </h3>

        {item.location && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        )}

        {item.country && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Globe className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{item.country.name}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Avatar className="h-4 w-4">
            <AvatarImage src={item.user?.profile_picture} />
            <AvatarFallback className="text-[8px] bg-secondary/10 text-secondary capitalize">
              {item.user?.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{item.user?.name}</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-bold text-secondary">
            {item.currency} {parseFloat(item.price).toLocaleString()}
          </span>
          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-secondary transition-colors" />
        </div>
      </div>
    </div>
  );
}