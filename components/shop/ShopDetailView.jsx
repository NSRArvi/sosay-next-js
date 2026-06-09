"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/context";
import { useRouter, useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowLeft,
  MapPin,
  Package,
  Tag,
  MessageCircle,
  LogIn,
  Share2,
  Globe,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Chatpanel from "@/components/message/Chatpanel";
import { ListingCard } from "@/components/shop/Listingcard";
import toast from "react-hot-toast";
import "swiper/css";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_DEV_URL;

const LANGUAGES = [
  { label: "Bengali", value: "bn" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "Arabic", value: "ar" },
  { label: "Hindi", value: "hi" },
  { label: "Chinese", value: "zh-CN" },
  { label: "Japanese", value: "ja" },
  { label: "German", value: "de" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Italian", value: "it" },
  { label: "Korean", value: "ko" },
];

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

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.innerText || div.textContent || "";
}

function chunkText(text, maxChars = 490) {
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > maxChars) {
      if (current) chunks.push(current.trim());
      if (sentence.length > maxChars) {
        const words = sentence.split(" ");
        let wordChunk = "";
        for (const word of words) {
          if ((wordChunk + " " + word).length > maxChars) {
            if (wordChunk) chunks.push(wordChunk.trim());
            wordChunk = word;
          } else {
            wordChunk += " " + word;
          }
        }
        if (wordChunk) chunks.push(wordChunk.trim());
        current = "";
      } else {
        current = sentence;
      }
    } else {
      current += sentence;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

async function translateChunk(chunk, targetLang) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|${targetLang}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.responseStatus !== 200) throw new Error("Translation failed");
  return data.responseData.translatedText;
}

async function translateText(text, targetLang) {
  const plainText = stripHtml(text);
  const chunks = chunkText(plainText);
  const results = await Promise.all(
    chunks.map((chunk) => translateChunk(chunk, targetLang)),
  );
  return results.join(" ");
}

async function fetchPublicDetail(slug) {
  const res = await fetch(`${BASE_URL}/marketplace/public/listings/${slug}`);
  if (!res.ok) {
    throw new Error("Failed to fetch listing");
  }
  return res.json();
}

function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col md:grid md:grid-cols-[1fr_1.2fr] md:gap-6">
      {/* Gallery Skeleton */}
      <div className="bg-gray-50 rounded-lg overflow-hidden space-y-3">
        <Skeleton className="h-64 md:h-80 w-full rounded-lg" />
        <div className="flex gap-2 px-3 pb-3 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-16 rounded-md shrink-0" />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-6 w-3/5" />
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
  const { accessToken, userInfo } = useAppContext();
  const slug = params?.slug;
  const swiperRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [receiver, setReceiver] = useState(null);
  const [openChatDialog, setOpenChatDialog] = useState(false);
  const [translatedContent, setTranslatedContent] = useState(null);
  const [translatedLang, setTranslatedLang] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: [`/marketplace/public/listings/${slug}`],
    queryFn: () => fetchPublicDetail(slug),
    enabled: !!slug,
  });

  const shopUrl = data?.shop_url;

  const item = data?.data;
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

  async function handleTranslate(e) {
    const lang = e.target.value;
    if (!lang) return;
    e.target.value = "";

    if (lang === translatedLang) {
      setTranslatedContent(null);
      setTranslatedLang(null);
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const result = await translateText(item?.description, lang);
      setTranslatedContent(result);
      setTranslatedLang(lang);
    } catch (err) {
      setError("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  }

  function handleShowOriginal() {
    setTranslatedContent(null);
    setTranslatedLang(null);
    setError(null);
  }

  const langLabel = LANGUAGES.find((l) => l.value === translatedLang)?.label;

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
        </div>
      </div>

      <div className="">
        {isLoading ? (
          <ProductDetailSkeleton />
        ) : isError || !item ? (
          <div className="flex flex-col items-center justify-center h-80 text-center px-6">
            <Package className="h-10 w-10 text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">Listing not found.</p>
          </div>
        ) : (
          <div className="flex flex-col md:grid md:grid-cols-[1fr_1.2fr] md:gap-6">
            {/* Gallery Section */}
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              {/* Main Image */}
              <div className="relative h-64 md:h-80 bg-gray-100">
                {images.length > 0 ? (
                  images.length > 1 ? (
                    <Swiper
                      className="h-full"
                      onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setActiveSlide(swiper.realIndex || 0);
                      }}
                      onSlideChange={(swiper) =>
                        setActiveSlide(swiper.realIndex)
                      }
                    >
                      {images.map((img, idx) => (
                        <SwiperSlide key={idx}>
                          <Image
                            src={img.image_path}
                            alt={item.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <Image
                      src={images[0].image_path}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                    <Package className="h-12 w-12 mb-1" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery - visible on md+ */}
              {images.length > 1 && (
                <div className="hidden md:flex flex-wrap gap-2 p-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => swiperRef.current?.slideTo(idx)}
                      className={`relative h-20 w-20 rounded-md border-2 overflow-hidden transition-all shrink-0 ${
                        idx === activeSlide
                          ? "border-secondary"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <Image
                        src={img.image_path}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-5 sm:p-6 md:p-0 space-y-4">
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
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {translatedContent || item.description}
                  </p>

                  <div className="flex items-center gap-3 flex-wrap">
                    {isTranslating ? (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <svg
                          className="animate-spin h-3 w-3"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Translating...
                      </span>
                    ) : (
                      <select
                        onChange={handleTranslate}
                        defaultValue=""
                        className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-gray-50 cursor-pointer"
                      >
                        <option value="" disabled>
                          🌐 Translate
                        </option>
                        {LANGUAGES.map((l) => (
                          <option key={l.value} value={l.value}>
                            {l.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {translatedLang && !isTranslating && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        Translated · {langLabel} ·{" "}
                        <button
                          onClick={handleShowOriginal}
                          className="underline hover:text-gray-600"
                        >
                          See original
                        </button>
                      </span>
                    )}
                  </div>

                  {error && (
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {item.location && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                )}

                {item.country && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Globe className="h-4 w-4 shrink-0" />
                    <span>{item.country.name}</span>
                  </div>
                )}

                {item.category && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Tag className="h-4 w-4 shrink-0" />
                    <span>{item.category.name}</span>
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
                  <p className="text-sm font-semibold text-gray-700">
                    {item.user?.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-400">Seller</p>
                    {shopUrl && (
                      <Link
                        href={shopUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 rounded-xl text-white bg-secondary"
                      >
                        Visit Store
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {accessToken ? (
                <>
                  {item?.user_id !== userInfo?.id && (
                    <>
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
                    </>
                  )}
                </>
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
            <Chatpanel
              receiver={receiver}
              setShowChatPanel={setOpenChatDialog}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Related Items Section */}
      {data?.related_items && data.related_items.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.related_items.map((relatedItem) => (
              <div
                key={relatedItem.id}
                onClick={() => router.push(`/shop/${relatedItem.id}`)}
                className="cursor-pointer"
              >
                <ListingCard item={relatedItem} onSelect={() => {}} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
