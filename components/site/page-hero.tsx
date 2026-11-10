"use client";

import { motion } from "framer-motion";
import { PageBanner, getBannerSettings } from "@/components/site/page-banner";

interface PageHeroProps {
  /** Key in `pageImages` (lib/data.ts), e.g. "research". */
  page: string;
  /** Page title shown on top of the image. */
  title: string;
  /** Optional description shown under the title. */
  subtitle?: string;
  /** Alt text for the background image. */
  alt?: string;
}

/**
 * Header of every sub-page: the page title and description overlaid on the
 * banner image. The image itself — its height, crop and focal point — is
 * owned by `components/site/page-banner.tsx`; this file only styles the text.
 */
export function PageHero({ page, title, subtitle, alt }: PageHeroProps) {
  const { height } = getBannerSettings(page);

  return (
    <section
      className="relative flex items-end overflow-hidden"
      style={{ minHeight: height }}
    >
      <PageBanner page={page} alt={alt ?? title ?? "Page image"} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-28 pb-10 lg:pt-32 lg:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[58px] font-semibold text-[#E3F2F7] tracking-[-0.03em]">
            {title ?? ""}
          </h1>
          {(subtitle?.length ?? 0) > 0 && (
            <p className="mt-4 text-[#E3F2F7]/60 max-w-2xl mx-auto leading-relaxed text-base sm:text-lg">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
