"use client";

import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/context";
import { useRouter, useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Package,
  Tag,
  MessageCircle,
  LogIn,
  Share2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Chatpanel from "@/components/message/Chatpanel";
import toast from "react-hot-toast";
import "swiper/css";

const BASE_URL = process.env.NEXT_PUBLIC_API_DEV_URL;

const CONDITION_STYLES = {
  new: "bg-emerald-50 text-emerald-700 border-emerald-200",
  used_like_new: "bg-blue-50 text-blue-700 border-blue-200",
  used_good: "bg-amber-50 text-amber-700 border-amber-200",
  used_fair: "bg-orange-50 text-orange-700 border-orange-200",
  used_poor: "bg-red-50 text-red-700 border-red-200",
};

const CONDITION_LABELS = {
  new: "New",
  used_like_new: "Like New",
  used_good: "Good",
  used_fair: "Fair",
  used_poor: "Poor",
};

async function fetchPublicDetail(slug) {
  const res = await fetch(`${BASE_URL}/marketplace/public/listings/${slug}`);
  if (!res.ok) {
    throw new Error("Failed to fetch listing");
  }
  return res.json();
}

function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-2/5 shrink-0 bg-gray-50 p-3">
        <Skeleton className="h-64 md:h-120 w-full rounded-xl" />
        <div className="mt-3 flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-2 w-14 rounded-full" />
          <Skeleton className="h-2 w-8 rounded-full" />
          <Skeleton className="h-2 w-10 rounded-full" />
        </div>
      </div>

      <div className="flex-1 p-5 sm:p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 w-full">
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-6 w-3/5" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <Skeleton className="h-9 w-40" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[72%]" />
        </div>

        <div className="space-y-3 pt-1">
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-44" />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  );
}

export default function ShopDetailView() {
  const router = useRouter();
  const params = useParams();
  const { accessToken } = useAppContext();
  const slug = params?.slug;
  const swiperRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [receiver, setReceiver] = useState(null);
  const [openChatDialog, setOpenChatDialog] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: [`/marketplace/public/listings/${slug}`],
    queryFn: () => fetchPublicDetail(slug),
    enabled: !!slug,
  });

  const item = data?.data;
  console.log("item:", item);
  
  const images = item?.images || [];
  const conditionStyle =
    CONDITION_STYLES[item?.condition] || CONDITION_STYLES.used_fair;
  const conditionLabel = CONDITION_LABELS[item?.condition] || item?.condition;

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (!shareUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: item?.title || "Listing",
          text: item?.title || "Check this listing",
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Unable to share right now");
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-24 pb-12 min-h-screen">
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:text-secondary hover:border-secondary/40 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:text-secondary hover:border-secondary/40 transition"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
          {item?.category && (
            <Badge variant="outline" className="rounded-full border-gray-200 text-gray-600">
              {item.category}
            </Badge>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <ProductDetailSkeleton />
        ) : isError || !item ? (
          <div className="flex flex-col items-center justify-center h-80 text-center px-6">
            <Package className="h-10 w-10 text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">Listing not found.</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            <div className="bg-gray-50 md:w-2/5 shrink-0">
              <div className="relative h-64 md:h-full min-h-64 bg-gray-100">
                {images.length > 1 ? (
                  <>
                    <Swiper
                      className="h-full"
                      onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setActiveSlide(swiper.realIndex || 0);
                      }}
                      onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
                    >
                      {images.map((img, idx) => (
                        <SwiperSlide key={idx}>
                          <img
                            src={img.image_path}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    <button
                      type="button"
                      onClick={() => swiperRef.current?.slidePrev()}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full border border-white/60 bg-white/85 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-secondary transition flex items-center justify-center"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => swiperRef.current?.slideNext()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full border border-white/60 bg-white/85 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-secondary transition flex items-center justify-center"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <div className="absolute top-3 right-3 z-10 rounded-full bg-black/55 text-white text-[11px] font-medium px-2.5 py-1">
                      {activeSlide + 1}/{images.length}
                    </div>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-full bg-black/35 px-2 py-1.5">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => swiperRef.current?.slideTo(idx)}
                          className={`h-1.5 rounded-full transition-all ${
                            idx === activeSlide
                              ? "w-5 bg-secondary"
                              : "w-1.5 bg-white/90 hover:bg-white"
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                ) : images.length === 1 ? (
                  <img
                    src={images[0].image_path}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                    <Package className="h-12 w-12 mb-1" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 p-5 sm:p-6 space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-snug">
                  {item.title}
                </h1>
                <Badge
                  className={`capitalize text-xs border shrink-0 w-fit mt-0.5 ${conditionStyle}`}
                  variant="outline"
                >
                  {conditionLabel}
                </Badge>
              </div>

              <p className="text-2xl sm:text-3xl font-extrabold text-secondary">
                {item.currency} {parseFloat(item.price).toLocaleString()}
              </p>

              {item.description && (
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              )}

              <div className="space-y-2">
                {item.location && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                )}
                {item.category && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Tag className="h-4 w-4 shrink-0" />
                    <span>{item.category}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={item.user?.profile_picture} />
                  <AvatarFallback className="text-sm bg-secondary/10 text-secondary capitalize">
                    {item.user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{item.user?.name}</p>
                  <p className="text-xs text-gray-400">Seller</p>
                </div>
              </div>

              {accessToken ? (
                <Button
                  onClick={() => {
                    setOpenChatDialog(true);
                    setReceiver(item.user);
                  }}
                  className="w-full bg-secondary hover:bg-secondary/90 rounded-full gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact Seller
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/register")}
                  className="w-full bg-secondary hover:bg-secondary/90 rounded-full gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In to Contact Seller
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={openChatDialog} onOpenChange={setOpenChatDialog}>
        <DialogContent className="h-dvh w-screen max-w-none rounded-none border-0 p-0 sm:h-[92dvh] sm:w-[96vw] sm:rounded-xl sm:border sm:max-w-4xl">
          <DialogTitle className="sr-only">Chat</DialogTitle>
          <div className="h-full overflow-hidden">
            <Chatpanel receiver={receiver} setShowChatPanel={setOpenChatDialog} />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
