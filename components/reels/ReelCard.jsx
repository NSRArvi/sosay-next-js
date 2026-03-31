"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Play,
  Volume2,
  VolumeX,
  Eye,
} from "lucide-react";

export default function ReelCard({ reel }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);
  const videoSrc = reel?.video_url || "";

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            toast.error("Unable to play this video");
          });
      }
    }
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-black aspect-3/5 cursor-pointer">
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-cover"
        muted={muted}
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => toast.error("This video could not be loaded")}
        onClick={togglePlay}
      />

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button
          onClick={togglePlay}
          className="bg-secondary/90 hover:bg-secondary p-3 rounded-full transition"
        >
          <Play className="h-6 w-6 text-black fill-black" />
        </button>
      </div>

      {/* Play/Pause Button (always visible for clarity) */}
      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition"
        >
          <Play className="h-8 w-8 text-white fill-white" />
        </button>
      )}

      {/* Mute Toggle (top right) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMuted(!muted);
        }}
        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 p-1.5 rounded-full text-white transition opacity-0 group-hover:opacity-100"
      >
        {muted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>

      {/* Stats (bottom left) */}
      <div className="absolute bottom-2 left-2 flex gap-2 text-xs text-white bg-black/60 rounded-lg px-2 py-1">
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {reel.view_count}
        </div>
      </div>

      {/* User Avatar (bottom right) */}
      {reel.user?.profile_picture && (
        <div className="absolute bottom-2 right-2">
          <Image
            src={reel.user.profile_picture}
            alt={reel.user.name}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full border-2 border-white object-cover"
          />
        </div>
      )}

      {/* Caption tooltip */}
      {reel.caption && (
        <div className="absolute top-2 left-2 max-w-[80%] bg-black/80 text-white text-xs p-2 rounded hidden group-hover:block">
          {reel.caption}
        </div>
      )}
    </div>
  );
}
