"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken, postWithToken, putWithToken } from "@/helpers/api";
import toast from "react-hot-toast";
import { Camera } from "lucide-react";
import ProfilePost from "@/components/profile/ProfilePost";
import ProfilePictureDialog from "@/components/profile/ProfilePictureDialog";
import CoverPictureDialog from "@/components/profile/CoverPictureDialog";
import Image from "next/image";
import defaultCover from "../../assets/designs/Welcome.png";
import defaultProfile from "../../assets/designs/girl.png";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import MyReelsTab from "@/components/reels/MyReelsTab";
import MyContentTab from "@/components/contents/MyContentTab";
import UserShop from "@/components/shop/UserShop";

export default function ProfilePage() {
  const { userInfo, setUserInfo, accessToken, isUserVerified } =
    useAppContext();

  const queryClient = useQueryClient();
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openCoverDialog, setOpenCoverDialog] = useState(false);
  const [profilePreview, setProfilePreview] = useState(
    userInfo?.user_image || defaultProfile,
  );
  const [coverPreview, setCoverPreview] = useState(
    userInfo?.user_cover_image || defaultCover,
  );
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newCoverImage, setNewCoverImage] = useState(null);

  const [activeTab, setActiveTab] = useState("Posts");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Tabs button here
  const Tabs = [
    {
      name: "Posts",
    },
    {
      name: "Reels",
    },
    {
      name: "Contents",
    },
    {
      name: "Products",
    },
  ];

  // Fetch profile pictures
  const { data: profilePictures, isLoading: profilePicturesLoading } = useQuery(
    {
      queryKey: ["/user/profile/profilepicture", accessToken],
      queryFn: fetchWithToken,
      enabled: !!accessToken,
    },
  );

  // Fetch profile stats
  const { data: profileStats, isLoading: profileStatsLoading } = useQuery({
    queryKey: [`users/${userInfo.id}/stats`, accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  const statsData = profileStats?.data;

  // Fetch cover pictures
  const { data: coverPictures, isLoading: coverPicturesLoading } = useQuery({
    queryKey: ["/user/profile/coverpicture", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  // Add new profile picture mutation
  const addProfilePictureMutation = useMutation({
    mutationFn: async (formData) => {
      return await postWithToken(
        "/user/profile/profilepicture",
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        const updatedUserInfo = {
          ...userInfo,
          user_image: data.data.picture_name,
        };
        setUserInfo(updatedUserInfo);
        if (typeof window !== "undefined") {
          localStorage.setItem("user_info", JSON.stringify(updatedUserInfo));
        }
        setOpenProfileDialog(false);
        setNewProfileImage(null);
        queryClient.invalidateQueries(["/user/profile/profilepicture"]);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to upload profile picture");
    },
  });

  // Update profile picture mutation
  const updateProfilePictureMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      return await putWithToken(
        `/user/profile/profilepicture/${id}`,
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        const updatedUserInfo = {
          ...userInfo,
          user_image: data.data.picture_name,
        };
        setUserInfo(updatedUserInfo);
        if (typeof window !== "undefined") {
          localStorage.setItem("user_info", JSON.stringify(updatedUserInfo));
        }
        setOpenProfileDialog(false);
        queryClient.invalidateQueries(["/user/profile/profilepicture"]);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to update profile picture");
    },
  });

  // Add new cover picture mutation
  const addCoverPictureMutation = useMutation({
    mutationFn: async (formData) => {
      return await postWithToken(
        "/user/profile/coverpicture",
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        const updatedUserInfo = {
          ...userInfo,
          user_cover_image: data.data.cover_picture_name,
        };
        setUserInfo(updatedUserInfo);
        if (typeof window !== "undefined") {
          localStorage.setItem("user_info", JSON.stringify(updatedUserInfo));
        }
        setOpenCoverDialog(false);
        setNewCoverImage(null);
        queryClient.invalidateQueries(["/user/profile/coverpicture"]);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to upload cover picture");
    },
  });

  // Update cover picture mutation
  const updateCoverPictureMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      return await putWithToken(
        `/user/profile/coverpicture/${id}`,
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        const updatedUserInfo = {
          ...userInfo,
          user_cover_image: data.data.cover_picture_name,
        };
        setUserInfo(updatedUserInfo);
        if (typeof window !== "undefined") {
          localStorage.setItem("user_info", JSON.stringify(updatedUserInfo));
        }
        setOpenCoverDialog(false);
        queryClient.invalidateQueries(["/user/profile/coverpicture"]);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to update cover picture");
    },
  });

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
      setNewProfileImage(file);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      setNewCoverImage(file);
    }
  };

  const handleAddProfilePicture = () => {
    if (!newProfileImage) return;

    const formData = new FormData();
    formData.append("picture_name", newProfileImage);
    formData.append("status", "0");
    formData.append("user_id", userInfo.id);

    addProfilePictureMutation.mutate(formData);
  };

  const handleUpdateProfilePicture = (id) => {
    const formData = new FormData();
    formData.append("profilepicture", id);

    updateProfilePictureMutation.mutate({ id, formData });
  };

  const handleAddCoverPicture = () => {
    if (!newCoverImage) return;

    const formData = new FormData();
    formData.append("cover_picture_name", newCoverImage);
    formData.append("status", "0");
    formData.append("user_id", userInfo.id);

    addCoverPictureMutation.mutate(formData);
  };

  const handleUpdateCoverPicture = (id) => {
    const formData = new FormData();
    formData.append("coverpicture", id);

    updateCoverPictureMutation.mutate({ id, formData });
  };

  const handleOpenProfileDialog = () => {
    setOpenProfileDialog(!openProfileDialog);
    setProfilePreview(userInfo.user_image);
    setNewProfileImage(null);
  };

  const handleOpenCoverDialog = () => {
    setOpenCoverDialog(!openCoverDialog);
    setCoverPreview(userInfo?.user_cover_image || defaultCover);
    setNewCoverImage(null);
  };

  const isLoading =
    addProfilePictureMutation.isPending ||
    updateProfilePictureMutation.isPending ||
    addCoverPictureMutation.isPending ||
    updateCoverPictureMutation.isPending;

  return (
    <section className="max-w-2xl mx-auto space-y-6 px-4 mt-14 md:mt-0">
      {/* Cover Picture */}
      <div className="relative">
        <Image
          src={userInfo?.user_cover_image || defaultCover}
          className="w-full h-[200px] md:h-[300px] rounded-b-xl object-cover"
          alt="Cover Image"
          height={1000}
          width={1000}
        />
        <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4">
          <button
            onClick={handleOpenCoverDialog}
            className="bg-white text-sm flex items-center gap-1.5 px-2 py-1 md:px-4 md:py-2 rounded-full shadow cursor-pointer hover:bg-gray-50 transition"
          >
            <Camera className="text-xl" />
            <span className="hidden md:block">Upload Cover</span>
          </button>
        </div>
      </div>

      {/* Profile Picture and Info */}
      <div className="max-w-5xl mx-auto px-5">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-16 md:-mt-20">
          <div className="relative">
            <Image
              src={userInfo?.user_image}
              alt="Profile Image"
              className="size-32 md:size-40 rounded-full object-cover border-4 border-white"
              height={500}
              width={500}
            />
            <button
              onClick={handleOpenProfileDialog}
              className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-50 transition"
            >
              <Camera className="text-xl" />
            </button>
          </div>
          <div className="text-center md:text-left md:mb-4">
            <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
              {userInfo?.name}
            </h1>

            {/* counts and badge  */}
            <div className="flex items-center gap-4 mt-2 text-sm">
              <p>
                {" "}
                <span className="font-semibold">
                  {" "}
                  {statsData?.posts_count | 0}{" "}
                </span>{" "}
                Posts
              </p>
              <p>
                {" "}
                <span className="font-semibold">
                  {" "}
                  {statsData?.friends_count || 0}{" "}
                </span>{" "}
                Friends
              </p>

              {/* check user verification status and show badge or link accordingly  */}
              {isUserVerified ? (
                <Link
                  href={"/app/verified-infromations"}
                  className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full bg-secondary text-white"
                >
                  Verified
                </Link>
              ) : (
                <Link
                  href="/app/verify"
                  className="px-4 py-1 text-xs rounded-full bg-destructive text-white"
                >
                  Not Verified
                </Link>
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
                  layoutId="profile-active-tab"
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
            {activeTab === "Posts" && <ProfilePost />}
            {activeTab === "Reels" && (
              <MyReelsTab
                accessToken={accessToken}
                onReelClick={() => {}}
                onUploadClick={() => {}}
              />
            )}
            {activeTab === "Contents" && (
              <MyContentTab
                accessToken={accessToken}
                onContentClick={() => {}}
                onUploadClick={() => {}}
              />
            )}
            {activeTab === "Products" && <UserShop />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Profile Picture Dialog */}
      <ProfilePictureDialog
        open={openProfileDialog}
        onOpenChange={setOpenProfileDialog}
        profilePreview={profilePreview}
        profilePictures={profilePictures}
        profilePicturesLoading={profilePicturesLoading}
        isLoading={isLoading}
        newProfileImage={newProfileImage}
        onImageChange={handleProfileImageChange}
        onAddProfilePicture={handleAddProfilePicture}
        onUpdateProfilePicture={handleUpdateProfilePicture}
      />

      {/* Cover Picture Dialog */}
      <CoverPictureDialog
        open={openCoverDialog}
        onOpenChange={setOpenCoverDialog}
        coverPreview={coverPreview}
        coverPictures={coverPictures}
        coverPicturesLoading={coverPicturesLoading}
        isLoading={isLoading}
        newCoverImage={newCoverImage}
        onImageChange={handleCoverImageChange}
        onAddCoverPicture={handleAddCoverPicture}
        onUpdateCoverPicture={handleUpdateCoverPicture}
      />
    </section>
  );
}
