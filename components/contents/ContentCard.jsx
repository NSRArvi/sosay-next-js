import React from 'react';
import { Play, Heart, MessageCircle, Crown } from 'lucide-react';

export default function ContentCard({ content, onView }) {
  return (
    <div 
      className="group flex flex-col gap-2 cursor-pointer relative"
      onClick={onView}
    >
      {/* Thumbnail / Video Container - 4:3 aspect ratio */}
      <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-xl overflow-hidden shadow-sm">
        <video
          src={content.video_url}
          className="w-full h-full object-cover"
          preload="metadata"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
            <Play className="h-6 w-6 text-white fill-white" />
          </div>
        </div>

        {/* Premium Badge */}
        {content.is_premium === 1 && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-md flex items-center gap-1 z-10 tracking-wide">
            <Crown className="w-3 h-3" /> PREMIUM
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
          {content.title || "Untitled Content"}
        </h3>
        
        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5" />
            <span>{content.reactions_count || 0}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{content.comments_count || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
