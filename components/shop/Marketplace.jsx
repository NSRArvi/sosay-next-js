"use client";

import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithToken } from "@/helpers/api";
import { useAppContext } from "@/context/context";
import {
  Search,
  Tag,
  Package,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  X,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ProductDetailDialog } from "@/components/shop/Productdetaildialog";
import CategoryDialog from "@/components/shop/CategoryDialog";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import Chatpanel from "../message/Chatpanel";

const BASE_URL = process.env.NEXT_PUBLIC_API_DEV_URL;

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "asc", label: "Price: Low to High" },
  { value: "desc", label: "Price: High to Low" },
];

// ─── Pagination ────────────────────────────────────────────────────────────────

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

// ─── Filter Panel (inner content, used in Sheet) ───────────────────────────────

function FilterPanel({
  filters,
  setFilters,
  categories,
  categoriesLoading,
  onApply,
  onReset,
}) {
  const [local, setLocal] = useState(filters);

  // Sync local when filters reset externally
  React.useEffect(() => {
    setLocal(filters);
  }, [filters]);

  const handleApply = () => {
    setFilters(local);
    onApply?.();
  };

  const handleReset = () => {
    const empty = {
      category_id: "",
      min_price: "",
      max_price: "",
      sort_by_price: "",
    };
    setLocal(empty);
    setFilters(empty);
    onReset?.();
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Category */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLocal((p) => ({ ...p, category_id: "" }))}
            className={`px-3 py-1.5 text-xs rounded-full border font-medium transition ${
              local.category_id === ""
                ? "bg-secondary text-white border-secondary"
                : "border-gray-200 text-gray-500 hover:border-secondary/40"
            }`}
          >
            All
          </button>
          {categoriesLoading ? (
            <span className="text-xs text-gray-400 py-1.5">Loading...</span>
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setLocal((p) => ({ ...p, category_id: String(cat.id) }))
                }
                className={`px-3 py-1.5 text-xs rounded-full border font-medium transition ${
                  local.category_id === String(cat.id)
                    ? "bg-secondary text-white border-secondary"
                    : "border-gray-200 text-gray-500 hover:border-secondary/40"
                }`}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Price Range
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              Min
            </span>
            <input
              type="number"
              min="0"
              value={local.min_price}
              onChange={(e) =>
                setLocal((p) => ({ ...p, min_price: e.target.value }))
              }
              placeholder="0"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition"
            />
          </div>
          <span className="text-gray-300 text-sm">—</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              Max
            </span>
            <input
              type="number"
              min="0"
              value={local.max_price}
              onChange={(e) =>
                setLocal((p) => ({ ...p, max_price: e.target.value }))
              }
              placeholder="∞"
              className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition"
            />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Sort by Price
        </label>
        <div className="flex gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                setLocal((p) => ({ ...p, sort_by_price: opt.value }))
              }
              className={`flex-1 py-2 text-xs rounded-lg border font-medium transition ${
                local.sort_by_price === opt.value
                  ? "bg-secondary text-white border-secondary"
                  : "border-gray-200 text-gray-500 hover:border-secondary/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="flex-1 rounded-full text-sm"
        >
          Reset
        </Button>
        <Button
          type="button"
          onClick={handleApply}
          className="flex-1 rounded-full bg-secondary hover:bg-secondary/90 text-sm"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

// ─── Active Filter Badges ──────────────────────────────────────────────────────

function ActiveFilterBadges({ filters, categories, onRemove }) {
  const badges = [];

  if (filters.category_id) {
    const cat = categories.find((c) => String(c.id) === filters.category_id);
    if (cat) badges.push({ key: "category_id", label: cat.name });
  }
  if (filters.min_price)
    badges.push({ key: "min_price", label: `Min: ${filters.min_price}` });
  if (filters.max_price)
    badges.push({ key: "max_price", label: `Max: ${filters.max_price}` });
  if (filters.sort_by_price) {
    const sort = SORT_OPTIONS.find((s) => s.value === filters.sort_by_price);
    if (sort) badges.push({ key: "sort_by_price", label: sort.label });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {badges.map((badge) => (
        <Badge
          key={badge.key}
          variant="outline"
          className="gap-1 pr-1 text-xs border-secondary/30 text-secondary bg-secondary/5 rounded-full"
        >
          {badge.label}
          <button
            type="button"
            onClick={() => onRemove(badge.key)}
            className="ml-0.5 hover:text-red-500 transition"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}

// ─── Marketplace ───────────────────────────────────────────────────────────────

export default function Marketplace() {
  const { accessToken } = useAppContext();
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(true);
  const [hasSelectedInitialCategory, setHasSelectedInitialCategory] =
    useState(false);
  const debounceRef = useRef(null);
  const [openChatDialog, setOpenChatDialog] = useState(false);
  const [receiver, setReceiver] = useState(null);

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
    setHasSelectedInitialCategory(true);
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
    enabled: !!accessToken && hasSelectedInitialCategory,
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
        {/* Search input */}
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
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter button */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-secondary hover:text-secondary transition flex-shrink-0"
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
          <SheetContent side="right" className="w-80 sm:w-96">
            <SheetHeader className="mb-4">
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </SheetTitle>
            </SheetHeader>
            <FilterPanel
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
          </SheetContent>
        </Sheet>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        {/* Header row */}
        <div className="mb-4 flex items-start justify-between">
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
          <div className="flex items-center gap-1.5 flex-shrink-0">
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
        setOpenChatDialog={setOpenChatDialog}
        setReceiver={setReceiver}
      />

      <CategoryDialog
        open={categoryPickerOpen}
        onOpenChange={(nextOpen) => {
          if (hasSelectedInitialCategory) {
            setCategoryPickerOpen(nextOpen);
          }
        }}
        categoriesLoading={categoriesLoading}
        categories={categories}
        onSelect={handleInitialCategorySelect}
      />

      {/* Chat Panel Dialog */}
      <Dialog open={openChatDialog} onOpenChange={setOpenChatDialog}>
        <DialogContent className="p-0">
          <DialogTitle className="sr-only">Chat</DialogTitle>
          <div className="space-y-6 min-h-[80vh]">
            <Chatpanel receiver={receiver} />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
