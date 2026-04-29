"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, ArrowUp, Check } from "lucide-react";
import Image from "next/image";

export default function ProfilePictureDialog({
  open,
  onOpenChange,
  profilePreview,
  profilePictures,
  profilePicturesLoading,
  isLoading,
  newProfileImage,
  onImageChange,
  onAddProfilePicture,
  onUpdateProfilePicture,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onChange={onImageChange}
            />
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <label htmlFor="profile-image" className="cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" /> Upload New
                </label>
              </Button>
              {newProfileImage && (
                <Button
                  onClick={onAddProfilePicture}
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
                        onClick={() => onUpdateProfilePicture(pp?.id)}
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
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
