import { Skeleton } from "@/components/ui/skeleton";

export default function UserCardSkleton() {
  return (
    <div className="relative group overflow-hidden rounded-lg shadow-xl h-80">
      <div className="relative h-80 w-full">
        <Skeleton className="h-full w-full rounded-none" />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent" />

        <div className="absolute top-3 right-3 flex gap-2">
          <Skeleton className="h-10 w-10 rounded-full bg-white/30" />
          <Skeleton className="h-10 w-10 rounded-full bg-white/30" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Skeleton className="h-6 w-3/4 mx-auto rounded-full bg-white/40" />
          <Skeleton className="h-4 w-1/2 mx-auto mt-2 rounded-full bg-white/30" />
        </div>
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
}