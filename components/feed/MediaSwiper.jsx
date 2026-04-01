import { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

function FullscreenGallery({ open, onOpenChange, slides, initialIndex }) {
  const [loadedSlides, setLoadedSlides] = useState({});
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

  return (
    <Lightbox
      key={`${open}-${initialIndex}-${slides.length}`}
      open={open}
      close={() => onOpenChange(false)}
      slides={slides}
      index={currentIndex}
      carousel={{ preload: 6 }}
      controller={{ closeOnBackdropClick: true }}
      on={{
        view: ({ index }) => setCurrentIndex(index),
      }}
      render={{
        slide: ({ slide }) => {
          const slideKey = slide.src;
          const isLoaded = loadedSlides[slideKey];

          return (
            <div className="relative h-full w-full flex items-center justify-center bg-black">
              {!isLoaded && <div className="absolute inset-0 animate-pulse bg-white/10" />}
              <div className="relative h-full w-full">
                <Image
                  src={slide.src}
                  alt={slide.alt || "Gallery image"}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                  onLoad={() =>
                    setLoadedSlides((prev) => ({ ...prev, [slideKey]: true }))
                  }
                  onError={() =>
                    setLoadedSlides((prev) => ({ ...prev, [slideKey]: true }))
                  }
                />
              </div>
              {slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-black/60 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
                  {currentIndex + 1} / {slides.length}
                </div>
              )}
            </div>
          );
        },
      }}
      styles={{
        container: { backgroundColor: "rgba(0,0,0,0.95)" },
      }}
    />
  );
}

export default function MediaSwiper({ media, postId }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const imageMedia = useMemo(
    () => (Array.isArray(media) ? media.filter((item) => item.file_type === 1) : []),
    [media]
  );

  if (!media || media.length === 0) return null;

  const lightboxSlides = imageMedia.map((img, idx) => ({
    src: img.file_name,
    alt: `Image ${idx + 1}`,
  }));

  const openLightbox = (imageUrl) => {
    const index = imageMedia.findIndex((item) => item.file_name === imageUrl);
    setLightboxIndex(index >= 0 ? index : 0);
    setLightboxOpen(true);
  };

  // Single media - no slider needed
  if (media.length === 1) {
    const item = media[0];
    return (
      <>
        <div className="w-full mb-4 -mx-3 sm:mx-0">
          {item.file_type === 1 ? (
            <button
              type="button"
              onClick={() => openLightbox(item.file_name)}
              className="relative w-full h-[280px] xs:h-[320px] sm:h-[380px] md:h-[450px] lg:h-[500px] overflow-hidden sm:rounded-xl bg-gray-100 cursor-zoom-in"
            >
              <Image
                src={item.file_name}
                alt="Post media"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 600px"
                priority
              />
            </button>
          ) : (
            <video
              src={item.file_name}
              controls
              className="w-full h-auto max-h-[280px] xs:max-h-[320px] sm:max-h-[380px] md:max-h-[450px] lg:max-h-[500px] sm:rounded-xl bg-black"
              playsInline
            />
          )}
        </div>

        <FullscreenGallery
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          slides={lightboxSlides}
          initialIndex={lightboxIndex}
        />
      </>
    );
  }

  // Multiple media - use Swiper
  return (
    <div className="relative mb-4 -mx-3 sm:mx-0 overflow-hidden sm:rounded-xl group bg-gray-100">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: `.swiper-button-next-${postId}`,
          prevEl: `.swiper-button-prev-${postId}`,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        spaceBetween={0}
        className="w-full"
        style={{
          "--swiper-pagination-color": "#5f65de",
          "--swiper-pagination-bullet-inactive-color": "#cbd5e1",
          "--swiper-pagination-bullet-inactive-opacity": "1",
        }}
      >
        {media.map((item, idx) => (
          <SwiperSlide key={idx}>
            {item.file_type === 1 ? (
              <button
                type="button"
                onClick={() => openLightbox(item.file_name)}
                className="relative w-full h-[280px] xs:h-[320px] sm:h-[380px] md:h-[450px] lg:h-[500px] overflow-hidden bg-gray-100 flex items-center justify-center cursor-zoom-in"
              >
                <Image
                  src={item.file_name}
                  alt={`Post media ${idx + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 600px"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </button>
            ) : (
              <div className="w-full h-[280px] xs:h-[320px] sm:h-[380px] md:h-[450px] lg:h-[500px] flex items-center justify-center bg-black">
                <video
                  src={item.file_name}
                  controls
                  className="w-full h-full max-h-full object-contain"
                  playsInline
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons - Hidden on mobile */}
      <button
        className={`cursor-pointer swiper-button-prev-${postId} absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        className={`cursor-pointer swiper-button-next-${postId} absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block`}
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <FullscreenGallery
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        slides={lightboxSlides}
        initialIndex={lightboxIndex}
      />
    </div>
  );
}