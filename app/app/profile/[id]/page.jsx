"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken, postWithToken, putWithToken } from "@/helpers/api";
import toast from "react-hot-toast";

import ProfilePost from "@/components/profile/ProfilePost";
import Image from "next/image";
import { useParams } from "next/navigation";
import defaultCover from "../../../assets/designs/Welcome.png";
import defaultProfile from "../../../assets/designs/girl.png";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import Chatpanel from "@/components/message/Chatpanel";
import UserProfilePost from "@/components/profile/UserProfilePost";

export default function ProfilePage() {
  const { id } = useParams();
  const { accessToken } = useAppContext();
  const [openChatDialog, setOpenChatDialog] = useState(false);
  const [receiver, setReceiver] = useState(null);
  

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

  const handleAddPost = () => {
    const formData = new FormData();
    formData.append("friend_id", id);
    createPostMutation.mutate(formData);
  };

  return (
    <section className="max-w-2xl mx-auto space-y-6 px-4 mt-14 md:mt-0">
      {/* Cover Picture */}
      <div className="relative">
        <Image
          src={profileData?.profile_cover_picture || defaultCover}
          className="w-full h-[200px] md:h-[300px] rounded-b-xl object-cover"
          alt="Cover Image"
          height={1000}
          width={1000}
        />
      </div>

      {/* Profile Picture and Info */}
      <div className="max-w-5xl mx-auto px-5">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-16 md:-mt-20">
          <div className="relative">
            <Image
              src={profileData?.profile_picture || defaultProfile}
              alt="Profile Image"
              className="size-32 md:size-40 rounded-full object-cover border-4 border-white"
              height={500}
              width={500}
            />
          </div>
          <div className="text-center md:text-left md:mb-4">
            <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
              {profileData?.name}
            </h1>

            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                onClick={handleAddPost}
                disabled={createPostMutation.isPending}
              >
                <Plus className="mr-1 h-4 w-4" /> Add Friends
              </Button>
              <Button
                onClick={() => {
                  setOpenChatDialog(true);
                  setReceiver(profileData);
                }}
                className="bg-secondary hover:bg-secondary/90"
              >
                <MessageCircle className="mr-1 h-4 w-4" /> Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile created posts */}
      <UserProfilePost id={id} />

      {/* Profile Picture Dialog */}
      <Dialog open={openChatDialog} onOpenChange={setOpenChatDialog}>
        <DialogContent className="p-0">
          <DialogTitle className="sr-only">Chat</DialogTitle>
          <div className="space-y-6 min-h-[80vh]">
            <Chatpanel receiver={receiver} />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
