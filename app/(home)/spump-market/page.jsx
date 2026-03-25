"use client";

import PublicMarketplace from "@/components/shop/PublicMarketplace";
import Image from "next/image";

export default function page() {
  return (
    <section className="max-w-5xl mx-auto px-4 pt-24">
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

        <h1 className="text-3xl font-bold mb-2">Spump Market</h1>
        <p className="text-gray-600">
          Buy and sell items with your campus community. Browse the marketplace
          or manage your own shop.
        </p>
      </div>
      <PublicMarketplace />
    </section>
  );
}
