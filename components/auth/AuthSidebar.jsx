import { Heart, MessageCircle, Video, MessageSquare, ShoppingBag, Globe, Star, TrendingUp } from 'lucide-react';

const SOCIAL_FEATURES = [
  { icon: <Heart className="w-3.5 h-3.5" />, title: "Posts & reactions", desc: "Share content and engage with community reactions", color: "bg-pink-50 text-pink-500" },
  { icon: <MessageCircle className="w-3.5 h-3.5" />, title: "Comments", desc: "Real-time threaded discussions on every post", color: "bg-purple-50 text-purple-500" },
  { icon: <Video className="w-3.5 h-3.5" />, title: "Reels", desc: "Short-form video that reaches wider audiences", color: "bg-orange-50 text-orange-500" },
  { icon: <MessageSquare className="w-3.5 h-3.5" />, title: "Messaging", desc: "One-on-one encrypted direct messages", color: "bg-blue-50 text-blue-500" },
];

const TIERS = [
  { label: "Free", listings: "3", note: "listings", style: "bg-gray-50 border-gray-200", badge: "text-gray-500", value: "text-gray-900" },
  { label: "Pro", listings: "Unlimited", note: "listings", style: "bg-emerald-50 border-emerald-200", badge: "text-emerald-700", value: "text-emerald-700" },
];

export default function AuthSidebar() {
  return (
    <div className="hidden lg:flex flex-col justify-center bg-white border-r border-gray-100 w-1/2 p-10 overflow-y-auto">
      <div className="max-w-md w-full mx-auto">

        {/* Brand */}
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Sosay</h1>
        <p className="text-sm text-gray-400 mt-0.5 mb-6">Where social meets commerce — create, connect & grow.</p>

        {/* Social features */}
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-2">Social</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {SOCIAL_FEATURES.map((f) => (
            <div key={f.title} className="border border-gray-100 rounded-xl p-3 hover:border-gray-200 transition-colors">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${f.color}`}>
                {f.icon}
              </div>
              <p className="text-[13px] font-medium text-gray-800">{f.title}</p>
              <p className="text-[11px] text-gray-400 leading-snug mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Marketplace */}
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-2">Marketplace</p>
        <div className="border border-gray-100 rounded-xl p-4 mb-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-800">Smart listings</p>
              <p className="text-[11px] text-gray-400">Start free, scale when you're ready</p>
            </div>
          </div>

          {/* Tier cards */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {TIERS.map((t) => (
              <div key={t.label} className={`rounded-lg border p-2.5 ${t.style}`}>
                <p className={`text-[9px] font-semibold uppercase tracking-wide mb-1 ${t.badge}`}>{t.label}</p>
                <p className={`text-lg font-semibold leading-none mb-0.5 ${t.value}`}>{t.listings}</p>
                <p className="text-[10px] text-gray-400">{t.note}</p>
              </div>
            ))}
          </div>

          {/* Reach */}
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { dot: "bg-emerald-400", label: "National", desc: "Sell within your country" },
              { dot: "bg-violet-400", label: "Global", desc: "Reach buyers worldwide" },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.dot}`} />
                <div>
                  <p className="text-[11px] font-medium text-gray-800">{r.label}</p>
                  <p className="text-[10px] text-gray-400">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand pages */}
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-2">Brand pages</p>
        <div className="border border-gray-100 rounded-xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-400 flex items-center justify-center flex-shrink-0">
            <Star className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-gray-800">Dedicated brand pages</p>
            <p className="text-[11px] text-gray-400 leading-snug mt-0.5">
              Branded presence with promotion tools, analytics, and follower management — all in one place.
            </p>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {["Promotions", "Analytics", "Monetize"].map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">{tag}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}