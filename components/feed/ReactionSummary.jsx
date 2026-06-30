import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { REACTIONS } from "./ReactionButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function ReactionSummary({ post }) {
  const [activeFilter, setActiveFilter] = useState("all");

  if (!post?.reactions_count || post.reactions_count === 0) return null;

  // Derive filtered reactions based on activeFilter
  const filteredReactions =
    activeFilter === "all"
      ? post?.reactions || []
      : post?.reactions?.filter((r) => r.type === activeFilter) || [];

  return (
    <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
      {post?.reaction_counts && (
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex items-center gap-3 flex-wrap cursor-pointer hover:bg-gray-50 rounded px-1 -ml-1 transition-colors">
              {Object.entries(post.reaction_counts).map(([type, count]) => {
                const reactors =
                  post?.reactions?.filter((r) => r.type === type) || [];
                const IconComponent = REACTIONS[type]?.icon;
                const iconColor = REACTIONS[type]?.color || "text-gray-500";

                return (
                  <div
                    key={type}
                    className="relative flex items-center gap-1 whitespace-nowrap group"
                  >
                    {IconComponent && (
                      <IconComponent
                        size={14}
                        className={`fill ${iconColor}`}
                      />
                    )}
                    <span className="capitalize font-medium hidden sm:inline">
                      {type}
                    </span>
                    <span className="text-gray-500">({count})</span>

                    {/* Tooltip */}
                    {reactors.length > 0 && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-max max-w-[200px]">
                        <div className="bg-gray-800 text-white text-[11px] rounded-md py-1.5 px-2.5 whitespace-normal leading-tight shadow-lg">
                          {reactors
                            .map((r) => r.user?.name)
                            .filter(Boolean)
                            .join(", ")}
                          {count > reactors.length &&
                            ` and ${count - reactors.length} others`}
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="pt-6 px-6 pb-2 border-b border-gray-100">
              <DialogTitle className="sr-only">Reactions</DialogTitle>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    activeFilter === "all"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  All {post.reactions_count}
                </button>
                {Object.entries(post.reaction_counts).map(([type, count]) => {
                  const IconComponent = REACTIONS[type]?.icon;
                  const iconColor = REACTIONS[type]?.color || "text-gray-500";
                  if (count === 0) return null;

                  return (
                    <button
                      key={type}
                      onClick={() => setActiveFilter(type)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                        activeFilter === type
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {IconComponent && (
                        <IconComponent
                          size={16}
                          className={`fill ${iconColor}`}
                        />
                      )}
                      {count}
                    </button>
                  );
                })}
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-4 py-4 px-6">
                {filteredReactions.length > 0 ? (
                  filteredReactions.map((reaction) => {
                    const IconComponent = REACTIONS[reaction.type]?.icon;
                    const iconColor =
                      REACTIONS[reaction.type]?.color || "text-gray-500";

                    return (
                      <div
                        key={reaction.id}
                        className="flex items-center justify-between group"
                      >
                        <Link
                          href={`/app/profile/${reaction.user?.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="relative">
                            <Avatar className="h-10 w-10 ring-1 ring-gray-100">
                              <AvatarImage
                                src={reaction.user?.profile_picture}
                              />
                              <AvatarFallback className="capitalize bg-linear-to-br from-secondary to-purple-600 text-white text-sm font-semibold">
                                {reaction.user?.name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            {IconComponent && (
                              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[2px] shadow-sm">
                                <IconComponent
                                  size={14}
                                  className={`fill ${iconColor}`}
                                />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium hover:text-secondary hover:underline cursor-pointer">
                              {reaction.user?.name}
                            </p>
                          </div>
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No detailed reactions to show.
                  </p>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
