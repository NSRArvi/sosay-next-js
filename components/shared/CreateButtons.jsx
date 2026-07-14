import Link from "next/link";
import React from "react";
import { Clapperboard, Plus, SquarePen, Tv2 } from "lucide-react";

export default function CreateButtons() {
  const createLinks = [
    {
      href: "/app/create",
      label: "Post",
      icon: SquarePen,
    },
    {
      href: "/app/reels",
      label: "Reels",
      icon: Clapperboard,
    },
    {
      href: "/app/content",
      label: "Content",
      icon: Tv2,
    },
  ];

  return (
    <div className="hidden lg:block fixed bottom-5 right-5 z-50 group">
      <div className="flex flex-col items-end gap-2">
        <div className="pointer-events-none translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <div className="flex flex-col items-end gap-2">
            {createLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/90 px-4 py-2 text-sm font-medium text-gray-800 shadow-lg backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          aria-label="Open create actions"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl outline-none transition-transform duration-200 hover:scale-105"
        >
          <span className="pointer-events-none absolute inset-0 rounded-full bg-primary/30 animate-ping group-hover:animate-none" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <Plus className="h-6 w-6" />
          </span>
        </button>
      </div>
    </div>
  );
}
