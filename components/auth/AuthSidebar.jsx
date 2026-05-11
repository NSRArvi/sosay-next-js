import {
  Heart,
  MessageCircle,
  Video,
  MessageSquare,
  ShoppingBag,
  Store,
  CreditCard,
  Package,
  Megaphone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const SOCIAL_FEATURES = [
  {
    icon: <Heart className="w-3.5 h-3.5" />,
    title: "Posts & reactions",
    desc: "Share content and engage with community reactions",
    color: "bg-pink-50 text-pink-500",
  },
  {
    icon: <MessageCircle className="w-3.5 h-3.5" />,
    title: "Comments",
    desc: "Real-time threaded discussions on every post",
    color: "bg-purple-50 text-purple-500",
  },
  {
    icon: <Video className="w-3.5 h-3.5" />,
    title: "Reels",
    desc: "Short-form video that reaches wider audiences",
    color: "bg-orange-50 text-orange-500",
  },
  {
    icon: <MessageSquare className="w-3.5 h-3.5" />,
    title: "Messaging",
    desc: "One-on-one encrypted direct messages",
    color: "bg-blue-50 text-blue-500",
  },
];

const CATEGORIES = [
  "👗 Fashion",
  "💎 Accessories",
  "🎨 Art & NFTs",
  "🛠️ Services",
];

const SHOP_FEATURES = [
  { icon: <Store className="w-3 h-3" />, label: "Create your online shop" },
  { icon: <Package className="w-3 h-3" />, label: "Manage products and ads" },
  {
    icon: <ShoppingBag className="w-3 h-3" />,
    label: "Sell through the marketplace",
  },
  {
    icon: <CreditCard className="w-3 h-3" />,
    label: "Accept",
    highlight: "SPUMP-powered payments",
  },
];

const TIERS = [
  { label: "Free", listings: "5", note: "listings" },
  { label: "Pro", listings: "Unlimited", note: "listings" },
];

export default function AuthSidebar() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrev = () => setCurrentSlide((s) => (s - 1 + 3) % 3);
  const handleNext = () => setCurrentSlide((s) => (s + 1) % 3);

  return (
    <div className="hidden lg:flex flex-col justify-center border-r border-white/20 w-1/2 p-10 overflow-y-auto bg-gradient-to-br from-purple-500 to-destructive">
      <div className="max-w-md w-full mx-auto">
        {/* Brand */}
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Sosay
        </h1>
        <p className="text-sm text-white/80 mt-0.5 mb-8">
          Where social meets commerce — create, connect & grow.
        </p>

        {/* Slide Container */}
        <div className="relative">
          {/* Slide 0: Social Features */}
          {currentSlide === 0 && (
            <div className="space-y-4">
              <p className="text-[10px] font-medium text-white/70 uppercase tracking-widest">
                Social Features
              </p>
              <div className="grid grid-cols-2 gap-3">
                {SOCIAL_FEATURES.map((f) => (
                  <div
                    key={f.title}
                    className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-xl p-3.5 hover:bg-white/20 hover:border-white/40 transition-all duration-300 group"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${f.color} group-hover:scale-110 transition-transform`}
                    >
                      {f.icon}
                    </div>
                    <p className="text-[13px] font-semibold text-white">
                      {f.title}
                    </p>
                    <p className="text-[11px] text-white/75 leading-snug mt-1">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slide 1: Marketplace & Listings */}
          {currentSlide === 1 && (
            <div className="space-y-4">
              {/* Shop Builder Section */}
              <div>
                <p className="text-[10px] font-medium text-white/70 uppercase tracking-widest mb-3">
                  Your Store
                </p>
                <div className="bg-white/12 backdrop-blur-sm border border-white/30 rounded-xl p-4 hover:bg-white/15 transition-all">
                  <p className="text-[13px] font-bold text-white mb-1.5">
                    🏪 Shop Builder
                  </p>
                  <p className="text-[11px] text-white/80 leading-relaxed mb-3">
                    Create your online store, manage products, build your brand,
                    and sell directly through Sosay.
                  </p>
                  <div className="flex flex-col gap-2">
                    {SHOP_FEATURES.map((f) => (
                      <div key={f.label} className="flex items-center gap-2.5">
                        <span className="text-pink-300 font-bold">✓</span>
                        <span className="text-[11px] text-white/85">
                          {f.label}{" "}
                          {f.highlight && (
                            <span
                              className="text-white text-[8px] font-bold px-1.5 py-0.5 rounded ml-0.5 inline-block"
                              style={{
                                background:
                                  "linear-gradient(90deg, #ec4899, #f97316)",
                              }}
                            >
                              SPUMP
                            </span>
                          )}
                          {f.highlight ? " payments" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 2: Social Features */}
          {currentSlide === 2 && (
            <div className="space-y-4">
              {/* SPUMP Marketplace Section */}
              <div>
                <p className="text-[10px] font-medium text-white/70 uppercase tracking-widest mb-3">
                  Marketplace
                </p>
                <div className="rounded-xl border border-white/30 p-4 bg-white/12 backdrop-blur-sm hover:bg-white/15 transition-all">
                  <p className="text-[14px] font-bold text-white mb-1.5">
                    ✦ SPUMP Marketplace
                  </p>
                  <p className="text-[11px] text-white/80 leading-relaxed mb-3">
                    Buy and sell products, services, fashion, accessories, art,
                    NFTs, digital content, and physical goods through the Scotty
                    Pumpkin ecosystem.
                  </p>

                  {/* Category pills */}
                  <div className="flex flex-wrap gap-2 mb-3.5">
                    {CATEGORIES.map((cat) => (
                      <span
                        key={cat}
                        className="text-[10px] font-medium text-white bg-white/20 border border-white/30 rounded-full px-3 py-1 hover:bg-white/30 transition-all"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Discover button */}
                  <button
                    className="text-[11px] font-semibold text-white rounded-full px-4 py-2 shadow-lg hover:scale-105 transition-transform"
                    style={{
                      background:
                        "linear-gradient(135deg, #e8456a 0%, #f472b6 100%)",
                      boxShadow: "0 4px 14px rgba(232,69,106,0.4)",
                    }}
                  >
                    Discover Marketplace →
                  </button>
                </div>
              </div>

              {/* Smart Listings Section */}
              <div>
                <p className="text-[10px] font-medium text-white/70 uppercase tracking-widest mb-3">
                  Listings Plans
                </p>
                <div className="bg-white/12 backdrop-blur-sm border border-white/30 rounded-xl p-4 hover:bg-white/15 transition-all">
                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    {TIERS.map((t) => (
                      <div
                        key={t.label}
                        className="rounded-lg border border-white/30 p-3 bg-white/10 hover:bg-white/20 transition-all"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 text-white/70">
                          {t.label}
                        </p>
                        <p className="text-lg font-bold text-white leading-none mb-1">
                          {t.listings}
                        </p>
                        <p className="text-[10px] text-white/60">{t.note}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        dot: "bg-emerald-400",
                        label: "National",
                        desc: "Sell within your country",
                      },
                      {
                        dot: "bg-violet-400",
                        label: "Global",
                        desc: "Reach buyers worldwide",
                      },
                    ].map((r) => (
                      <div
                        key={r.label}
                        className="flex items-start gap-2.5 bg-white/10 rounded-lg px-3 py-2.5 border border-white/30 hover:bg-white/15 transition-all"
                      >
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 mt-1 ${r.dot}`}
                        />
                        <div>
                          <p className="text-[11px] font-semibold text-white">
                            {r.label}
                          </p>
                          <p className="text-[10px] text-white/70">{r.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Navigation & Pagination */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
            <button
              onClick={handlePrev}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? "bg-white w-5"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
