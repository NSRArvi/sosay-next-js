"use client";
import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Check, Search, X } from "lucide-react";

export default function SearchablePostSelector({
  posts,
  isLoading,
  selectedPostId,
  onSelectPost,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPostThumbnail = (post) => {
    const image = post?.post_files?.find((file) => file.file_type === 1);
    return image?.file_name;
  };

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;

    const query = searchQuery.toLowerCase();
    return posts.filter((post) => {
      const description = stripHtml(post.description).toLowerCase();
      const userName = post.user?.name?.toLowerCase() || "";
      const postId = post.id.toString();

      return (
        description.includes(query) ||
        userName.includes(query) ||
        postId.includes(query)
      );
    });
  }, [posts, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search posts by description, author, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </CardContent>
        </Card>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No posts available</p>
          </CardContent>
        </Card>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No posts matching "{searchQuery}"
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {filteredPosts.map((post) => {
            const thumbnail = getPostThumbnail(post);
            const isSelected = selectedPostId === post.id.toString();

            return (
              <button
                key={post.id}
                type="button"
                onClick={() => onSelectPost(post.id.toString())}
                className={`w-full flex gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? "border-secondary bg-secondary/5"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                }`}
              >
                {thumbnail && (
                  <div className="h-16 w-16 flex-shrink-0">
                    <img
                      src={thumbnail}
                      alt="Post thumbnail"
                      className="rounded object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={
                        post.user?.profile_picture ||
                        "https://api.sosay.org/storage/registration_image/default.png"
                      }
                      alt={post.user?.name}
                      className="h-5 w-5 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://api.sosay.org/storage/registration_image/default.png";
                      }}
                    />
                    <span className="font-medium text-sm truncate">
                      {post.user?.name}
                    </span>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      #{post.id}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {stripHtml(post.description)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatDate(post.created_at)}
                  </p>
                </div>

                {isSelected && (
                  <div className="flex items-center justify-center text-secondary flex-shrink-0">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </button>
            );
          })}

          {filteredPosts.length > 0 && (
            <p className="text-xs text-gray-500 text-center py-2">
              Showing {filteredPosts.length} of {posts.length} posts
            </p>
          )}
        </div>
      )}
    </div>
  );
}
