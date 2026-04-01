"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken } from "@/helpers/api";
import { useAppContext } from "@/context/context";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Heart,
  MessageCircle,
  Pause,
  Play,
  Send,
  Upload,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReelCard from "@/components/reels/ReelCard";
import UploadReelDialog from "@/components/reels/UploadReelDialog";
import ReelCardSkleton from "@/components/reels/ReelCardSkleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";

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
  const [viewerMuted, setViewerMuted] = useState(false);
  const [viewerProgress, setViewerProgress] = useState(0);
  const [viewerPaused, setViewerPaused] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const viewedInSessionRef = useRef(new Set());
  const viewerSwiperRef = useRef(null);
  const reelVideoRefs = useRef({});
  const hasShownSwipeHintRef = useRef(false);

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

  const markReelView = useCallback(async (reelId) => {
    if (!accessToken || !reelId || viewedInSessionRef.current.has(reelId)) return;

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
  }, [accessToken, queryClient]);

  const openReelViewer = (list, index) => {
    setViewerReels(list);
    setViewerIndex(index);
    setViewerMuted(false);
    setViewerProgress(0);
    if (!hasShownSwipeHintRef.current) {
      setShowSwipeHint(true);
      hasShownSwipeHintRef.current = true;
    }
    setOpenViewer(true);
    markReelView(list?.[index]?.id);
  };

  const reelSlides = viewerReels.map((reel) => ({
    src: reel.video_url,
    reel,
  }));

  useEffect(() => {
    if (!openViewer) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const hintTimer = window.setTimeout(() => {
      setShowSwipeHint(false);
    }, 2000);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.clearTimeout(hintTimer);
    };
  }, [openViewer]);

  const pauseAllReelVideos = useCallback(() => {
    Object.values(reelVideoRefs.current).forEach((videoEl) => {
      if (!videoEl) return;
      videoEl.pause();
      videoEl.currentTime = 0;
      videoEl.muted = true;
    });
  }, []);

  const syncActiveVideoPlayback = useCallback(
    (activeIndex) => {
      Object.entries(reelVideoRefs.current).forEach(([idx, videoEl]) => {
        if (!videoEl) return;
        const isActive = Number(idx) === activeIndex;

        if (isActive) {
          videoEl.currentTime = 0;
          videoEl.muted = viewerMuted;
          const playPromise = videoEl.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {});
          }
          return;
        }

        videoEl.pause();
        videoEl.currentTime = 0;
        videoEl.muted = true;
      });
    },
    [viewerMuted],
  );

  const handleViewerClose = () => {
    pauseAllReelVideos();
    setOpenViewer(false);
    setViewerProgress(0);
    setViewerPaused(false);
    setShowSwipeHint(false);
    reelVideoRefs.current = {};
  };

  const handleSlideChange = (index) => {
    setViewerIndex(index);
    setViewerProgress(0);
    setViewerPaused(false);
    markReelView(viewerReels[index]?.id);
    syncActiveVideoPlayback(index);
  };

  const handleToggleMute = () => {
    setViewerMuted((prev) => {
      const nextMuted = !prev;
      const activeVideo = reelVideoRefs.current[viewerIndex];
      if (activeVideo) activeVideo.muted = nextMuted;
      return nextMuted;
    });
  };

  const goToNextReel = () => {
    const swiper = viewerSwiperRef.current;
    if (!swiper || viewerIndex >= viewerReels.length - 1) return;
    swiper.slideNext();
  };

  const goToPrevReel = () => {
    const swiper = viewerSwiperRef.current;
    if (!swiper || viewerIndex <= 0) return;
    swiper.slidePrev();
  };

  const toggleActiveVideoPlay = () => {
    const activeVideo = reelVideoRefs.current[viewerIndex];
    if (!activeVideo) return;

    if (activeVideo.paused) {
      const playPromise = activeVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
      setViewerPaused(false);
      return;
    }

    activeVideo.pause();
    setViewerPaused(true);
  };

  return (
    <section className="max-w-4xl mx-auto space-y-4 mt-14 md:mt-8 p-4">
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
        <TabsList>
          <TabsTrigger value="reels" className="cursor-pointer">
            Reels
          </TabsTrigger>
          <TabsTrigger value="my-reels" className="cursor-pointer">
            My Reels
          </TabsTrigger>
        </TabsList>

        {/* Reels Tab (Public Feed) */}
        <TabsContent value="reels" className="space-y-6">
          {reelsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <ReelCardSkleton key={i} />
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
                {reels.map((reel, index) => (
                  <ReelCard
                    key={reel.id}
                    reel={reel}
                    onView={() => openReelViewer(reels, index)}
                  />
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
                      (_, i) => i + 1,
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
                <ReelCardSkleton key={i} />
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
                {myReels.map((reel, index) => (
                  <ReelCard
                    key={reel.id}
                    reel={reel}
                    onView={() => openReelViewer(myReels, index)}
                  />
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
                      (_, i) => i + 1,
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

      {openViewer ? (
        <div className="fixed inset-0 z-110 bg-black">
          <button
            type="button"
            onClick={handleViewerClose}
            className="absolute top-4 right-4 z-30 bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
            aria-label="Close reels viewer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute top-0 left-0 w-full h-1.5 bg-white/20 z-20">
            <div
              className="h-full bg-white transition-[width] duration-150"
              style={{ width: `${viewerProgress}%` }}
            />
          </div>

          <Swiper
            modules={[Mousewheel, Keyboard]}
            direction="vertical"
            mousewheel={{ forceToAxis: true }}
            keyboard={{ enabled: true }}
            allowTouchMove
            simulateTouch
            touchStartPreventDefault={false}
            touchReleaseOnEdges
            resistanceRatio={0.7}
            threshold={6}
            grabCursor
            initialSlide={viewerIndex}
            slidesPerView={1}
            speed={320}
            onSwiper={(swiper) => {
              viewerSwiperRef.current = swiper;
              handleSlideChange(swiper.activeIndex);
            }}
            onSlideChange={(swiper) => handleSlideChange(swiper.activeIndex)}
            className="h-full w-full"
          >
            {reelSlides.map((slide, idx) => (
              <SwiperSlide key={slide.reel?.id || `${slide.src}-${idx}`}>
                <div className="relative h-screen w-full bg-black flex items-center justify-center">
                  <video
                    ref={(el) => {
                      if (el) {
                        reelVideoRefs.current[idx] = el;
                      } else {
                        delete reelVideoRefs.current[idx];
                      }
                    }}
                    src={slide.src}
                    className="h-full w-full object-contain"
                    loop
                    controls={idx === viewerIndex}
                    controlsList="nodownload noplaybackrate noremoteplayback"
                    disablePictureInPicture
                    muted={idx === viewerIndex ? viewerMuted : true}
                    playsInline
                    preload={idx === viewerIndex ? "auto" : "metadata"}
                    style={{ touchAction: "pan-y" }}
                    onContextMenu={(e) => e.preventDefault()}
                    onLoadedMetadata={(e) => {
                      if (idx !== viewerIndex) return;
                      e.currentTarget.currentTime = 0;
                      e.currentTarget.muted = viewerMuted;
                      const playPromise = e.currentTarget.play();
                      if (playPromise && typeof playPromise.catch === "function") {
                        playPromise.catch(() => {});
                      }
                    }}
                    onPlay={() => {
                      if (idx !== viewerIndex) return;
                      setViewerPaused(false);
                    }}
                    onPause={() => {
                      if (idx !== viewerIndex) return;
                      setViewerPaused(true);
                    }}
                    onTimeUpdate={(e) => {
                      if (idx !== viewerIndex) return;
                      const { currentTime, duration } = e.currentTarget;
                      if (!duration) return;
                      setViewerProgress((currentTime / duration) * 100);
                    }}
                    onEnded={() => {
                      const swiper = viewerSwiperRef.current;
                      if (!swiper) return;
                      if (idx < viewerReels.length - 1) {
                        swiper.slideTo(idx + 1);
                      }
                    }}
                  />

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={goToPrevReel}
                      disabled={viewerIndex === 0}
                      className="bg-black/60 hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full p-2.5"
                      aria-label="Previous reel"
                    >
                      <ChevronUp className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={goToNextReel}
                      disabled={viewerIndex === viewerReels.length - 1}
                      className="bg-black/60 hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full p-2.5"
                      aria-label="Next reel"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </button>
                  </div>

                  {showSwipeHint ? (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 bg-black/70 text-white text-xs sm:text-sm px-3 py-1.5 rounded-full pointer-events-none">
                      Swipe up or down to browse reels
                    </div>
                  ) : null}

                  <div className="absolute bottom-8 right-4 z-20 flex flex-col items-center gap-4 text-white">
                    <button
                      type="button"
                      onClick={toggleActiveVideoPlay}
                      className="bg-black/60 hover:bg-black/80 rounded-full p-2.5"
                      aria-label={viewerPaused ? "Play reel" : "Pause reel"}
                    >
                      {viewerPaused ? (
                        <Play className="h-5 w-5" />
                      ) : (
                        <Pause className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleMute}
                      className="bg-black/60 hover:bg-black/80 rounded-full p-2.5"
                      aria-label="Toggle sound"
                    >
                      {viewerMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      type="button"
                      className="bg-black/60 rounded-full p-2.5"
                      aria-label="Like reel"
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="bg-black/60 rounded-full p-2.5"
                      aria-label="Comment on reel"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="bg-black/60 rounded-full p-2.5"
                      aria-label="Share reel"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="bg-black/60 rounded-full p-2.5"
                      aria-label="Save reel"
                    >
                      <Bookmark className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="absolute bottom-8 left-4 right-20 z-20 text-white">
                    <p className="text-sm font-semibold">
                      {slide.reel?.user?.name || "Reel"}
                    </p>
                    {slide.reel?.caption ? (
                      <p className="text-sm text-white/90 mt-2 line-clamp-3">
                        {slide.reel.caption}
                      </p>
                    ) : null}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : null}
    </section>
  );
}
