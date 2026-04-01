import { Play, Eye, VolumeX } from "lucide-react";

export default function ReelCardSkleton() {
  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-200 aspect-3/5 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-white/80 flex items-center justify-center">
          <Play className="h-6 w-6 text-gray-300 fill-gray-300" />
        </div>
      </div>

      <div className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/20 flex items-center justify-center">
        <VolumeX className="h-4 w-4 text-white/70" />
      </div>

      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-black/30 px-2 py-1">
        <Eye className="h-3 w-3 text-white/70" />
        <div className="h-2.5 w-8 rounded bg-white/60" />
      </div>

      <div className="absolute bottom-2 right-2 h-8 w-8 rounded-full border-2 border-white/80 bg-gray-300" />

      <div className="absolute top-2 left-2 h-7 w-28 rounded bg-black/30" />
    </div>
  );
}