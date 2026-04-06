"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CategoryDialog({
  open,
  onOpenChange,
  categoriesLoading,
  categories,
  onSelect,
  title = "Choose a Category",
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] md:max-w-4xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded shadow-md"
              >
                <div className="relative aspect-3/5 w-full overflow-hidden bg-gray-100 animate-pulse">
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5">
                    <div className="h-4 w-3/4 rounded bg-white/70" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            No categories available right now.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelect(category.id)}
                className="group overflow-hidden rounded text-left shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <div className="relative aspect-3/5 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={category.icon}
                    alt={category.name}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute bottom-0 left-0 right-0 px-3 py-2.5 text-sm font-semibold text-white truncate">
                    {category.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}