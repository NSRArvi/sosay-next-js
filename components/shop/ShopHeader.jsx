"use client";
import { useAppContext } from "@/context/context";
import Image from "next/image";
import Link from "next/link";

export default function ShopHeader() {
  const {accessToken} = useAppContext();
  return (
    <div className="mb-8">
      {/* Scotty Pumpkin — vertical logo block */}
      <a
        href="https://scottypumpkin.com"
        target="_blank"
        rel="noopener noreferrer"
        className="group mb-5 inline-flex flex-col items-start gap-1 transition-all duration-200"
      >
        <Image
          src="/images/logo/scotty.webp"
          alt="Scotty Pumpkin"
          width={56}
          height={56}
          className="rounded-full transition-transform duration-200 group-hover:scale-105"
          style={{
            border: "2.5px solid #F97316",
            boxShadow:
              "0 0 0 4px rgba(249,115,22,0.12), 0 0 18px rgba(249,115,22,0.30)",
          }}
        />
        <span className="flex flex-col leading-tight">
          <span
            className="text-[10px] font-semibold uppercase"
            style={{ color: "rgba(194,87,10,0.50)", letterSpacing: "0.12em" }}
          >
            Part of the
          </span>
          <span
            className="text-xs font-bold transition-colors duration-200 group-hover:text-orange-600"
            style={{ color: "#C2570A" }}
          >
            Scotty Pumpkin Web3 Ecosystem
          </span>
        </span>
      </a>

      {!accessToken && (
        <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200 flex items-center justify-between">
          <p className="text-gray-700">
            Join Sosay to place up to 3 products.
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-destructive text-white font-semibold rounded-lg hover:bg-destructive/80 transition-colors duration-200"
          >
            Join Now
          </Link>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2">Spump Market</h1>
      <p className="text-gray-600">
        Buy and sell items with your campus community. Browse the marketplace or
        manage your own shop.
      </p>
    </div>
  );
}
