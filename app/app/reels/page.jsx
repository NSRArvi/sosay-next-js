"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithToken } from "@/helpers/api";
import { useAppContext } from "@/context/context";
import { Play, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReelCard from "@/components/reels/ReelCard";
import UploadReelDialog from "@/components/reels/UploadReelDialog";

const BASE_URL = process.env.NEXT_PUBLIC_API_DEV_URL;

export default function ReelsPage() {
  const { accessToken } = useAppContext();
  const [activeTab, setActiveTab] = useState("reels");
  const [pageReels, setPageReels] = useState(1);
  const [pageMyReels, setPageMyReels] = useState(1);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  // Fetch all reels (public feed)
  const { data: reelsData, isLoading: reelsLoading } = useQuery({
    queryKey: ["/reels", accessToken, pageReels],
    queryFn: () =>
      fetchWithToken({
        queryKey: [`/reels?page=${pageReels}`, accessToken],
      }),
    enabled: !!accessToken,
    keepPreviousData: true,
  });

  // Fetch user's reels (my reels)
  const { data: myReelsData, isLoading: myReelsLoading } = useQuery({
    queryKey: ["/reels", accessToken, pageMyReels],
    queryFn: () =>
      fetchWithToken({
        queryKey: [`/reels${pageMyReels}`, accessToken],
      }),
    enabled: !!accessToken,
    keepPreviousData: true,
  });

  const reelsPayload = reelsData?.data;
  const reels = Array.isArray(reelsPayload)
    ? reelsPayload
    : Array.isArray(reelsPayload?.data)
      ? reelsPayload.data
      : [];
  const reelsPaginationData = Array.isArray(reelsPayload) ? null : reelsPayload;

  const myReelsPayload = myReelsData?.data;
  const myReels = Array.isArray(myReelsPayload)
    ? myReelsPayload
    : Array.isArray(myReelsPayload?.data)
      ? myReelsPayload.data
      : [];
  const myReelsPaginationData = Array.isArray(myReelsPayload) ? null : myReelsPayload;

  const handlePageChangeReels = (newPage) => {
    setPageReels(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChangeMyReels = (newPage) => {
    setPageMyReels(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="max-w-4xl mx-auto space-y-4 mt-14 md:mt-8 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reels</h1>
          <p className="text-sm text-gray-500 mt-1">
            Watch and share short video reels from your community
          </p>
        </div>
        <Button
          onClick={() => setOpenUploadDialog(true)}
          className="gap-2 bg-secondary hover:bg-secondary/90 cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload Reel</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="reels" className="cursor-pointer">Reels</TabsTrigger>
          <TabsTrigger value="my-reels" className="cursor-pointer">My Reels</TabsTrigger>
        </TabsList>

        {/* Reels Tab (Public Feed) */}
        <TabsContent value="reels" className="space-y-6">
          {reelsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-3/5 bg-gray-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : reels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Play className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No reels available</p>
              <p className="text-sm text-gray-400">
                Check back soon for community updates
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {reels.map((reel) => (
                  <ReelCard key={reel.id} reel={reel} />
                ))}
              </div>

              {/* Pagination */}
              {reelsPaginationData?.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChangeReels(pageReels - 1)}
                    disabled={pageReels === 1}
                    className="cursor-pointer"
                  >
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {Array.from(
                      { length: reelsPaginationData.last_page },
                      (_, i) => i + 1
                    ).map((p) => (
                      <Button
                        key={p}
                        variant={pageReels === p ? "default" : "outline"}
                        onClick={() => handlePageChangeReels(p)}
                        className="w-10 h-10 p-0 cursor-pointer"
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChangeReels(pageReels + 1)}
                    disabled={pageReels === reelsPaginationData.last_page}
                    className="cursor-pointer"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* My Reels Tab (User's Uploads) */}
        <TabsContent value="my-reels" className="space-y-6">
          {myReelsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-3/5 bg-gray-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : myReels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Play className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No reels uploaded yet</p>
              <p className="text-sm text-gray-400">
                Upload your first reel to get started
              </p>
              <Button
                onClick={() => setOpenUploadDialog(true)}
                className="mt-4 gap-2 cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                Upload Reel
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {myReels.map((reel) => (
                  <ReelCard key={reel.id} reel={reel} />
                ))}
              </div>

              {/* Pagination */}
              {myReelsPaginationData?.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChangeMyReels(pageMyReels - 1)}
                    disabled={pageMyReels === 1}
                    className="cursor-pointer"
                  >
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {Array.from(
                      { length: myReelsPaginationData.last_page },
                      (_, i) => i + 1
                    ).map((p) => (
                      <Button
                        key={p}
                        variant={pageMyReels === p ? "default" : "outline"}
                        onClick={() => handlePageChangeMyReels(p)}
                        className="w-10 h-10 p-0 cursor-pointer"
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChangeMyReels(pageMyReels + 1)}
                    disabled={pageMyReels === myReelsPaginationData.last_page}
                    className="cursor-pointer"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Upload Dialog (shared component) */}
      <UploadReelDialog
        open={openUploadDialog}
        onOpenChange={setOpenUploadDialog}
        accessToken={accessToken}
        onUploadSuccess={() => setActiveTab("my-reels")}
      />
    </section>
  );
}
