import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "asc", label: "Low to High" },
  { value: "desc", label: "High to Low" },
];

export default function ActiveFilterBadges({ filters, categories, onRemove }) {
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
