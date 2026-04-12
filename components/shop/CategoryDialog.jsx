import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ShopHeader from "./ShopHeader";

export default function CategoryDialog({
  open,
  onOpenChange,
  categoriesLoading,
  categories,
  onSelect,
  title = "Choose a Category",
}) {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] md:max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <ShopHeader/>
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
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}