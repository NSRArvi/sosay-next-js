"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Package, MoreVertical, Pencil, Trash2, Tag } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "active", label: "Active", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "sold", label: "Sold", style: "bg-gray-100 text-gray-600 border-gray-200" },
  { value: "pending", label: "Pending", style: "bg-amber-50 text-amber-700 border-amber-200" },
];

export default function MyListingCard({ item, onEdit, onDelete, onStatusUpdate }) {
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
