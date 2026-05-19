"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

// TipTap
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useAppContext } from "@/context/context";
import { Globe, ImageIcon, Video, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken, postWithToken } from "@/helpers/api";

export default function AddPostPage() {
  const { userInfo, accessToken, setUploadProgress } = useAppContext();
  const queryClient = useQueryClient();
  const [images, setImages] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [visibility, setVisibility] = useState(1);

  // TipTap
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const getFileType = (file) => {
    return file.type.startsWith("video/") ? "video" : "image";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  //   Get interest
  const { data: interestsData } = useQuery({
    queryKey: ["/feed_management/public/feed/interests", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });
  const interests = interestsData?.data || [];

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

  // Create post with progress tracking
  const createPostMutation = useMutation({
    mutationFn: async (formData) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setUploadProgress(Math.round(percentComplete));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"));
        });

        const apiUrl = `${process.env.NEXT_PUBLIC_API_DEV_URL}/feed_management/private/posts`;
        xhr.open("POST", apiUrl);
        xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
        xhr.send(formData);
      });
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message);
        setImages([]);
        setUploadProgress(0);
        editor?.commands.setContent("");
        setVisibility(1);
        setSelectedInterests([]);
        queryClient.invalidateQueries({
          queryKey: ["/feed_management/public/feed/all/post"],
        });
        queryClient.invalidateQueries({
          queryKey: [`/feed_management/private/feeds/all/post/${userInfo.id}`],
        });
        queryClient.invalidateQueries({
          queryKey: ["/user/is-verified"],
        });
      } else {
        toast.error(data.message);
        setUploadProgress(0);
      }
    },
    onError: () => {
      toast.error("Failed to create post");
      setUploadProgress(0);
    },
  });

  const handleAddPost = () => {
    const description = editor?.getHTML();

    // Validation
    if (!description || description.trim() === "<p></p>" || description.trim() === "") {
      toast.error("Please enter some content for your post");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("interest", JSON.stringify(selectedInterests));
    formData.append("visibility_id", String(visibility)); // Convert to string

    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    createPostMutation.mutate(formData);
  };

  // Use for loading state
  const isLoading = createPostMutation.isPending;

  const visibilityOptions = [
    { id: 1, label: "Public" },
    { id: 2, label: "Friends" },
    { id: 3, label: "Private" },
  ];

  const currentVisibility = visibilityOptions.find((v) => v.id === visibility);

  return (
    <section className="p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 space-y-6 animate-fade-in mt-14 md:mt-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={userInfo?.user_image} />
            <AvatarFallback className="capitalize bg-linear-to-br from-secondary to-purple-600 text-white text-sm font-semibold">
              {userInfo?.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-lg">Create Post</h2>
            <p className="text-sm text-muted-foreground">
              Share something with your community
            </p>
          </div>
        </div>

        {/* Editor */}
        <EditorContent editor={editor} />

        {/* Media Preview (Images & Videos) */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 max-h-96 overflow-y-auto">
            {images.map((file, index) => {
              const fileType = getFileType(file);
              const objectUrl = URL.createObjectURL(file);

              return (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden border bg-muted/30"
                >
                  {fileType === "video" ? (
                    <video
                      src={objectUrl}
                      className="w-full h-56 bg-muted object-contain"
                      controls
                    />
                  ) : (
                    <img
                      src={objectUrl}
                      alt={`Selected media ${index + 1}`}
                      className="w-full h-56 bg-muted object-contain"
                    />
                  )}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {fileType === "video" && (
                      <div className="bg-black/60 text-white rounded px-2 py-1 text-xs flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        Video
                      </div>
                    )}
                  </div>
                  <button
                    className="cursor-pointer absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
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
                className="cursor-pointer py-1.5 px-4 "
                onClick={() => handleInterestClick(interest.id)}
              >
                {interest.name}
              </Badge>
            ))}
          </div>
        </div> */}

        {/* Footer Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Media Upload (Images & Videos) */}
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              id="imageUploadInput"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="imageUploadInput"
              className="cursor-pointer size-10 rounded-full border flex justify-center items-center hover:shadow"
              title="Upload images or videos"
            >
              <ImageIcon className="h-5 w-5" />
            </label>

            {/* Visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="cursor-pointer rounded-full px-4 py-1.5 border flex items-center hover:shadow">
                  <Globe className="h-5 w-5 mr-2" />
                  {currentVisibility.label}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="">
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

          {/* Submit */}
          <Button
            onClick={handleAddPost}
            disabled={isLoading}
            className="px-6 cursor-pointer bg-secondary/90 hover:bg-secondary"
          >
            {isLoading ? "Creating Post" : "Create Post"}
          </Button>
        </div>
      </div>
    </section>
  );
}
