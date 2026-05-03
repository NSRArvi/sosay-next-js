"use client";
import { useAppContext } from "@/context/context";
import Image from "next/image";

export default function ShopHeader() {
  const { accessToken } = useAppContext();

  return (
    <div className="mb-8">
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
          <Image
            src="/images/logo/scotty.webp"
            alt="Sosay"
            width={60}
            height={60}
            className="rounded-full shrink-0"
          />
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-gray-900">
              Join Sosay Free
            </h3>
            <p className="text-sm text-gray-600">
              List up to 5 Free Ads – Post, Sell, Replace Anytime
            </p>
            <p className="text-sm text-gray-600">Need more listings?</p>
            <p className="text-sm text-gray-600">
              Create your online shop with{" "}
              <strong style={{ color: "#F97316" }}>SPUMP</strong> and unlock
              more selling power with unlimited free ads.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-4">
              <a
                href="https://sosay.org"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold"
                style={{ backgroundColor: "#2D7A4F" }}
              >
                Post 5 ADS Free
              </a>
              <a
                href="https://bfinit.com/bfinit-ecomerce-platform"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold"
                style={{ backgroundColor: "#F97316" }}
              >
                Open Your Shop
              </a>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2">
        <span style={{ color: "#F97316" }}>Spump</span> Marketplace
      </h1>
      <p className="text-gray-600">
        Buy and sell items with your campus community. Browse the marketplace or
        manage your own shop.
      </p>
    </div>
  );
}
