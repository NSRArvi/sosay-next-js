"use client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import logo from "../../app/assets/logo/logo.png";

export default function Navbar() {
  const [view, setView] = useState(false);
  const location = usePathname();

  const menuItems = [
    { name: "Home", path: "/home" },
    { name: "Business", path: "/business" },
    { name: "Marketplace", path: "/spump-market" },
    { name: "Creators", path: "/creators" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <section>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-border">
        <div className="flex justify-between items-center mx-5 md:container md:mx-auto py-4">
          {/* Mobile Menu Button */}
          <Menu
            className="text-3xl lg:text-4xl text-foreground hover:text-destructive transition-colors duration-300 cursor-pointer hover:scale-110 transform lg:hidden"
            onClick={() => setView(true)}
          />

          {/* Logo */}
          <div className="flex gap-2 items-center">
            <Image src={logo} alt="Sosay Logo" width={100} height={100} />
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`relative text-lg font-medium transition-all duration-300 hover:text-destructive group ${
                  location === item.path
                    ? "text-destructive"
                    : "text-foreground"
                }`}
              >
                {item.name}
                <div
                  className={`absolute bottom-0 left-0 h-0.5 bg-destructive transition-all duration-300 ${
                    location === item.path
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></div>
              </Link>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex gap-4">
            <Link
              href="/register"
              className="px-6 py-2 bg-destructive hover:bg-destructive/90 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-destructive/25"
            >
              Join Free
            </Link>
            <Link
              href="/"
              className="px-6 py-2 bg-transparent border-2 border-destructive text-destructive hover:bg-destructive hover:text-white font-semibold rounded-full transition-all duration-300 hover:scale-105"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu Overlay */}
      {view && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-2xl overflow-hidden lg:hidden">
          {/* Mobile Header */}
          <div className="flex justify-between items-center mx-5 md:container md:mx-auto py-4 animate-fade-in-left">
            <X
              className="text-3xl lg:text-4xl text-foreground hover:text-destructive transition-all duration-300 cursor-pointer hover:scale-110 transform hover:rotate-90"
              onClick={() => setView(false)}
            />
            <div className="text-xl lg:text-2xl font-bold">
              <span className="text-destructive">Sosay</span>
            </div>
          </div>

          {/* Mobile Nav Menu */}
          <div className="flex flex-col gap-6 lg:gap-8 mt-10 lg:mt-16 mx-5 animate-fade-in-left">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`group relative text-3xl lg:text-5xl font-bold w-fit transition-colors duration-300 ${
                  location === item.path
                    ? "text-destructive"
                    : "text-foreground"
                }`}
                onClick={() => setView(false)}
              >
                <span className="relative z-10">{item.name}</span>
                <div
                  className={`absolute bottom-0 left-0 h-1 bg-destructive transition-all duration-300 ease-out ${
                    location === item.path
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></div>
              </Link>
            ))}
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12 lg:mt-16 mx-5 animate-fade-in-left">
            <Link
              href="/register"
              className="px-8 py-3 bg-destructive hover:bg-destructive/90 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-destructive/25 text-lg text-center"
            >
              Join Free
            </Link>
            <Link
              href="/"
              className="px-8 py-3 bg-transparent border-2 border-destructive text-destructive hover:bg-destructive hover:text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 text-lg text-center"
            >
              Log In
            </Link>
          </div>

          {/* Animation Style */}
          <style jsx>{`
            @keyframes fade-in-left {
              from {
                opacity: 0;
                transform: translateX(-30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            .animate-fade-in-left {
              animation: fade-in-left 0.4s ease-out forwards;
            }
          `}</style>
        </div>
      )}
    </section>
  );
}
