import React from 'react';

export default function ContentCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      {/* Thumbnail skeleton - 4:3 aspect ratio */}
      <div className="w-full aspect-[4/3] bg-gray-200 rounded-xl"></div>
      
      {/* Info skeleton */}
      <div className="flex flex-col gap-2 px-1 py-1">
        {/* Title lines */}
        <div className="h-4 bg-gray-200 rounded w-11/12"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        
        {/* Stats */}
        <div className="flex gap-3 mt-1">
          <div className="h-3 bg-gray-200 rounded w-8"></div>
          <div className="h-3 bg-gray-200 rounded w-8"></div>
        </div>
      </div>
    </div>
  );
}
