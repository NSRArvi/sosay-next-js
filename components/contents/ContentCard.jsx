import React from 'react';
import { Play, Heart, MessageCircle, Crown, MoreVertical, Star, StarOff, Eye, EyeOff, Trash2, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function ContentCard({ content, onView, onTogglePremium, onToggleActive, onDelete, isDeleting }) {
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

        {/* Inactive Badge */}
        {(content.is_active === 0 || content.is_active === false) && (
          <div className="absolute bottom-2 left-2 bg-red-500/90 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-md flex items-center gap-1 z-10 tracking-wide backdrop-blur-sm">
            <EyeOff className="w-3 h-3" /> INACTIVE
          </div>
        )}

        {/* Actions Dropdown */}
        {(onTogglePremium || onToggleActive || onDelete) && (
          <div className="absolute top-2 right-2 z-20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 z-50">
                {onTogglePremium && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePremium();
                    }}
                    className="cursor-pointer gap-2"
                  >
                    {content.is_premium === 1 || content.is_premium === true ? (
                      <>
                        <StarOff className="w-4 h-4" />
                        <span>Remove Premium</span>
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4" />
                        <span>Make Premium</span>
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                
                {onToggleActive && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleActive();
                    }}
                    className="cursor-pointer gap-2"
                  >
                    {content.is_active === 1 || content.is_active === true ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span>Deactivate</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        <span>Activate</span>
                      </>
                    )}
                  </DropdownMenuItem>
                )}

                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                      className="cursor-pointer gap-2 text-red-500 focus:text-red-500 focus:bg-red-50"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span>Delete Content</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
          {content.title || "Untitled Content"}
        </h3>

        {/* User Info */}
        <div className="flex items-center gap-2 mt-1">
          <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
             {content.user?.profile_picture ? (
               <img src={content.user.profile_picture} alt={content.user.name} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-[10px]">
                 {content.user?.name?.charAt(0) || 'U'}
               </div>
             )}
          </div>
          <span className="text-xs text-gray-600 truncate">{content.user?.name || "Unknown User"}</span>
        </div>
        
        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>{content.view_count || 0}</span>
          </div>
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
