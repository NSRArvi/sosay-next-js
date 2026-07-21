"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken, postWithToken } from "@/helpers/api";
import toast from "react-hot-toast";

import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle, Minus, Plus, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Chatpanel from "@/components/message/Chatpanel";
import UserProfilePost from "@/components/profile/UserProfilePost";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import UserProfileReels from "@/components/profile/UserProfileReels";
import UserProfileContents from "@/components/profile/UserProfileContents";
import UserProfileProducts from "@/components/profile/UserProfileProducts";

function ProfilePicture({ src, onClick }) {
  const [isLoading, setIsLoading] = useState(Boolean(src));
  const [hasError, setHasError] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      className="size-32 md:size-40 rounded-full border-4 border-white bg-muted overflow-hidden flex items-center justify-center relative cursor-pointer"
    >
      {src && !hasError ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 rounded-full bg-accent animate-pulse" />
          )}
          <Image
            src={src}
            alt="Profile Image"
            className="size-32 md:size-40 rounded-full object-cover"
            height={500}
            width={500}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 rounded-full bg-accent animate-pulse" />
      )}
    </button>
  );
}

export default function ProfilePage() {
  const { id } = useParams();
  const { accessToken } = useAppContext();
  const queryClient = useQueryClient();
  const [openChatDialog, setOpenChatDialog] = useState(false);
  const [receiver, setReceiver] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [activeTab, setActiveTab] = useState("Posts");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const Tabs = [
    { name: "Posts" },
    { name: "Reels" },
    { name: "Contents" },
    { name: "Products" },
  ];

  // Fetch profile data
  const { data: profile, isLoading: profileDataLoading } = useQuery({
    queryKey: [`/personal-information/${id}`, accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  // Add Friend
  const addFriendMutation = useMutation({
    mutationFn: async (formData) => {
      return await postWithToken("/friendship/friends", formData, accessToken);
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [`/personal-information/${id}`, accessToken],
        });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to send friend request");
    },
  });

  // Unfriend
  const unfriendMutation = useMutation({
    mutationFn: async (formData) => {
      return await postWithToken(
        "/friendship/friends/unfriend",
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [`/personal-information/${id}`, accessToken],
        });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to unfriend");
    },
  });

  // Cancel Friend Request
  const cancelFriendRequestMutation = useMutation({
    mutationFn: async (formData) => {
      return await postWithToken(
        "/friendship/sent-friends-request/cancel",
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [`/personal-information/${id}`, accessToken],
        });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to cancel friend request");
    },
  });

  const profileData = profile?.data;

  const lightboxSlides = [
    ...(profileData?.profile_cover_picture
      ? [{ src: profileData.profile_cover_picture, alt: "Cover Image" }]
      : []),
    ...(profileData?.profile_picture
      ? [{ src: profileData.profile_picture, alt: "Profile Image" }]
      : []),
  ];

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleAddFriend = () => {
    const formData = new FormData();
    formData.append("friend_id", id);
    addFriendMutation.mutate(formData);
  };

  const handleUnfriend = () => {
    const formData = new FormData();
    formData.append("friend_id", id);
    unfriendMutation.mutate(formData);
  };

  const handleCancelFriendRequest = () => {
    const formData = new FormData();
    formData.append("friend_id", id);
    cancelFriendRequestMutation.mutate(formData);
  };

  return (
    <section className="mx-auto mt-14 max-w-2xl space-y-6 px-3 sm:px-4 md:mt-0">
      {/* Cover Picture */}
      <div className="relative">
        {profileDataLoading ? (
          <div className="w-full h-[200px] md:h-[300px] rounded-b-xl bg-accent animate-pulse" />
        ) : profileData?.profile_cover_picture ? (
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="block w-full cursor-pointer"
          >
            <Image
              src={profileData.profile_cover_picture}
              className="w-full h-[200px] md:h-[300px] rounded-b-xl object-cover"
              alt="Cover Image"
              height={1000}
              width={1000}
            />
          </button>
        ) : (
          <div className="w-full h-[200px] md:h-[300px] rounded-b-xl bg-muted flex items-center justify-center text-sm md:text-base font-medium text-muted-foreground">
            No Cover Picture added
          </div>
        )}
      </div>

      {/* Profile Picture and Info */}
      <div className="mx-auto max-w-5xl px-3 sm:px-5">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-16 md:-mt-20">
          <div className="relative">
            {profileDataLoading ? (
              <div className="size-32 md:size-40 rounded-full border-4 border-white bg-accent animate-pulse" />
            ) : (
              <ProfilePicture
                key={profileData?.profile_picture || "profile-picture"}
                src={profileData?.profile_picture}
                onClick={() =>
                  openLightbox(profileData?.profile_cover_picture ? 1 : 0)
                }
              />
            )}
          </div>
          <div className="text-center md:text-left md:mb-4">
            <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
              {profileDataLoading ? (
                <span className="inline-block h-7 w-44 rounded bg-accent animate-pulse" />
              ) : (
                profileData?.name
              )}
            </h1>

            <div className="mt-2 flex w-full flex-wrap justify-center gap-2 md:w-auto md:justify-start">
              {!profileData?.friends?.is_self && (
                <>
                  {profileData?.friends?.is_friend ? (
                    <Button
                      variant="outline"
                      onClick={handleUnfriend}
                      disabled={unfriendMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      {unfriendMutation.isPending ? (
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <Minus className="mr-1 h-4 w-4" />
                      )}
                      Unfriend
                    </Button>
                  ) : profileData?.friends?.is_request_sent ? (
                    <Button
                      variant="outline"
                      onClick={handleCancelFriendRequest}
                      disabled={cancelFriendRequestMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      {cancelFriendRequestMutation.isPending ? (
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <X className="mr-1 h-4 w-4" />
                      )}
                      Cancel Request
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleAddFriend}
                      disabled={addFriendMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      {addFriendMutation.isPending ? (
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-1 h-4 w-4" />
                      )}
                      Add Friend
                    </Button>
                  )}

                  <Button
                    onClick={() => {
                      setOpenChatDialog(true);
                      setReceiver(profileData);
                    }}
                    className="w-full bg-secondary hover:bg-secondary/90 sm:w-auto"
                  >
                    <MessageCircle className="mr-1 h-4 w-4" /> Send Message
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs button here */}
      <div className="flex gap-2 items-center mt-6 overflow-x-auto p-1 bg-gray-50/50 rounded-xl max-w-fit mx-auto md:mx-0">
        {Tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => handleTabChange(tab.name)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded-lg z-10 ${
                isActive ? "text-primary" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="profile-id-active-tab"
                  className="absolute inset-0 bg-white shadow-sm rounded-lg border border-gray-200/60 -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tabs content here */}
      <div className="mt-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Posts" && <UserProfilePost id={id} />}
            {activeTab === "Reels" && <UserProfileReels id={id} />}
            {activeTab === "Contents" && <UserProfileContents id={id} />}
            {activeTab === "Products" && <UserProfileProducts id={id} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Chat Panel Dialog */}
      <Dialog open={openChatDialog} onOpenChange={setOpenChatDialog}>
        <DialogContent className="h-dvh w-screen max-w-none rounded-none border-0 p-0 sm:h-[92dvh] sm:w-[96vw] sm:rounded-xl sm:border sm:max-w-4xl">
          <DialogTitle className="sr-only">Chat</DialogTitle>
          <div className="h-full overflow-hidden">
            <Chatpanel
              receiver={receiver}
              setShowChatPanel={setOpenChatDialog}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
      />
    </section>
  );
}
