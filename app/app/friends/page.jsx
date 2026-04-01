"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import toast from "react-hot-toast";
import UserCard from "@/components/friends/UserCard";
import UserCardSkleton from "@/components/friends/UserCardSkleton";

const UserCardSkeletonList = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <UserCardSkleton key={i} />
    ))}
  </div>
);

// Tab Content Component
const FriendsTabContent = ({ endpoint, type, title }) => {
  const { accessToken } = useAppContext();
  const queryClient = useQueryClient();
  const [loadingState, setLoadingState] = useState({ userId: null, action: null });

  const { data, isLoading, error } = useQuery({
    queryKey: [endpoint, accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  const handleAction = async (userId, action) => {
    setLoadingState({ userId, action });
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_DEV_URL;

      switch (action) {
        case "send": {
          // Send friend request
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
            // Refetch suggested and sent lists
            queryClient.invalidateQueries(["/friendship/suggest-friends"]);
            queryClient.invalidateQueries(["/friendship/sent-friends-request"]);
          } else {
            toast.error(data.message || "Failed to send friend request");
          }
          break;
        }

        case "accept": {
          // Accept friend request - Changed to POST method
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
            // Refetch requests and friends lists
            queryClient.invalidateQueries(["/friendship/requested-friends"]);
            queryClient.invalidateQueries(["/friendship/my-friends?status=2"]);
          } else {
            toast.error(data.message || "Failed to accept friend request");
          }
          break;
        }

        case "reject": {
          // Reject friend request - Changed to POST method (status=3 for delete)
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
            // Refetch requests list
            queryClient.invalidateQueries(["/friendship/requested-friends"]);
          } else {
            toast.error(data.message || "Failed to reject friend request");
          }
          break;
        }

        case "cancel": {
          // Cancel sent friend request
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
            // Refetch sent requests and suggested lists
            queryClient.invalidateQueries(["/friendship/sent-friends-request"]);
            queryClient.invalidateQueries(["/friendship/suggest-friends"]);
          } else {
            toast.error(data.message || "Failed to cancel friend request");
          }
          break;
        }

        case "unfriend": {
          // Unfriend - New action
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
            // Refetch friends and suggested lists
            queryClient.invalidateQueries(["/friendship/my-friends?status=2"]);
            queryClient.invalidateQueries(["/friendship/suggest-friends"]);
          } else {
            toast.error(data.message || "Failed to remove friend");
          }
          break;
        }

        case "view": {
          toast.info("Profile view feature - implement navigation here");
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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">
          Failed to load {title.toLowerCase()}
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const users = data?.data || [];

  if (users.length === 0) {
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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          type={type}
          onAction={handleAction}
          isLoading={loadingState.userId === user.id}
          currentAction={loadingState.action}
        />
      ))}
    </div>
  );
};

// Main Friends Page Component
export default function FriendsPage() {
  return (
    <section className="max-w-2xl mx-auto mt-14 md:mt-8 p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Friends</h1>
        <p className="text-gray-600">
          Manage your connections and friend requests
        </p>
      </div>

      <Tabs defaultValue="suggested" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger className="cursor-pointer" value="suggested">Suggested</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="friends">Friends</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="requests">Requests</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="sent">Sent</TabsTrigger>
        </TabsList>

        <TabsContent value="suggested">
          <FriendsTabContent
            endpoint="/friendship/suggest-friends"
            type="suggested"
            title="Suggested Friends"
          />
        </TabsContent>

        <TabsContent value="friends">
          <FriendsTabContent
            endpoint="/friendship/my-friends?status=2"
            type="friends"
            title="Friends"
          />
        </TabsContent>

        <TabsContent value="requests">
          <FriendsTabContent
            endpoint="/friendship/requested-friends"
            type="requested"
            title="Friend Requests"
          />
        </TabsContent>

        <TabsContent value="sent">
          <FriendsTabContent
            endpoint="/friendship/sent-friends-request"
            type="sent"
            title="Sent Requests"
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}