"use client";

import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import NextImage from "next/image";

// TipTap
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Globe, ImageIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken, postWithToken } from "@/helpers/api";
import { useParams } from "next/navigation";
import { useAppContext } from "@/context/context";
import PostCardSkleton from "@/components/feed/PostCardSkleton";

export default function UpdatePostPage() {
  const { slug } = useParams();
  const { accessToken, userInfo } = useAppContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loadedExistingImages, setLoadedExistingImages] = useState({});
  const [loadedNewImages, setLoadedNewImages] = useState({});
  const previewUrlsRef = useRef([]);

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [visibility, setVisibility] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "What's on your mind?" }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[150px] p-4 rounded-lg bg-muted/30 border border-muted-foreground/20",
      },
    },
  });

  // Fetch post data
  const { data: postData, isLoading: isLoadingPost } = useQuery({
    queryKey: [`/feed_management/private/posts/${slug}`, accessToken],
    queryFn: fetchWithToken,
    enabled: !!slug && !!accessToken,
  });

  const post = postData?.data;

  // Fetch interests
  const { data: interestsData } = useQuery({
    queryKey: ["/feed_management/public/feed/interests", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });
  const interests = interestsData?.data || [];

  // Initialize form with existing post data
  useEffect(() => {
    if (post && editor && !isInitialized) {
      editor.commands.setContent(post.description || "");
      setVisibility(post.visibility_id || 1);
      setSelectedInterests(post.interests?.map((i) => i.id) || []);
      setExistingImages(post.post_files || []);
      setIsInitialized(true);
    }
  }, [post, editor, isInitialized]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Handle new image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    previewUrlsRef.current = previewUrls;

    setImages(files);
    setImagePreviews(previewUrls);
    setLoadedNewImages({});
  };

  // Remove new image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed);
      const next = prev.filter((_, i) => i !== index);
      previewUrlsRef.current = next;
      return next;
    });
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle interest selection
  const handleInterestClick = (interestId) => {
    setSelectedInterests((prevSelected) => {
      if (prevSelected.includes(interestId)) {
        return prevSelected.filter((id) => id !== interestId);
      } else {
        return [...prevSelected, interestId];
      }
    });
  };

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: async (formData) => {
      return await postWithToken(
        `/feed_management/private/posts/${slug}`,
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message || "Post updated successfully");
        queryClient.invalidateQueries([
          `/feed_management/private/feeds/all/post/${userInfo.id}`,
        ]);
        queryClient.invalidateQueries([
          `/feed_management/private/posts/${slug}`,
        ]);
        router.push("/app/profile");
      } else {
        toast.error(data.message || "Failed to update post");
      }
    },
    onError: () => {
      toast.error("Failed to update post");
    },
  });

  const handleUpdatePost = () => {
    const description = editor?.getHTML();

    const formData = new FormData();
    formData.append("description", description);
    formData.append("interest", JSON.stringify(selectedInterests));
    formData.append("visibility_id", visibility);
    formData.append("_method", "PUT");

    // Add new images
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    updatePostMutation.mutate(formData);
  };

  const isLoading = updatePostMutation.isPending;

  const visibilityOptions = [
    { id: 1, label: "Public" },
    { id: 2, label: "Friends" },
    { id: 3, label: "Private" },
  ];

  const currentVisibility = visibilityOptions.find((v) => v.id === visibility);

  if (isLoadingPost) {
    return (
      <div className="max-w-2xl mx-auto mt-14 p-4">
        <PostCardSkleton />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-center text-muted-foreground">Post not found</p>
      </div>
    );
  }

  return (
    <section className="p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 space-y-6 animate-fade-in mt-14 md:mt-8 relative">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={userInfo?.user_image} />
            <AvatarFallback className="capitalize bg-linear-to-br from-secondary to-purple-600 text-white text-sm font-semibold">
              {userInfo?.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-lg">Update Post</h2>
            <p className="text-sm text-muted-foreground">
              Edit your post content
            </p>
          </div>
        </div>

        {/* Editor */}
        <EditorContent editor={editor} />

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Current Images</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {existingImages.map((image, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden border bg-muted/30"
                >
                  {(() => {
                    const imageSrc = image.file_name || image;
                    return (
                      <div className="relative w-full h-56 bg-muted">
                        {!loadedExistingImages[imageSrc] && (
                          <div className="absolute inset-0 animate-pulse bg-accent" />
                        )}
                        <NextImage
                          src={imageSrc}
                          alt={`Existing ${index}`}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 50vw"
                          onLoadingComplete={() =>
                            setLoadedExistingImages((prev) => ({
                              ...prev,
                              [imageSrc]: true,
                            }))
                          }
                          onError={() =>
                            setLoadedExistingImages((prev) => ({
                              ...prev,
                              [imageSrc]: true,
                            }))
                          }
                          className={`object-contain transition-opacity duration-300 ${
                            loadedExistingImages[imageSrc]
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                      </div>
                    );
                  })()}
                  <button
                    className="cursor-pointer absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    onClick={() => removeExistingImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Preview */}
        {imagePreviews.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">New Images</p>
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {imagePreviews.map((previewUrl, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden border bg-muted/30"
                >
                  <div className="relative w-full h-56 bg-muted">
                    {!loadedNewImages[previewUrl] && (
                      <div className="absolute inset-0 animate-pulse bg-accent" />
                    )}
                    <NextImage
                      src={previewUrl}
                      alt={`New ${index}`}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onLoadingComplete={() =>
                        setLoadedNewImages((prev) => ({
                          ...prev,
                          [previewUrl]: true,
                        }))
                      }
                      onError={() =>
                        setLoadedNewImages((prev) => ({
                          ...prev,
                          [previewUrl]: true,
                        }))
                      }
                      className={`object-contain transition-opacity duration-300 ${
                        loadedNewImages[previewUrl] ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>
                  <button
                    className="cursor-pointer absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {/* <div className="space-y-2">
          <p className="text-sm font-medium">Select labels</p>
          <div className="flex gap-2 flex-wrap">
            {interests?.map((interest) => (
              <Badge
                key={interest.id}
                variant={
                  selectedInterests.includes(interest.id)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer py-1.5 px-4"
                onClick={() => handleInterestClick(interest.id)}
              >
                {interest.name}
              </Badge>
            ))}
          </div>
        </div> */}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-3">
            {/* Image Upload */}
            <input
              type="file"
              accept="image/*"
              multiple
              id="imageUploadInput"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="imageUploadInput"
              className="cursor-pointer size-10 rounded-full border flex justify-center items-center hover:shadow"
            >
              <ImageIcon className="h-5 w-5" />
            </label>

            {/* Visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="cursor-pointer rounded-full px-4 py-1.5 border flex items-center hover:shadow">
                  <Globe className="h-5 w-5 mr-2" />
                  {currentVisibility?.label}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {visibilityOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => setVisibility(option.id)}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              className="cursor-pointer absolute top-2 right-2 hover:bg-red-500 hover:text-white size-8 rounded-full transition"
            >
              <X />
            </Button>
            <Button
              onClick={handleUpdatePost}
              disabled={isLoading}
              className="px-6 cursor-pointer bg-secondary/90 hover:bg-secondary"
            >
              {isLoading ? "Updating Post" : "Update Post"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
