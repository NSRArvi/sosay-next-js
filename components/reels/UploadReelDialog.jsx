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

const MAX_DURATION = 20; // seconds
const COMMAND_MAX_SIZE = 20 * 1024 * 1024; // 20MB
const UPLOAD_TOAST_ID = "reel-upload-task";

export default function UploadReelDialog({
  open,
  onOpenChange,
  accessToken,
  onUploadSuccess,
}) {
  const queryClient = useQueryClient();
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [videoDuration, setVideoDuration] = useState(0);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const videoInputRef = useRef(null);

  const handleVideoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    setVideoFile(file);

    // Get video duration
    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = videoUrl;
    video.onloadedmetadata = () => {
      setVideoDuration(video.duration);
      if (video.duration > MAX_DURATION) {
        toast.error(`Video must be ${MAX_DURATION} seconds or less`);
        setVideoFile(null);
        setVideoPreview("");
        return;
      }
      setVideoPreview(videoUrl);
    };
  };

  const compressVideo = async (file) => {
    if (file.size > COMMAND_MAX_SIZE) {
      toast.error("Video file too large. Please use a shorter or lower quality video.");
      return null;
    }
    return file;
  };

  const uploadVideoInBackground = async (formData) => {
    try {
      setIsUploading(true);
      const response = await postWithToken("/reels", formData, accessToken);
      const isSuccess = response?.status === true || response?.success === true;

      if (isSuccess) {
        toast.success(response?.message || "Video uploaded successfully!", {
          id: UPLOAD_TOAST_ID,
        });
        // Invalidate reels queries to refresh feeds
        queryClient.invalidateQueries(["/reels"]);
        queryClient.invalidateQueries(["/reels/my"]);
        // Reset form
        resetForm();
        onOpenChange(false);
        onUploadSuccess?.();
      } else {
        toast.error(response?.message || "Failed to upload video", {
          id: UPLOAD_TOAST_ID,
        });
      }
    } catch (error) {
      toast.error("Error uploading video", { id: UPLOAD_TOAST_ID });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setVideoFile(null);
    setVideoPreview("");
    setCaption("");
    setVideoDuration(0);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!videoFile) {
      toast.error("Please select a video");
      return;
    }
    if (videoDuration > MAX_DURATION) {
      toast.error(`Video must be ${MAX_DURATION} seconds or less`);
      return;
    }

    const compressed = await compressVideo(videoFile);
    if (!compressed) return;

    const formData = new FormData();
    formData.append("video", compressed);
    formData.append("caption", caption || "");

    // Start background upload
    toast.loading("Uploading video...", { id: UPLOAD_TOAST_ID });
    uploadVideoInBackground(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Reel</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Video Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Video (Max {MAX_DURATION}s)
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

          {/* Video Preview */}
          {videoPreview && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video
                  src={videoPreview}
                  className="w-full h-40 object-cover"
                  controls
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {Math.round(videoDuration)}s
                </div>
              </div>
            </div>
          )}

          {/* Caption */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Caption (Optional)
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's on your mind?"
              disabled={isUploading}
              maxLength={200}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:opacity-50"
            />
            <p className="text-xs text-gray-400 mt-1">
              {caption.length}/200
            </p>
          </div>

          {/* Info Box */}
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
            disabled={!videoFile || isUploading || videoDuration > MAX_DURATION}
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
