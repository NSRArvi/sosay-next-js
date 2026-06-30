"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Smile, Laugh, Frown, ThumbsUp, Angry } from "lucide-react";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { postWithToken } from "@/helpers/api";

const REACTIONS = {
  like: { icon: ThumbsUp, label: "Like", color: "text-blue-500" },
  love: { icon: Heart, label: "Love", color: "text-pink-500" },
  haha: { icon: Laugh, label: "Haha", color: "text-yellow-400" },
  wow: { icon: Smile, label: "Wow", color: "text-cyan-400" },
  sad: { icon: Frown, label: "Sad", color: "text-gray-300" },
  angry: { icon: Angry, label: "Angry", color: "text-red-400" },
};

export default function ContentReactionButton({
  contentId,
  initialReaction = null,
  initialCount = 0,
  accessToken,
}) {
  const queryClient = useQueryClient();
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState(initialReaction);
  const [reactionCount, setReactionCount] = useState(initialCount);

  const CurrentIcon = reaction ? REACTIONS[reaction]?.icon : ThumbsUp;
  const currentColor = reaction ? REACTIONS[reaction]?.color : "text-gray-500";

  const reactMutation = useMutation({
    mutationFn: async ({ type }) => {
      const formData = new FormData();
      formData.append("type", type);
      return await postWithToken(
        `/contents/${contentId}/react`,
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data?.status !== true) {
        toast.error(data?.message || "Failed to react");
      }
      queryClient.invalidateQueries({ queryKey: ["/contents", contentId] });
      queryClient.invalidateQueries({ queryKey: ["/contents"] });
      queryClient.invalidateQueries({ queryKey: ["/contents/me"] });
    },
    onError: (_error, variables) => {
      setReaction(variables.prevReaction);
      setReactionCount(variables.prevCount);
      toast.error("Failed to react");
    },
  });

  const handleReaction = (type) => {
    if (!contentId) return;

    const prevReaction = reaction;
    const prevCount = reactionCount;
    const nextReaction = prevReaction === type ? null : type;
    const nextCount =
      prevReaction === null
        ? prevCount + 1
        : nextReaction === null
          ? Math.max(0, prevCount - 1)
          : prevCount;

    setReaction(nextReaction);
    setReactionCount(nextCount);
    setShowReactions(false);

    reactMutation.mutate({
      type,
      prevReaction,
      prevCount,
    });
  };

  return (
    <Popover open={showReactions} onOpenChange={setShowReactions}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseEnter={() => setShowReactions(true)}
          onClick={() => handleReaction("like")}
          className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 transition-colors px-3 py-1.5 rounded-full border border-gray-100"
          aria-label="React to content"
          disabled={reactMutation.isPending}
        >
          <CurrentIcon
            className={`h-4 w-4 ${reaction ? "fill" : ""} ${currentColor}`}
          />
          <span className="text-sm font-medium text-gray-700">
            {reactionCount}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-2 bg-white border-gray-200 shadow-md rounded-full"
        onMouseLeave={() => setShowReactions(false)}
        align="start"
        side="top"
      >
        <div className="flex gap-1">
          {Object.entries(REACTIONS).map(([key, { icon: Icon, color }]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleReaction(key)}
              className={`p-2 rounded-full hover:scale-110 transition-transform ${color} hover:bg-gray-100`}
              disabled={reactMutation.isPending}
              aria-label={`React with ${key}`}
            >
              <Icon
                className={`h-5 w-5 ${reaction === key ? "fill-current" : ""}`}
              />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
