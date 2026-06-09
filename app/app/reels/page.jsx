"use client";

import React, { useCallback, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken } from "@/helpers/api";
import { useAppContext } from "@/context/context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Play, Users, Wallet } from "lucide-react";
import PublicReelsTab from "@/components/reels/PublicReelsTab";
import MyReelsTab from "@/components/reels/MyReelsTab";
import ReelsViewer from "@/components/reels/ReelsViewer";
import UploadReelDialog from "@/components/reels/UploadReelDialog";
import FansTab from "@/components/reels/FansTab";
import WalletTab from "@/components/reels/WalletTab";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_DEV_URL;

export default function ReelsPage() {
  const { accessToken } = useAppContext();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("reels");
  const [pageReels, setPageReels] = useState(1);
  const [pageMyReels, setPageMyReels] = useState(1);
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

  // Fetch user's reels (my reels)
  const { data: myReelsData, isLoading: myReelsLoading } = useQuery({
    queryKey: ["/my-reels", accessToken, pageMyReels],
    queryFn: () =>
      fetchWithToken({
        queryKey: [`/my-reels?page=${pageMyReels}`, accessToken],
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
  const myReelsPaginationData = Array.isArray(myReelsPayload)
    ? null
    : myReelsPayload;

  const handlePageChangeReels = (newPage) => {
    setPageReels(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChangeMyReels = (newPage) => {
    setPageMyReels(newPage);
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
    [accessToken, queryClient]
  );

  const openReelViewer = (list, index) => {
    setViewerReels(list);
    setViewerIndex(index);
    setOpenViewer(true);
    markReelView(list?.[index]?.id);
  };

  const handleReelDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["/my-reels"] });
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
          className="gap-2 bg-secondary hover:bg-secondary/90 cursor-pointer"
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
          {/* <TabsTrigger
            value="fans"
            className="gap-2 rounded-full px-4 py-2 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900 data-[state=active]:text-pink-700 dark:data-[state=active]:text-pink-100 cursor-pointer"
          >
            <Users className="h-4 w-4" />
            <span>Fans</span>
          </TabsTrigger>
          <TabsTrigger
            value="wallet"
            className="gap-2 rounded-full px-4 py-2 data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-100 cursor-pointer"
          >
            <Wallet className="h-4 w-4" />
            <span>Wallet</span>
          </TabsTrigger> */}
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
            reels={myReels}
            isLoading={myReelsLoading}
            pageMyReels={pageMyReels}
            paginationData={myReelsPaginationData}
            onPageChange={handlePageChangeMyReels}
            onReelClick={openReelViewer}
            accessToken={accessToken}
            onReelDeleted={handleReelDeleted}
            onUploadClick={() => setOpenUploadDialog(true)}
          />
        </TabsContent>

        {/* Fans Tab */}
        <TabsContent value="fans" className="space-y-6">
          <FansTab
            fans={[
              // Sample data - replace with actual API data
              {
                id: 1,
                name: "John Doe",
                profileImage: "/images/profile-1.jpg",
                subscribedDate: "2024-01-15",
                isPremium: true,
              },
            ]}
            stats={{
              totalFans: 1250,
              premiumSubscribers: 340,
              newThisMonth: 89,
            }}
          />
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="space-y-6">
          <WalletTab
            wallet={{
              availableBalance: 2450.5,
              pendingPayout: 150.25,
              nextPayout: "2024-06-15",
            }}
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
