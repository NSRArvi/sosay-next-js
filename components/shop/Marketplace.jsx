"use client";

import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithToken } from "@/helpers/api";
import { useAppContext } from "@/context/context";
import { useRouter } from "next/navigation";
import {
  Search,
  Tag,
  Package,
  SlidersHorizontal,
  X,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ListingCard,
  ListingCardSkeleton,
} from "@/components/shop/Listingcard";
import CategoryDialog from "@/components/shop/CategoryDialog";
import MarketplacePagination from "@/components/shop/MarketplacePagination";
import MarketplaceFilterPanel from "@/components/shop/MarketplaceFilterPanel";
import ActiveFilterBadges from "@/components/shop/ActiveFilterBadges";

const BASE_URL = process.env.NEXT_PUBLIC_API_DEV_URL;

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "asc", label: "Low to High" },
  { value: "desc", label: "High to Low" },
];

let hasShownInitialCategoryDialog = false;

// ─── Marketplace ───────────────────────────────────────────────────────────────

export default function Marketplace() {
  const { accessToken } = useAppContext();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(() => {
    if (hasShownInitialCategoryDialog) return false;
    hasShownInitialCategoryDialog = true;
    return true;
  });
  const debounceRef = useRef(null);

  const EMPTY_FILTERS = {
    category_id: "",
    min_price: "",
    max_price: "",
    sort_by_price: "",
  };
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/marketplace/categories", accessToken],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/marketplace/categories`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.json();
    },
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5,
  });
  const categories = categoriesData?.data || [];

  const handleInitialCategorySelect = (categoryId) => {
    setFilters((prev) => ({ ...prev, category_id: String(categoryId) }));
    setPage(1);
    setCategoryPickerOpen(false);
  };

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

  const removeFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
    setPage(1);
  };

  const resetAllFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  // Build query string
  const qs = new URLSearchParams({ page });
  if (activeSearch.trim()) qs.set("search", activeSearch.trim());
  if (filters.category_id) qs.set("category_id", filters.category_id);
  if (filters.min_price) qs.set("min_price", filters.min_price);
  if (filters.max_price) qs.set("max_price", filters.max_price);
  if (filters.sort_by_price) qs.set("sort_by_price", filters.sort_by_price);

  const { data, isLoading } = useQuery({
    queryKey: [`/marketplace/listings?${qs.toString()}`, accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
    keepPreviousData: true,
  });

  const paginatedData = data?.pagination;
  const listings = data?.data || [];

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="min-h-screen bg-gray-50 pb-16">
      {/* Top bar */}
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3 rounded-xl border border-gray-200 bg-white/90 px-3 py-3 backdrop-blur-sm sm:px-4 sticky top-0 z-50">
        {/* Search input */}
        <div className="flex-1 relative">
          <Search className="absolute z-0 left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter button */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-secondary hover:text-secondary transition shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-secondary text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 sm:w-96 p-0 flex flex-col">
            <SheetHeader className="px-4 pt-4 pb-0">
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden px-4">
              <MarketplaceFilterPanel
                filters={filters}
                setFilters={(f) => {
                  setFilters(f);
                  setPage(1);
                }}
              categories={categories}
              categoriesLoading={categoriesLoading}
              onApply={() => setSheetOpen(false)}
              onReset={() => setSheetOpen(false)}
            />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mx-auto mt-6 w-full max-w-5xl px-3 sm:px-4">
        {/* Header row */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Marketplace</h1>
            {!isLoading && paginatedData && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {activeSearch
                  ? `${paginatedData.total} result${paginatedData.total !== 1 ? "s" : ""} for "${activeSearch}"`
                  : `${paginatedData.total} listing${paginatedData.total !== 1 ? "s" : ""} available`}
              </p>
            )}
            {/* Active filter badges */}
            <ActiveFilterBadges
              filters={filters}
              categories={categories}
              onRemove={(key) => {
                removeFilter(key);
              }}
            />
          </div>

          {/* Sort shortcut (mirrors sheet but quick access) */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={filters.sort_by_price}
              onChange={(e) => {
                setFilters((p) => ({ ...p, sort_by_price: e.target.value }));
                setPage(1);
              }}
              className="text-xs text-gray-600 border-none bg-transparent focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Listings grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package className="h-12 w-12 text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">
              {activeSearch || activeFilterCount > 0
                ? "No listings match your filters"
                : "No listings yet"}
            </p>
            {(activeSearch || activeFilterCount > 0) && (
              <button
                onClick={() => {
                  clearSearch();
                  resetAllFilters();
                }}
                className="mt-2 text-sm text-secondary hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {listings.map((item) => (
                <ListingCard
                  key={item.id}
                  item={item}
                  onSelect={(id) => router.push(`/app/shop/${id}`)}
                />
              ))}
            </div>

            <MarketplacePagination
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

      <CategoryDialog
        open={categoryPickerOpen}
        onOpenChange={setCategoryPickerOpen}
        categoriesLoading={categoriesLoading}
        categories={categories}
        onSelect={handleInitialCategorySelect}
      />
    </section>
  );
}
