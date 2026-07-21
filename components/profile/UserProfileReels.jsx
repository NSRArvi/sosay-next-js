import React from "react";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import { useQuery } from "@tanstack/react-query";
import ReelCard from "../reels/ReelCard";
import ReelCardSkleton from "../reels/ReelCardSkleton";

export default function UserProfileReels({ id }) {
  const { accessToken } = useAppContext();
  const { data, isLoading, error } = useQuery({
    queryKey: [`/private/reels/${id}`, accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ReelCardSkleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-400 text-center mt-10">Failed to load reels</p>;
  }

  const reels = data?.data || [];

  return (
    <div className="mt-6">
      {reels.length === 0 ? (
        <div className="text-center mt-10 h-60 bg-gray-100 flex justify-center items-center rounded-xl">
          No reels yet
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {reels.map((reel, index) => (
            <ReelCard key={reel.id || index} reel={reel} onView={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
}
