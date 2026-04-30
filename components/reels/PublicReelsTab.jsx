"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import ReelCard from "@/components/reels/ReelCard";
import ReelCardSkleton from "@/components/reels/ReelCardSkleton";
import { Play } from "lucide-react";

export default function PublicReelsTab({
  reels,
  isLoading,
  pageReels,
  paginationData,
  onPageChange,
  onReelClick,
}) {
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
        <p className="text-gray-500 font-medium">No reels available</p>
        <p className="text-sm text-gray-400">
          Check back soon for community updates
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {reels.map((reel, index) => (
          <ReelCard
            key={reel.id}
            reel={reel}
            onView={() => onReelClick(reels, index)}
          />
        ))}
      </div>

      {/* Pagination */}
      {paginationData?.last_page > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => onPageChange(pageReels - 1)}
            disabled={pageReels === 1}
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
                variant={pageReels === p ? "default" : "outline"}
                onClick={() => onPageChange(p)}
                className="w-10 h-10 p-0 cursor-pointer"
              >
                {p}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => onPageChange(pageReels + 1)}
            disabled={pageReels === paginationData.last_page}
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}
