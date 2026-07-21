"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithToken } from "@/helpers/api";
import {
  Loader2,
  Crown,
  User,
  ArrowLeft,
  Play,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ContentReactionButton from "./ContentReactionButton";
import ContentCommentForm from "./ContentCommentForm";
import ContentPaymentModal from "./ContentPaymentModal";

export default function ContentDetails({
  contentId,
  onBack,
  onContentClick,
  accessToken,
}) {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Fetch content details
  const { data: contentData, isLoading: isContentLoading } = useQuery({
    queryKey: ["/contents", contentId],
    queryFn: () =>
      fetchWithToken({
        queryKey: [`/contents/${contentId}`, accessToken],
      }),
    enabled: !!contentId,
  });

  const content = contentData?.data?.content;
  // Use related array from API response
  const relatedVideos = contentData?.data?.related || [];

  // Fetch creator profile
  const creatorId = content?.user?.id;
  const { data: creatorData, isLoading: isCreatorLoading } = useQuery({
    queryKey: ["/contents/creators", creatorId],
    queryFn: () =>
      fetchWithToken({
        queryKey: [`/contents/creators/${creatorId}`, accessToken],
      }),
    enabled: !!creatorId,
  });

  const creatorProfile = creatorData?.data?.creator_profile;
  const isSubscribed = creatorData?.data?.is_subscribed;

  if (isContentLoading || !content) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500 mb-4" />
        <p className="text-gray-500">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <Button
        variant="ghost"
        onClick={onBack}
        className="gap-2 -ml-4 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Video Player */}
          <div className="relative w-full bg-black rounded-xl overflow-hidden aspect-[4/3] sm:aspect-video shadow-sm">
            <video
              src={content.video_url}
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
          </div>

          {/* Title and Stats */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {content.title || "Untitled Content"}
              </h1>
              {content.is_premium === 1 && (
                <div className="bg-yellow-500 text-white text-xs px-2.5 py-1 rounded-md font-bold shadow-sm flex items-center gap-1.5 whitespace-nowrap tracking-wide">
                  <Crown className="w-3.5 h-3.5" /> PREMIUM
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 font-medium">
              <ContentReactionButton
                contentId={content.id}
                initialReaction={content.current_user_reaction}
                initialCount={content.reactions_count}
                accessToken={accessToken}
              />
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <MessageCircle className="w-4 h-4" />
                <span>{content.comments_count}</span>
              </div>
            </div>
          </div>

          {/* Creator Profile Section */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0 border border-gray-200">
                {content.user?.profile_picture ? (
                  <img
                    src={content.user.profile_picture}
                    alt={content.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {content.user?.name}
                </h3>
                {creatorProfile?.bio ? (
                  <p className="text-xs text-gray-600 line-clamp-4 mt-0.5">
                    {creatorProfile.bio}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Content Creator
                  </p>
                )}
              </div>
            </div>
            {creatorProfile && (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-white rounded-full"
                  asChild
                >
                  <Link href={`/app/profile/${content.user?.id}`}>
                    View Profile
                  </Link>
                </Button>
                <Button
                  variant={isSubscribed ? "outline" : "default"}
                  className={
                    !isSubscribed
                      ? "bg-secondary text-white hover:bg-secondary/95 w-full sm:w-auto rounded-full"
                      : "w-full sm:w-auto"
                  }
                  onClick={() => {
                    if (!isSubscribed) {
                      setPaymentModalOpen(true);
                    }
                  }}
                >
                  {isSubscribed
                    ? "Subscribed"
                    : `Subscribe for $${creatorProfile.subscription_price}`}
                </Button>
              </div>
            )}
          </div>

          {/* Description */}
          {content.description && (
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {content.description}
              </p>
            </div>
          )}

          {/* Comments Section */}
          <div className="pt-6">
            <h3 className="font-bold text-xl mb-6 text-gray-900">
              Comments ({content.comments?.length || 0})
            </h3>

            <ContentCommentForm
              contentId={content.id}
              accessToken={accessToken}
            />

            {content.comments && content.comments.length > 0 ? (
              <div className="space-y-5">
                {content.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center border border-gray-200">
                      {comment.user?.profile_picture ? (
                        <img
                          src={comment.user.profile_picture}
                          alt={comment.user?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                          {comment.user?.name || "User"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed bg-white p-3 rounded-2xl rounded-tl-none inline-block border border-gray-100">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-xl text-center border border-gray-100">
                <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">
                  No comments yet
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Related Videos */}
        <div className="lg:w-[380px] shrink-0 space-y-4">
          <h3 className="font-bold text-lg text-gray-900">Related Content</h3>
          {relatedVideos && relatedVideos.length > 0 ? (
            <div className="flex flex-col gap-4">
              {relatedVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex gap-3 cursor-pointer group hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors"
                  onClick={() => onContentClick(video.id)}
                >
                  {/* Thumbnail */}
                  <div className="relative w-40 aspect-video bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    <video
                      src={video.video_url}
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 duration-200 shadow-md">
                        <Play className="w-4 h-4 text-black fill-black" />
                      </div>
                    </div>
                    {video.is_premium === 1 && (
                      <div className="absolute top-1.5 left-1.5 bg-yellow-500 text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 font-bold">
                        <Crown className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex flex-col py-1 justify-start">
                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {video.title || "Untitled Content"}
                    </h4>
                    <span className="text-xs text-gray-500 mt-1.5 font-medium">
                      {video.view_count || 0} views
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 border border-gray-100 bg-gray-50 rounded-xl p-8 text-center flex flex-col items-center">
              <Play className="w-8 h-8 text-gray-300 mb-3" />
              <p>No related content found.</p>
            </div>
          )}
        </div>
      </div>

      <ContentPaymentModal
        creatorId={creatorId}
        accessToken={accessToken}
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
      />
    </div>
  );
}
