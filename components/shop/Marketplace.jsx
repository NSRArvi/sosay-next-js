"use client";

import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithToken } from "@/helpers/api";
import { useAppContext } from "@/context/context";
import {
  Search,
  Plus,
  Tag,
  Package,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ListingCard,
  ListingCardSkeleton,
} from "@/components/shop/Listingcard";
import { ProductDetailDialog } from "@/components/shop/Productdetaildialog";

function Pagination({ meta, page, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;
  const pages = Array.from({ length: meta.last_page }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-1 mt-8">
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

export default function Marketplace() {
  const { accessToken } = useAppContext();
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [page, setPage] = useState(1);
  //   const [newListingOpen, setNewListingOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const debounceRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setActiveSearch(value);
      setPage(1);
    }, 400);
  };

  const clearSearch = () => {
    setSearch("");
    setActiveSearch("");
    setPage(1);
  };

  // Build query string — send search to server so ALL pages are searched
  const qs = new URLSearchParams({ page });
  if (activeSearch.trim()) qs.set("search", activeSearch.trim());

  const { data, isLoading } = useQuery({
    queryKey: [`/marketplace/listings?${qs.toString()}`, accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
    keepPreviousData: true,
  });

  const paginatedData = data?.data;
  const listings = paginatedData?.data || [];

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="min-h-screen bg-gray-50 pb-16">
      {/* Top bar */}
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3 sticky top-0 z-50 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-8 py-2 text-sm bg-gray-100 rounded-full border border-transparent focus:outline-none focus:border-secondary/40 focus:bg-white transition"
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 leading-none"
            >
              ✕
            </button>
          )}
        </div>

        <Button
          type="button"
          onClick={handleSearchChange}
          className="cursor-pointer bg-secondary/90 hover:bg-secondary rounded-full gap-1.5 px-4 flex-shrink-0"
        >
          <span className="hidden sm:inline text-sm">Search</span>
        </Button>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Marketplace</h1>
            {!isLoading && paginatedData && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {activeSearch
                  ? `${paginatedData.total} result${paginatedData.total !== 1 ? "s" : ""} for "${activeSearch}"`
                  : `${paginatedData.total} listing${paginatedData.total !== 1 ? "s" : ""} available`}
              </p>
            )}
          </div>
          <Tag className="h-5 w-5 text-gray-300" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package className="h-12 w-12 text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">
              {activeSearch
                ? "No listings match your search"
                : "No listings yet"}
            </p>
            {activeSearch && (
              <button
                onClick={clearSearch}
                className="mt-2 text-sm text-secondary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {listings.map((item) => (
                <ListingCard
                  key={item.id}
                  item={item}
                  onSelect={(id) => setSelectedItemId(id)}
                />
              ))}
            </div>

            <Pagination
              meta={paginatedData}
              page={page}
              onPageChange={handlePageChange}
            />
            {paginatedData?.last_page > 1 && (
              <p className="text-center text-xs text-gray-400 mt-3">
                Page {paginatedData.current_page} of {paginatedData.last_page}
                {" · "}Showing {paginatedData.from}–{paginatedData.to} of{" "}
                {paginatedData.total}
              </p>
            )}
          </>
        )}
      </div>

      <ProductDetailDialog
        itemId={selectedItemId}
        open={!!selectedItemId}
        onClose={() => setSelectedItemId(null)}
        accessToken={accessToken}
      />
    </section>
  );
}
