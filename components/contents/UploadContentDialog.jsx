"use client";

import React, { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { postWithToken } from "@/helpers/api";
import toast from "react-hot-toast";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const MAX_DURATION = 120; // let's say 2 mins for content, or whatever is reasonable
const COMMAND_MAX_SIZE = 100 * 1024 * 1024; // 100MB for content
const UPLOAD_TOAST_ID = "content-upload-task";

export default function UploadContentDialog({
  open,
  onOpenChange,
  accessToken,
  onUploadSuccess,
}) {
  const queryClient = useQueryClient();
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const videoInputRef = useRef(null);

  const handleVideoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    setVideoFile(file);

    const videoUrl = URL.createObjectURL(file);
    setVideoPreview(videoUrl);
  };

  const uploadVideoInBackground = async (formData) => {
    try {
      const response = await postWithToken("/contents", formData, accessToken);
      const isSuccess = response?.status === true || response?.success === true;

      if (isSuccess) {
        toast.success(response?.message || "Content uploaded successfully!", {
          id: UPLOAD_TOAST_ID,
        });
        queryClient.invalidateQueries(["/contents/me"]);
        onUploadSuccess?.();
      } else {
        toast.error(response?.message || "Failed to upload content", {
          id: UPLOAD_TOAST_ID,
        });
      }
    } catch (error) {
      toast.error("Error uploading content", { id: UPLOAD_TOAST_ID });
      console.error(error);
    }
  };

  const resetForm = () => {
    setVideoFile(null);
    setVideoPreview("");
    setTitle("");
    setDescription("");
    setIsPremium(false);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!videoFile) {
      toast.error("Please select a video");
      return;
    }
    if (videoFile.size > COMMAND_MAX_SIZE) {
      toast.error("Video file too large. Max size is 100MB.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    if (title) formData.append("title", title);
    if (description) formData.append("description", description);
    formData.append("is_premium", isPremium ? "1" : "0");

    toast.loading("Uploading content...", { id: UPLOAD_TOAST_ID });
    uploadVideoInBackground(formData);
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Content</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Video
            </label>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoSelect}
              disabled={isUploading}
              className="block w-full text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-secondary/10 file:text-secondary file:font-medium disabled:opacity-50"
            />
          </div>

          {videoPreview && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
              <div className="relative w-full max-w-[320px] mx-auto rounded-xl overflow-hidden bg-black border border-gray-800 aspect-video">
                <video
                  src={videoPreview}
                  className="w-full h-full object-contain"
                  controls
                  playsInline
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Content title"
              disabled={isUploading}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this content about?"
              disabled={isUploading}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:opacity-50"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_premium"
              checked={isPremium}
              onCheckedChange={setIsPremium}
              disabled={isUploading}
            />
            <label
              htmlFor="is_premium"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Premium Content
            </label>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800">
            Upload will continue in the background. You can navigate away and will be notified when complete.
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!videoFile || isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
