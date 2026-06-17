"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithToken } from "@/helpers/api";
import { Button } from "@/components/ui/button";
import ContentCard from "@/components/contents/ContentCard";
import ContentCardSkeleton from "@/components/contents/ContentCardSkeleton";
import { Play, Upload } from "lucide-react";

export default function MyContentTab({
  accessToken,
  onUploadClick,
  onContentClick,
}) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["/contents/me", accessToken, page],
    queryFn: () =>
      fetchWithToken({
        queryKey: [`/contents/me?page=${page}`, accessToken],
      }),
    enabled: !!accessToken,
    keepPreviousData: true,
  });

  const contents = Array.isArray(data?.data) ? data.data : [];
  const paginationData = data?.pagination || null;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <ContentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Play className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No content uploaded yet</p>
        <p className="text-sm text-gray-400">
          Upload your first content to get started
        </p>
        <Button onClick={onUploadClick} className="mt-4 gap-2 cursor-pointer">
          <Upload className="h-4 w-4" />
          Upload Content
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contents.map((content) => (
          <ContentCard
            key={content.id}
            content={content}
            onView={() => onContentClick?.(content.id)}
          />
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
    </>
  );
}
