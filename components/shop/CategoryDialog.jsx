"use client";

import Image from "next/image";
// import { useState } from "react";
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
  // const [previewCategory, setPreviewCategory] = useState(null);
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] md:max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          {categoriesLoading ? (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded border border-black shadow-md"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100 animate-pulse">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded bg-black/75 px-3 py-1">
                      <div className="h-3 w-20 rounded bg-white/70" />
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
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="group relative overflow-hidden rounded border border-black shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <button
                    type="button"
                    onClick={() => onSelect(category.id)}
                    className="block w-full text-left"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                      <Image
                        src={category.icon}
                        alt={category.name}
                        width={1000}
                        height={1000}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-1/2 -translate-x-1/2 rounded bg-black/80 px-3 py-1 text-sm font-semibold text-white truncate max-w-[80%]">
                        {category.name}
                      </span>
                    </div>
                  </button>

                  {/* <button
                    type="button"
                    onClick={() => setPreviewCategory(category)}
                    className="absolute bottom-2 right-2 rounded bg-black/80 px-3 py-1 text-xs font-medium text-white hover:bg-black"
                  >
                    Full View
                  </button> */}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* <Dialog
        open={!!previewCategory}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPreviewCategory(null);
        }}
      >
        <DialogContent className="w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] md:max-w-5xl border-2 border-black p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="text-center">
              {previewCategory?.name || "Category Preview"}
            </DialogTitle>
          </DialogHeader>

          <div className="p-4 pt-3">
            {previewCategory?.icon ? (
              <div className="relative aspect-video w-full overflow-hidden rounded border border-black bg-gray-100">
                <Image
                  src={previewCategory.icon}
                  alt={previewCategory.name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog> */}
    </>
  );
}