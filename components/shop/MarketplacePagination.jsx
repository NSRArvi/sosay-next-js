import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function MarketplacePagination({ meta, page, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;
  const pages = Array.from({ length: meta.last_page }, (_, i) => i + 1);

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!meta.prev_page_url}
        className="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 text-gray-500 hover:border-secondary hover:text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`h-9 w-9 rounded-lg text-sm font-medium transition border ${
            p === page
              ? "bg-secondary text-white border-secondary"
              : "border-gray-200 text-gray-600 hover:border-secondary hover:text-secondary"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!meta.next_page_url}
        className="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 text-gray-500 hover:border-secondary hover:text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
