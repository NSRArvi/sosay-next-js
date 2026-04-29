import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "asc", label: "Low to High" },
  { value: "desc", label: "High to Low" },
];

export default function MarketplaceFilterPanel({
  filters,
  setFilters,
  categories,
  categoriesLoading,
  onApply,
  onReset,
}) {
  const [local, setLocal] = useState(filters);

  useEffect(() => {
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
    <div className="flex flex-col h-full">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pr-4 space-y-5">
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
          <div className="flex gap-2 flex-wrap">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setLocal((p) => ({ ...p, sort_by_price: opt.value }))
                }
                className={`py-2 px-4 text-xs rounded-lg border font-medium transition ${
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
      </div>

      {/* Fixed Actions at bottom */}
      <div className="flex gap-2 pt-4 mt-4 border-t border-gray-200 shrink-0">
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
