"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import toast from "react-hot-toast";
import UserCard from "@/components/friends/UserCard";
import UserCardSkleton from "@/components/friends/UserCardSkleton";

const UserCardSkeletonList = ({ limit = 6 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
    {[...Array(limit)].map((_, i) => (
      <UserCardSkleton key={i} />
    ))}
  </div>
);

// Tab Content Component with Infinite Scroll
const FriendsTabContent = ({ endpoint, type, title, tabName, onTotalUpdate, showCount = true }) => {
  const { accessToken } = useAppContext();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [loadingState, setLoadingState] = useState({ userId: null, action: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  console.log(pagination);
  const [hasNextPage, setHasNextPage] = useState(true);
  const userRefsContainer = useRef(null);
  const observerRef = useRef(null);
  const userRefs = useRef([]);

  // Fetch users for specific page
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [endpoint, accessToken, currentPage],
    queryFn: ({ queryKey }) => {
      const [endpointKey, token] = queryKey;
      const separator = endpointKey.includes("?") ? "&" : "?";
      return fetchWithToken({
        queryKey: [`${endpointKey}${separator}page=${currentPage}`, token],
      });
    },
    enabled: !!accessToken && hasNextPage,
    keepPreviousData: true,
  });

  // Combine users from all pages
  useEffect(() => {
    if (data?.data) {
      if (currentPage === 1) {
        setAllUsers(data.data);
      } else {
        setAllUsers((prev) => [...prev, ...data.data]);
      }
      setPagination(data.pagination || {});
      setHasNextPage(!!data.pagination?.next_page_url);
      
      // Notify parent about total count only on first page load
      if (currentPage === 1 && onTotalUpdate && showCount && tabName) {
        onTotalUpdate(tabName, data.pagination?.total || 0);
      }
    }
  }, [data, currentPage]);

  // Setup Intersection Observer for 60% threshold
  useEffect(() => {
    if (!userRefsContainer.current || allUsers.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        const index = userRefs.current.indexOf(entry.target);
        const threshold60Percent = Math.ceil(allUsers.length * 0.6);

        if (entry.isIntersecting && index >= threshold60Percent - 1) {
          if (hasNextPage && !isFetching && currentPage < pagination.last_page) {
            setCurrentPage((prev) => prev + 1);
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const thresholdIndex = Math.ceil(allUsers.length * 0.6) - 1;
    if (userRefs.current[thresholdIndex]) {
      observerRef.current.observe(userRefs.current[thresholdIndex]);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [allUsers.length, hasNextPage, isFetching, currentPage, pagination.last_page]);

  const handleAction = async (userId, action) => {
    setLoadingState({ userId, action });

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_DEV_URL;

      switch (action) {
        case "send": {
          const formData = new FormData();
          formData.append("friend_id", userId);

          const response = await fetch(`${baseUrl}/friendship/friends`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });

          const data = await response.json();
          if (data.status === true) {
            toast.success(data.message || "Friend request sent!");
            queryClient.invalidateQueries([endpoint]);
            queryClient.invalidateQueries(["/friendship/sent-friends-request"]);
          } else {
            toast.error(data.message || "Failed to send friend request");
          }
          break;
        }

        case "accept": {
          const response = await fetch(
            `${baseUrl}/friendship/manage-requested-friends?friend_id=${userId}&status=2`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const data = await response.json();
          if (data.status === true) {
            toast.success(data.message || "Friend request accepted!");
            queryClient.invalidateQueries([endpoint]);
            queryClient.invalidateQueries(["/friendship/my-friends?status=2"]);
          } else {
            toast.error(data.message || "Failed to accept friend request");
          }
          break;
        }

        case "reject": {
          const response = await fetch(
            `${baseUrl}/friendship/manage-requested-friends?friend_id=${userId}&status=3`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const data = await response.json();
          if (data.status === true) {
            toast.success(data.message || "Friend request rejected");
            queryClient.invalidateQueries([endpoint]);
          } else {
            toast.error(data.message || "Failed to reject friend request");
          }
          break;
        }

        case "cancel": {
          const formData = new FormData();
          formData.append("friend_id", userId);

          const response = await fetch(`${baseUrl}/friendship/sent-friends-request/cancel`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });

          const data = await response.json();
          if (data.status === true) {
            toast.success(data.message || "Friend request cancelled");
            queryClient.invalidateQueries([endpoint]);
            queryClient.invalidateQueries(["/friendship/suggest-friends"]);
          } else {
            toast.error(data.message || "Failed to cancel friend request");
          }
          break;
        }

        case "unfriend": {
          const formData = new FormData();
          formData.append("friend_id", userId);

          const response = await fetch(`${baseUrl}/friendship/friends/unfriend`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });

          const data = await response.json();
          if (data.status === true) {
            toast.success(data.message || "Friend removed successfully");
            queryClient.invalidateQueries([endpoint]);
            queryClient.invalidateQueries(["/friendship/suggest-friends"]);
          } else {
            toast.error(data.message || "Failed to remove friend");
          }
          break;
        }

        case "view": {
          router.push(`/app/profile/${userId}`);
          break;
        }

        default:
          console.log(`Unknown action: ${action}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingState({ userId: null, action: null });
    }
  };

  if (isLoading) return <UserCardSkeletonList />;

  if (allUsers.length === 0 && !isFetching) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No {title} Found
        </h3>
        <p className="text-gray-500">Check back later for updates!</p>
      </div>
    );
  }

  return (
    <div ref={userRefsContainer} className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {allUsers.map((user, i) => (
          <div
            key={user.id}
            ref={(el) => {
              if (el) userRefs.current[i] = el;
            }}
          >
            <UserCard
              user={user}
              type={type}
              onAction={handleAction}
              isLoading={loadingState.userId === user.id}
              currentAction={loadingState.action}
            />
          </div>
        ))}
      </div>

      {/* Loading indicator for next page */}
      {isFetching && currentPage > 1 && (
        <div className="py-8">
          <UserCardSkeletonList limit={3} />
        </div>
      )}

      {/* All users loaded message */}
      {!hasNextPage && allUsers.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">You've seen all {title.toLowerCase()}!</p>
        </div>
      )}
    </div>
  );
};

// Main Friends Page Component
export default function FriendsPage() {
  const [totals, setTotals] = useState({
    suggested: 0,
    friends: 0,
    requests: 0,
    sent: 0,
  });

  const handleTotalUpdate = useCallback((tab, count) => {
    setTotals((prev) => ({
      ...prev,
      [tab]: count,
    }));
  }, []);

  return (
    <section className="max-w-4xl mx-auto mt-14 md:mt-8 p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Friends</h1>
        <p className="text-gray-600">
          Manage your connections and friend requests
        </p>
      </div>

      <Tabs defaultValue="suggested" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 gap-2">
          <TabsTrigger className="cursor-pointer text-xs sm:text-sm" value="suggested">
            Suggested
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer text-xs sm:text-sm" value="friends">
            Friends
            {totals.friends > 0 && (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-y-px bg-green-600 rounded-full">
                {totals.friends}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer text-xs sm:text-sm" value="requests">
            Requests
            {totals.requests > 0 && (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-y-px bg-orange-600 rounded-full">
                {totals.requests}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer text-xs sm:text-sm" value="sent">
            Sent
            {totals.sent > 0 && (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-y-px bg-purple-600 rounded-full">
                {totals.sent}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggested">
          <FriendsTabContent
            endpoint="/friendship/suggest-friends"
            type="suggested"
            title="Suggested Friends"
            tabName="suggested"
            onTotalUpdate={handleTotalUpdate}
            showCount={false}
          />
        </TabsContent>

        <TabsContent value="friends">
          <FriendsTabContent
            endpoint="/friendship/my-friends?status=2"
            type="friends"
            title="Friends"
            tabName="friends"
            onTotalUpdate={handleTotalUpdate}
            showCount={true}
          />
        </TabsContent>

        <TabsContent value="requests">
          <FriendsTabContent
            endpoint="/friendship/requested-friends"
            type="requested"
            title="Friend Requests"
            tabName="requests"
            onTotalUpdate={handleTotalUpdate}
            showCount={true}
          />
        </TabsContent>

        <TabsContent value="sent">
          <FriendsTabContent
            endpoint="/friendship/sent-friends-request"
            type="sent"
            title="Sent Requests"
            tabName="sent"
            onTotalUpdate={handleTotalUpdate}
            showCount={true}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}