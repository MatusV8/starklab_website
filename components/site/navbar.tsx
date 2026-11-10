"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, labInfo } from "@/lib/data";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchDialog } from "@/components/site/search-dialog";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window?.scrollY > 20);
    window?.addEventListener?.("scroll", onScroll);
    return () => window?.removeEventListener?.("scroll", onScroll);
  }, []);

  // Active-link underline: one bar positioned relative to the <nav>, slid
  // with a CSS transition. Being measured inside the fixed header, it is
  // unaffected by page scroll (framer's layoutId animated it in from far
  // down the page after scrolling).
  const navRef = useRef<HTMLElement>(null);
  const [underline, setUnderline] = useState<{ left: number; width: number } | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const active = navRef.current?.querySelector<HTMLElement>('a[aria-current="page"]');
      // 12px = px-3 padding, so the bar spans the label text only.
      setUnderline(active ? { left: active.offsetLeft + 12, width: active.offsetWidth - 24 } : null);
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050A14]/85 backdrop-blur-xl border-b border-[#1A3A4A]"
          : "bg-[#050A14]/70 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="font-display text-[18px] font-bold text-[#E3F2F7] tracking-tight hover:text-[#00E5FF] transition-colors">
          {labInfo?.name ?? "Stark Lab"}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
        <nav ref={navRef} className="relative flex items-center gap-1">
          {(navLinks ?? [])?.map?.((link: any) => {
            const isActive = pathname === link?.href;
            return (
              <Link
                key={link?.href ?? ""}
                href={link?.href ?? "/"}
                aria-current={isActive ? "page" : undefined}
                className={`relative px-3 py-2 text-[14.5px] font-medium rounded-full transition-colors ${
                  isActive
                    ? "text-[#E3F2F7]"
                    : "text-[#E3F2F7]/60 hover:text-[#E3F2F7] hover:bg-[#102132]"
                }`}
              >
                {link?.label ?? ""}
              </Link>
            );
          }) ?? null}
          {underline && (
            <span
              aria-hidden
              className="absolute left-0 -bottom-1 h-[2px] bg-[#00E5FF] rounded-full transition-[transform,width] duration-300 ease-out"
              style={{ width: underline.width, transform: `translateX(${underline.left}px)` }}
            />
          )}
        </nav>
          <div className="ml-2 pl-3 border-l border-[#1A3A4A]">
            <SearchDialog />
          </div>
        </div>

        {/* Mobile: search + menu toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <SearchDialog />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#E3F2F7] hover:text-[#00E5FF] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-[#050A14]/95 backdrop-blur-xl border-t border-[#1A3A4A]"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {(navLinks ?? [])?.map?.((link: any) => (
                <Link
                  key={link?.href ?? ""}
                  href={link?.href ?? "/"}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    pathname === link?.href
                      ? "text-[#E3F2F7] bg-[#102132]"
                      : "text-[#E3F2F7]/65 hover:text-[#E3F2F7] hover:bg-[#102132]"
                  }`}
                >
                  {link?.label ?? ""}
                </Link>
              )) ?? null}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
