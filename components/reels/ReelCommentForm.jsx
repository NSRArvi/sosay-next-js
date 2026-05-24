"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/context";
import { postWithToken } from "@/helpers/api";

export default function ReelCommentForm({
  reelId,
  comments = [],
  initialCount = 0,
  onOpenChange,
}) {
  const { accessToken } = useAppContext();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [commentCount, setCommentCount] = useState(initialCount);

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const commentMutation = useMutation({
    mutationFn: async (text) => {
      if (!accessToken) {
        throw new Error("Missing access token");
      }

      const formData = new FormData();
      formData.append("comment", text);
      return await postWithToken(`/reels/${reelId}/comment`, formData, accessToken);
    },
    onSuccess: (data) => {
      if (data?.status === true) {
        toast.success(data?.message || "Comment added");
        setComment("");
        setCommentCount((prev) => prev + 1);
        queryClient.invalidateQueries({ queryKey: ["/reels"] });
        queryClient.invalidateQueries({ queryKey: ["/my-reels"] });
        return;
      }

      toast.error(data?.message || "Failed to add comment");
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });

  const handleSubmit = () => {
    const value = comment.trim();
    if (!value || !reelId) return;
    commentMutation.mutate(value);
  };

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      onOpenChange?.(next);
      return next;
    });
  };

  return (
    <div className="relative flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={toggleOpen}
        className="bg-black/60 hover:bg-black/80 rounded-full p-2.5"
        aria-label="Comment on reel"
      >
        <MessageCircle className="h-5 w-5 text-white" />
      </button>

      {commentCount > 0 ? (
        <span className="text-[10px] leading-none text-white/80">{commentCount}</span>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-120 flex items-end justify-center bg-black/70 p-3 sm:items-center"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
            onOpenChange?.(false);
          }}
        >
          <div
            className="swiper-no-swiping w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Comments</p>
                <p className="text-xs text-white/60">View and add comments</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenChange?.(false);
                }}
                className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Close comments"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto px-4 py-4">
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={item?.user?.profile_picture || item?.user?.profile_image || ""} />
                        <AvatarFallback className="bg-white/10 text-xs font-semibold text-white">
                          {getUserInitials(item?.user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1 rounded-2xl bg-white/5 px-3 py-2">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm font-semibold text-white">
                            {item?.user?.name || "User"}
                          </p>
                          <span className="shrink-0 text-[11px] text-white/40">
                            {formatDate(item?.created_at)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-5 text-white/85">
                          {item?.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-white/50">
                  No comments yet. Be the first to add one.
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-4">
              <div className="flex items-end gap-2">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Write a comment"
                  rows={2}
                  className="min-h-20 flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black hover:bg-white/90 disabled:opacity-50"
                  disabled={commentMutation.isPending || !comment.trim()}
                  aria-label="Send comment"
                >
                  {commentMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}