"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWithToken } from '@/helpers/api';
import { User, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function SubscriberSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-white shadow-sm mb-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="space-y-2 text-right">
        <Skeleton className="h-4 w-16 ml-auto" />
        <Skeleton className="h-3 w-12 ml-auto" />
      </div>
    </div>
  );
}

export default function FansTab({ accessToken }) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['/contents/subscribers', accessToken, page],
    queryFn: () => fetchWithToken({ queryKey: [`/contents/subscribers?page=${page}`, accessToken] }),
    enabled: !!accessToken,
    keepPreviousData: true,
  });

  const subscribers = data?.data || [];
  const paginationData = data?.pagination || null;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Your Subscribers</h2>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SubscriberSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl border border-red-100">
          Failed to load subscribers.
        </div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No subscribers yet.</p>
          <p className="text-sm text-gray-400 mt-1">Keep uploading great content to attract fans!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subscribers.map((sub) => (
            <div key={sub.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                {sub.subscriber?.profile_picture ? (
                  <img src={sub.subscriber.profile_picture} alt={sub.subscriber.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{sub.subscriber?.name || 'Unknown User'}</h3>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                </span>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="text-right">
                  <div className="font-bold text-gray-900">${sub.price_paid}</div>
                  <div className="text-xs text-green-600 font-medium mb-1">
                    +${sub.creator_earnings} Earned
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs bg-white" asChild>
                  <Link href={`/app/profile/${sub.subscriber?.id}`}>
                    View Profile
                  </Link>
                </Button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {paginationData?.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="cursor-pointer"
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from(
                  { length: paginationData.last_page },
                  (_, i) => i + 1,
                ).map((p) => (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "outline"}
                    onClick={() => handlePageChange(p)}
                    className="w-10 h-10 p-0 cursor-pointer"
                  >
                    {p}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === paginationData.last_page}
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
