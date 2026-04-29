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
import { Loader2, Camera, ArrowUp, Check } from "lucide-react";
import Image from "next/image";

export default function CoverPictureDialog({
  open,
  onOpenChange,
  coverPreview,
  coverPictures,
  coverPicturesLoading,
  isLoading,
  newCoverImage,
  onImageChange,
  onAddCoverPicture,
  onUpdateCoverPicture,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                onChange={onImageChange}
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
                    onClick={onAddCoverPicture}
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
                        onClick={() => onUpdateCoverPicture(cp?.id)}
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
