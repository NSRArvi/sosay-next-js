"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Instagram, Twitter, Youtube, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

export default function Footer() {
  const pathname = usePathname() || "/";

  const internalLinks = [
    { name: "Home", path: "/home" },
    { name: "Business", path: "/business" },
    { name: "Marketplace", path: "/spump-market" },
    { name: "Creators", path: "/creators" },
    { name: "Blog", path: "/blog" },
    { name: "Help or Support", path: "/help" },
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ];

  const externalLinks = [
    { name: "Business Ecommerce", url: "https://shop.bfinit.com/login" },
    { name: "Creators", url: "https://so-show.netlify.app/" },
    { name: "Usfranc", url: "https://usfranc.com/" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: <Facebook size={18} />, url: "https://facebook.com" },
    { name: "Twitter", icon: <Twitter size={18} />, url: "https://twitter.com" },
    { name: "Instagram", icon: <Instagram size={18} />, url: "https://instagram.com" },
    { name: "YouTube", icon: <Youtube size={18} />, url: "https://youtube.com" },
    { name: "Email", icon: <Mail size={18} />, url: "mailto:info@sosay.com" },
  ];

  // robust active detection: exact match or section startsWith (handles nested routes)
  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <footer className="py-12 border-t border-border bg-[var(--background)] relative overflow-hidden">
      <div className="mx-5 md:container md:mx-auto relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            <span className="text-[var(--primary)]">Sosay</span>
          </h2>
          <p className="text-[var(--muted-foreground)] text-sm max-w-md mx-auto">
            Connect, share, and discover amazing content with our dynamic social platform.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Navigation</h3>
            <div className="flex flex-col gap-3">
              {internalLinks.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`group relative text-sm font-medium transition-all duration-300 w-fit ${
                      active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.name}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-[var(--primary)] transition-all duration-300 ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* External Links */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Our Network</h3>
            <div className="flex flex-col gap-3">
              {externalLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all duration-300 w-fit"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Stay Updated</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              Subscribe to our newsletter for the latest updates and features.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-[var(--card)]/60 border border-border rounded-lg text-[var(--foreground)] placeholder:[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-300"
              />
              <Button
                type="submit"
                className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[var(--primary)]/25"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Social + Copyright */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors duration-300 p-2 rounded-full hover:bg-[var(--card)]/30"
                  aria-label={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              © {new Date().getFullYear()} <span className="text-[var(--primary)]">Sosay</span>. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none -z-10">
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-[var(--primary)]/6 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-[var(--accent)]/6 rounded-full blur-3xl" />
      </div>
    </footer>
  );
}
