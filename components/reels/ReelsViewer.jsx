"use client";

import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Mousewheel } from "swiper/modules";
import {
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  X,
} from "lucide-react";
import "swiper/css";

export default function ReelsViewer({
  open,
  reels,
  initialIndex,
  onClose,
  onReelView,
}) {
  const viewerSwiperRef = useRef(null);
  const reelVideoRefs = useRef({});
  const [viewerIndex, setViewerIndex] = React.useState(initialIndex);
  const [viewerMuted, setViewerMuted] = React.useState(false);
  const [viewerProgress, setViewerProgress] = React.useState(0);
  const [viewerPaused, setViewerPaused] = React.useState(false);
  const [showSwipeHint, setShowSwipeHint] = React.useState(false);
  const hasShownSwipeHintRef = useRef(false);

  useEffect(() => {
    if (!open) {
      hasShownSwipeHintRef.current = false;
      return;
    }

    if (!hasShownSwipeHintRef.current) {
      setShowSwipeHint(true);
      hasShownSwipeHintRef.current = true;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const hintTimer = window.setTimeout(() => {
      setShowSwipeHint(false);
    }, 2000);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.clearTimeout(hintTimer);
    };
  }, [open]);

  const pauseAllReelVideos = React.useCallback(() => {
    Object.values(reelVideoRefs.current).forEach((videoEl) => {
      if (!videoEl) return;
      videoEl.pause();
      videoEl.currentTime = 0;
      videoEl.muted = true;
    });
  }, []);

  const syncActiveVideoPlayback = React.useCallback(
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
    onClose();
    setViewerProgress(0);
    setViewerPaused(false);
    setShowSwipeHint(false);
    reelVideoRefs.current = {};
  };

  const handleSlideChange = (index) => {
    setViewerIndex(index);
    setViewerProgress(0);
    setViewerPaused(false);
    onReelView?.(reels[index]?.id);
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
    if (!swiper || viewerIndex >= reels.length - 1) return;
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

  if (!open) return null;

  const reelSlides = reels.map((reel) => ({
    src: reel.video_url,
    reel,
  }));

  return (
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
                  if (idx < reels.length - 1) {
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
                  disabled={viewerIndex === reels.length - 1}
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
  );
}
