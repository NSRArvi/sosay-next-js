"use client";

import React, { useCallback, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken } from "@/helpers/api";
import { useAppContext } from "@/context/context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Play } from "lucide-react";
import PublicReelsTab from "@/components/reels/PublicReelsTab";
import MyReelsTab from "@/components/reels/MyReelsTab";
import ReelsViewer from "@/components/reels/ReelsViewer";
import UploadReelDialog from "@/components/reels/UploadReelDialog";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_DEV_URL;

export default function ReelsPage() {
  const { accessToken } = useAppContext();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("reels");
  const [pageReels, setPageReels] = useState(1);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openViewer, setOpenViewer] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerReels, setViewerReels] = useState([]);
  const viewedInSessionRef = useRef(new Set());

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

  const reelsPayload = reelsData?.data;
  const reels = Array.isArray(reelsPayload)
    ? reelsPayload
    : Array.isArray(reelsPayload?.data)
      ? reelsPayload.data
      : [];
  const reelsPaginationData = Array.isArray(reelsPayload) ? null : reelsPayload;

  const handlePageChangeReels = (newPage) => {
    setPageReels(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const markReelView = useCallback(
    async (reelId) => {
      if (!accessToken || !reelId || viewedInSessionRef.current.has(reelId))
        return;

      viewedInSessionRef.current.add(reelId);
      try {
        await fetch(`${API_BASE_URL}/reels/${reelId}/view`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        queryClient.invalidateQueries({ queryKey: ["/reels"] });
        queryClient.invalidateQueries({ queryKey: ["/my-reels"] });
      } catch {
        // Silently ignore to keep viewer flow smooth.
      }
    },
    [accessToken, queryClient],
  );

  const openReelViewer = (list, index) => {
    setViewerReels(list);
    setViewerIndex(index);
    setOpenViewer(true);
    markReelView(list?.[index]?.id);
  };

  return (
    <section className="max-w-3xl mx-auto space-y-4 mt-14 md:mt-8 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Reels
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Watch and share short video reels from your community
          </p>
        </div>
        <Button
          onClick={() => setOpenUploadDialog(true)}
          className="gap-2 bg-secondary hover:bg-secondary/90 cursor-pointer rounded-full"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload Reel</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="gap-2 bg-transparent p-0 h-auto w-auto flex-wrap mb-6">
          <TabsTrigger
            value="reels"
            className="gap-2 rounded-full px-4 py-2 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-100 cursor-pointer"
          >
            <Play className="h-4 w-4" />
            <span>Reels</span>
          </TabsTrigger>
          <TabsTrigger
            value="my-reels"
            className="gap-2 rounded-full px-4 py-2 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-100 cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            <span>My Reels</span>
          </TabsTrigger>
        </TabsList>

        {/* Reels Tab (Public Feed) */}
        <TabsContent value="reels" className="space-y-6">
          <PublicReelsTab
            reels={reels}
            isLoading={reelsLoading}
            pageReels={pageReels}
            paginationData={reelsPaginationData}
            onPageChange={handlePageChangeReels}
            onReelClick={openReelViewer}
          />
        </TabsContent>

        {/* My Reels Tab (User's Uploads) */}
        <TabsContent value="my-reels" className="space-y-6">
          <MyReelsTab
            accessToken={accessToken}
            onReelClick={openReelViewer}
            onUploadClick={() => setOpenUploadDialog(true)}
          />
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      <UploadReelDialog
        open={openUploadDialog}
        onOpenChange={setOpenUploadDialog}
        accessToken={accessToken}
        onUploadSuccess={() => setActiveTab("my-reels")}
      />

      {/* Reels Viewer Modal */}
      <ReelsViewer
        open={openViewer}
        reels={viewerReels}
        initialIndex={viewerIndex}
        onClose={() => setOpenViewer(false)}
        onReelView={markReelView}
      />
    </section>
  );
}
