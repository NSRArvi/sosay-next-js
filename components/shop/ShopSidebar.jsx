"use client";
import { useAppContext } from "@/context/context";
import Image from "next/image";

export default function ShopSidebar() {
  const { accessToken } = useAppContext();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/images/logo/scotty.webp"
          alt="Sosay"
          width={60}
          height={60}
          className="rounded-full"
          style={{ border: "2.5px solid #F97316" }}
        />
        <div className="text-center">
          <h3 className="text-lg font-extrabold text-gray-900">
            Join Sosay Free
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            List up to <strong className="text-gray-900">3 ads free</strong> as private or business seller.
          </p>
          <p className="mt-3 text-sm text-gray-600">Need more listings?</p>
          <p className="text-sm text-gray-600">
            Create your online shop with{" "}
            <strong style={{ color: "#F97316" }}>SPUMP</strong>{" "}
            and unlock more selling power.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          {!accessToken && (
            <a
              href="https://sosay.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold text-center"
              style={{ backgroundColor: "#2D7A4F" }}
            >
              Post 3 Ads Free
            </a>
          )}
          <a
            href="https://bfinit.com/bfinit-ecomerce-platform"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold text-center"
            style={{ backgroundColor: "#F97316" }}
          >
            Open Your Shop
          </a>
        </div>
      </div>
    </div>
  );
}
