"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Smile, Laugh, Frown, ThumbsUp, Angry } from "lucide-react";
import toast from "react-hot-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppContext } from "@/context/context";
import { postWithToken } from "@/helpers/api";

const REACTIONS = {
  like: { icon: ThumbsUp, label: "Like", color: "text-blue-500" },
  love: { icon: Heart, label: "Love", color: "text-pink-500" },
  haha: { icon: Laugh, label: "Haha", color: "text-yellow-400" },
  wow: { icon: Smile, label: "Wow", color: "text-cyan-400" },
  sad: { icon: Frown, label: "Sad", color: "text-gray-300" },
  angry: { icon: Angry, label: "Angry", color: "text-red-400" },
};

export default function ReelReactionButton({
  reelId,
  initialReaction = null,
  initialCount = 0,
}) {
  const { accessToken } = useAppContext();
  const queryClient = useQueryClient();
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState(initialReaction);
  const [reactionCount, setReactionCount] = useState(initialCount);

  const CurrentIcon = reaction ? REACTIONS[reaction]?.icon : Heart;
  const currentColor = reaction ? REACTIONS[reaction]?.color : "text-white";

  const reactMutation = useMutation({
    mutationFn: async ({ type }) => {
      if (!accessToken) {
        throw new Error("Missing access token");
      }
      const formData = new FormData();
      formData.append("type", type);
      return await postWithToken(`/reels/${reelId}/react`, formData, accessToken);
    },
    onSuccess: (data) => {
      if (data?.status !== true) {
        toast.error(data?.message || "Failed to react");
      }
      queryClient.invalidateQueries({ queryKey: ["/reels"] });
      queryClient.invalidateQueries({ queryKey: ["/my-reels"] });
    },
    onError: (_error, variables) => {
      setReaction(variables.prevReaction);
      setReactionCount(variables.prevCount);
      toast.error("Failed to react");
    },
  });

  const handleReaction = (type) => {
    if (!reelId) return;

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
    <div className="flex flex-col items-center gap-1">
      <Popover open={showReactions} onOpenChange={setShowReactions}>
        <PopoverTrigger asChild>
          <button
            type="button"
            onMouseEnter={() => setShowReactions(true)}
            onClick={() => handleReaction("like")}
            className="bg-black/60 hover:bg-black/80 rounded-full p-2.5"
            aria-label="React to reel"
            disabled={reactMutation.isPending}
          >
            <CurrentIcon
              className={`h-5 w-5 ${reaction ? "fill-current" : ""} ${currentColor}`}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-2 bg-black/90 border-white/20"
          onMouseLeave={() => setShowReactions(false)}
          align="start"
          side="left"
        >
          <div className="flex gap-2">
            {Object.entries(REACTIONS).map(([key, { icon: Icon, color }]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleReaction(key)}
                className={`p-2 rounded-full hover:scale-110 transition-transform ${color} hover:bg-white/10`}
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

      {reactionCount > 0 ? (
        <span className="text-[10px] leading-none text-white/80">{reactionCount}</span>
      ) : null}
    </div>
  );
}