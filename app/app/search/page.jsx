"use client";

import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/context";
import { Search, X } from "lucide-react";
import UserCard from "@/components/friends/UserCard";
import UserCardSkleton from "@/components/friends/UserCardSkleton";

const BASE_URL = process.env.NEXT_PUBLIC_API_DEV_URL;

export default function SearchPage() {
  const router = useRouter();
  const { accessToken } = useAppContext();
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const debounceRef = useRef(null);

  // Debounced search handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setActiveSearch(value);
    }, 400);
  };

  // Clear search
  const clearSearch = () => {
    setSearch("");
    setActiveSearch("");
  };

  // Fetch users based on search
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["search-users", activeSearch, accessToken],
    queryFn: async () => {
      if (!activeSearch.trim()) return { data: [] };
      const res = await fetch(
        `${BASE_URL}/search-users?search=${encodeURIComponent(activeSearch)}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return res.json();
    },
    enabled: !!accessToken && activeSearch.trim().length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const users = usersData?.data || [];

  const handleUserAction = (userId, action) => {
    if (action === "view") {
      router.push(`/app/profile/${userId}`);
    }
  };

  return (
    <div className="min-h-screen pb-20 max-w-3xl mx-auto space-y-4 mt-14 md:mt-8 p-4">
      {/* Header */}
      <div className="sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Search Users</h1>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search users by name, email..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Empty State */}
        {!activeSearch && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Start typing to search for users</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && activeSearch && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <UserCardSkleton key={i} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && activeSearch && users.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No users found for "{activeSearch}"
            </p>
          </div>
        )}

        {/* User Results Grid */}
        {!isLoading && users.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-6">
              Found {users.length} user{users.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  type="suggested"
                  onAction={handleUserAction}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
