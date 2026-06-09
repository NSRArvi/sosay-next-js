"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, Loader2, UserPlus, X } from "lucide-react";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

function SuggestionAvatar({ user }) {
  const [imageFailed, setImageFailed] = useState(false);
  const displayImage = user?.user_image || user?.profile_picture;

  if (displayImage && !imageFailed) {
    return (
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-100">
        <Image
          src={displayImage}
          alt={user?.name || "User"}
          className="h-full w-full object-cover"
          width={500}
          height={500}
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center text-sm font-semibold text-slate-700">
      {user?.name?.charAt(0)?.toUpperCase() || "U"}
    </div>
  );
}

export default function SuggestionList({ setShowSuggestion }) {
  const { accessToken } = useAppContext();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [pendingUserId, setPendingUserId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["/friendship/suggest-friends", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  const suggestions = useMemo(() => {
    const users = data?.data || [];
    return users.slice(0, 4);
  }, [data]);

  const sendRequestMutation = useMutation({
    mutationFn: async (userId) => {
      const baseUrl = process.env.NEXT_PUBLIC_API_DEV_URL;
      const formData = new FormData();
      formData.append("friend_id", userId);

      const response = await fetch(`${baseUrl}/friendship/friends`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      return response.json();
    },
    onMutate: (userId) => {
      setPendingUserId(userId);
    },
    onSuccess: (result) => {
      if (result.status === true) {
        toast.success(result.message || "Friend request sent!");
        queryClient.invalidateQueries(["/friendship/suggest-friends"]);
      } else {
        toast.error(result.message || "Failed to send friend request");
      }
    },
    onError: (error) => {
      console.error("Error sending friend request:", error);
      toast.error("Something went wrong. Please try again.");
    },
    onSettled: () => {
      setPendingUserId(null);
    },
  });

  const handleAction = async (userId, action) => {
    if (action === "view") {
      router.push(`/app/profile/${userId}`);
      return;
    }

    sendRequestMutation.mutate(userId);
  };

  return (
    <aside className="fixed top-5 right-5 w-88 max-w-[calc(100vw-2rem)] rounded-2xl border bg-card p-4 hidden 2xl:block">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
          People you may know
        </h3>
        <button
          type="button"
          onClick={() => setShowSuggestion(false)}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-red-50 transition cursor-pointer"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-red-500 transition" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border bg-background p-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                </div>
              </div>
              <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            </div>
          ))
        ) : suggestions.length > 0 ? (
          suggestions.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-xl border bg-background p-3 transition-shadow hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => router.push(`/app/profile/${user.id}`)}
                className="flex min-w-0 items-center gap-3 text-left"
              >
                <SuggestionAvatar user={user} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email || "Suggested friend"}
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={() => handleAction(user.id, "view")}
                  title="View Profile"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-secondary hover:bg-secondary/90"
                  onClick={() => handleAction(user.id, "send")}
                  disabled={pendingUserId === user.id}
                  title="Add Friend"
                >
                  {pendingUserId === user.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No suggestions available right now.
          </p>
        )}
      </div>
    </aside>
  );
}
