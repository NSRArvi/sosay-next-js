"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken, postWithToken, putWithToken } from "@/helpers/api";
import toast from "react-hot-toast";
import { Loader2, Camera, Check, Plus, ArrowUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProfilePost from "@/components/profile/ProfilePost";
import Image from "next/image";
import defaultCover from "../../assets/designs/Welcome.png";
import defaultProfile from "../../assets/designs/girl.png";
import Link from "next/link";

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

  // Fetch profile pictures
  const { data: profilePictures, isLoading: profilePicturesLoading } = useQuery(
    {
      queryKey: ["/user/profile/profilepicture", accessToken],
      queryFn: fetchWithToken,
      enabled: !!accessToken,
    },
  );

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
                <span className="font-semibold">10</span> Friends
              </p>
              <p>
                {" "}
                <span className="font-semibold">5</span> Posts
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

      {/* Profile created posts */}
      <ProfilePost />

      {/* Profile Picture Dialog */}
      <Dialog open={openProfileDialog} onOpenChange={setOpenProfileDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Profile Picture</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Upload Section */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Image
                src={profilePreview || "/default-avatar.png"}
                alt="Profile Preview"
                className="size-36 rounded-full object-cover"
                height={500}
                width={500}
              />
              <input
                id="profile-image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleProfileImageChange}
              />
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <label htmlFor="profile-image" className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" /> Upload New
                  </label>
                </Button>
                {newProfileImage && (
                  <Button
                    onClick={handleAddProfilePicture}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Save
                  </Button>
                )}
              </div>
            </div>

            {/* Gallery Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Select from Gallery
              </h3>
              {profilePicturesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {profilePictures?.data?.map((pp, i) => (
                    <div key={i} className="relative group">
                      <Image
                        src={pp?.picture_name}
                        alt="profile_picture"
                        loading="lazy"
                        className="object-cover rounded-lg h-[200px] w-full"
                        width={500}
                        height={500}
                      />
                      <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          onClick={() => handleUpdateProfilePicture(pp?.id)}
                          disabled={isLoading}
                          variant="secondary"
                          size="sm"
                        >
                          <ArrowUp className="mr-2 h-4 w-4" />
                          Set as Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenProfileDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cover Picture Dialog */}
      <Dialog open={openCoverDialog} onOpenChange={setOpenCoverDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Cover Picture</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Upload Section */}
            <div>
              <div className="relative">
                <Image
                  src={coverPreview}
                  className="w-full h-[200px] md:h-[250px] rounded-lg object-cover"
                  alt="Cover Preview"
                  width={500}
                  height={500}
                />
                <input
                  id="cover-image"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                />
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <label htmlFor="cover-image" className="cursor-pointer">
                      <Camera className="mr-2 h-4 w-4" />
                      Upload New
                    </label>
                  </Button>
                  {newCoverImage && (
                    <Button
                      onClick={handleAddCoverPicture}
                      disabled={isLoading}
                      size="sm"
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      Save
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Select from Gallery
              </h3>
              {coverPicturesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {coverPictures?.data?.map((cp, i) => (
                    <div key={i} className="relative group">
                      <Image
                        src={cp?.cover_picture_name}
                        alt="cover_picture"
                        loading="lazy"
                        className="w-full h-[200px] rounded-lg object-cover"
                        width={500}
                        height={500}
                      />
                      <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          onClick={() => handleUpdateCoverPicture(cp?.id)}
                          disabled={isLoading}
                          variant="secondary"
                          size="sm"
                        >
                          <ArrowUp className="mr-2 h-4 w-4" />
                          Set as Cover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCoverDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
