"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { postWithToken } from "@/helpers/api";

export default function ContentCommentForm({ contentId, accessToken }) {
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const commentMutation = useMutation({
    mutationFn: async (text) => {
      const formData = new FormData();
      formData.append("comment", text);
      return await postWithToken(
        `/contents/${contentId}/comment`,
        formData,
        accessToken
      );
    },
    onSuccess: (data) => {
      if (data?.status === true || data?.success === true) {
        toast.success("Comment added!");
        setComment("");
        // Invalidate queries to trigger refetch
        queryClient.invalidateQueries({ queryKey: ["/contents", contentId] });
      } else {
        toast.error(data?.message || "Failed to add comment");
      }
    },
    onError: () => {
      toast.error("An error occurred while commenting");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    commentMutation.mutate(comment);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
        disabled={commentMutation.isPending}
      />
      <Button 
        type="submit" 
        disabled={!comment.trim() || commentMutation.isPending}
        className="rounded-full px-4 shadow-sm"
      >
        {commentMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
}
