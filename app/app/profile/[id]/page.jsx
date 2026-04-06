"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchWithToken, postWithToken } from "@/helpers/api";
import toast from "react-hot-toast";

import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import Chatpanel from "@/components/message/Chatpanel";
import UserProfilePost from "@/components/profile/UserProfilePost";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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
  const [openChatDialog, setOpenChatDialog] = useState(false);
  const [receiver, setReceiver] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  

  // Fetch profile data
  const { data: profile, isLoading: profileDataLoading } = useQuery({
    queryKey: [`/personal-information/${id}`, accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  // Create post
  const createPostMutation = useMutation({
    mutationFn: async (formData) => {
      return await postWithToken("/friendship/friends", formData, accessToken);
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message);
        // queryClient.invalidateQueries({
        //   queryKey: ["/feed_management/public/feed/all/post"],
        // });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to create post");
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

  const handleAddPost = () => {
    const formData = new FormData();
    formData.append("friend_id", id);
    createPostMutation.mutate(formData);
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
                onClick={() => openLightbox(profileData?.profile_cover_picture ? 1 : 0)}
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
              <Button
                variant="outline"
                onClick={handleAddPost}
                disabled={createPostMutation.isPending}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-1 h-4 w-4" /> Add Friends
              </Button>
              <Button
                onClick={() => {
                  setOpenChatDialog(true);
                  setReceiver(profileData);
                }}
                className="w-full bg-secondary hover:bg-secondary/90 sm:w-auto"
              >
                <MessageCircle className="mr-1 h-4 w-4" /> Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile created posts */}
      <UserProfilePost id={id} />

      {/* Chat Panel Dialog */}
      <Dialog open={openChatDialog} onOpenChange={setOpenChatDialog}>
        <DialogContent className="h-dvh w-screen max-w-none rounded-none border-0 p-0 sm:h-[92dvh] sm:w-[96vw] sm:rounded-xl sm:border sm:max-w-4xl">
          <DialogTitle className="sr-only">Chat</DialogTitle>
          <div className="h-full overflow-hidden">
            <Chatpanel receiver={receiver} setShowChatPanel={setOpenChatDialog} />
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
