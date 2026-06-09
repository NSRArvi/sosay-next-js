"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithToken } from "@/helpers/api";
import { useAppContext } from "@/context/context";
import { useRouter } from "next/navigation";
import {
  Search,
  Package,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Globe,
} from "lucide-react";

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
  const [isMobile, setIsMobile] = useState(false);
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(() => {
    if (hasShownInitialCategoryDialog) return false;
    hasShownInitialCategoryDialog = true;
    return true;
  });
  const debounceRef = useRef(null);

  // Hide category modal on mobile screens
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close category picker on mobile
  useEffect(() => {
    if (isMobile) {
      setCategoryPickerOpen(false);
    }
  }, [isMobile]);

  const EMPTY_FILTERS = {
    category_id: "",
    country_id: "",
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

  // Fetch countries
  const { data: countriesData, isLoading: countriesLoading } = useQuery({
    queryKey: ["/countries", accessToken],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/countries`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.json();
    },
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 60,
  });
  const countries = countriesData?.data || [];

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
  if (filters.country_id) qs.set("country_id", filters.country_id);

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
      <div className="sticky top-0 z-50 mx-auto flex w-full max-w-5xl items-center gap-3 rounded-2xl border border-gray-200 bg-white/95 px-3 py-3 shadow-lg shadow-gray-200/50 backdrop-blur-sm sm:px-4">
        {/* Search input */}
        <div className="flex-1 relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-0 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={handleSearchChange}
            className="h-11 w-full rounded-2xl border border-transparent bg-gray-100 pl-9 pr-8 text-sm font-medium text-gray-800 transition placeholder:text-gray-400 focus:border-secondary/40 focus:bg-white focus:outline-none"
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
              className="relative flex h-11 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition hover:border-secondary hover:text-secondary shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
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
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Marketplace
            </h1>
            {!isLoading && paginatedData && (
              <p className="mt-1 text-sm text-gray-500">
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
          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
                Sort by Price
              </div>
              <select
                value={filters.sort_by_price}
                onChange={(e) => {
                  setFilters((p) => ({ ...p, sort_by_price: e.target.value }));
                  setPage(1);
                }}
                className="mt-1.5 w-full appearance-none bg-transparent text-sm font-medium text-gray-800 focus:outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                <Globe className="h-4 w-4 text-gray-400" />
                Country
              </div>
              <select
                value={filters.country_id}
                onChange={(e) => {
                  setFilters((p) => ({ ...p, country_id: e.target.value }));
                  setPage(1);
                }}
                disabled={countriesLoading}
                className="mt-1.5 w-full appearance-none bg-transparent text-sm font-medium text-gray-800 focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400"
              >
                <option value="">All countries</option>
                {countries.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Listings grid */}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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

      {!isMobile && (
        <CategoryDialog
          open={categoryPickerOpen}
          onOpenChange={setCategoryPickerOpen}
          categoriesLoading={categoriesLoading}
          categories={categories}
          onSelect={handleInitialCategorySelect}
        />
      )}
    </section>
  );
}
