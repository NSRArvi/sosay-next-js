import React from "react";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import { useQuery } from "@tanstack/react-query";
import { ListingCard, ListingCardSkeleton } from "../shop/Listingcard";

export default function UserProfileProducts({ id }) {
  const { accessToken } = useAppContext();
  const { data, isLoading, error } = useQuery({
    queryKey: [`/private/marketplace/${id}`, accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-400 text-center mt-10">Failed to load products</p>;
  }

  const listings = data?.data || [];

  return (
    <div className="mt-6">
      {listings.length === 0 ? (
        <div className="text-center mt-10 h-60 bg-gray-100 flex justify-center items-center rounded-xl">
          No products yet
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((item) => (
            <ListingCard
              key={item.id}
              item={item}
              onSelect={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
