"use client";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import React from "react";
import { usePathname } from "next/navigation";

export default function Layout({ children }) {
  const pathname = usePathname();
  const hide = pathname === "/" || pathname === "/register";

  return (
    <div>
      {!hide && <Navbar />}
      {children}
      {!hide && <Footer />}
    </div>
  );
}
