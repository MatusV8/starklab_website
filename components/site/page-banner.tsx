"use client";

import Image from "next/image";
import { pageImages } from "@/lib/data";

// ---------------------------------------------------------------------------
// EDIT HERE to change the header banners. Nothing in page-hero.tsx has to be
// touched: that file only renders the page title and description.
// ---------------------------------------------------------------------------

/** Applies to every page unless overridden in `bannerSettings` below. */
export const bannerDefaults = {
  /** Band height. Any CSS length; clamp() keeps it sane on small and huge screens. */
  height: "clamp(340px, 40vh, 520px)",
  /** Focal point of the crop: "x y". "50% 50%" keeps the upper part of the photo. */
  position: "50% 50%",
  /** "cover" fills the band and crops; "contain" shows the whole image. */
  fit: "cover" as "cover" | "contain",
};

export interface BannerSettings {
  height?: string;
  position?: string;
  fit?: "cover" | "contain";
}

/**
 * Per-page overrides. Leave a page out to use the defaults above.
 * Example:  members: { position: "50% 30%", height: "340px" },
 */
export const bannerSettings: Record<string, BannerSettings> = {
  research: {},
  members: {},
  alumni: {},
  events: {},
  publications: {},
  "journal-club": {},
  vacancies: {},
  contact: {},
};

/** Resolved settings for one page (overrides merged onto the defaults). */
export function getBannerSettings(page: string) {
  const override = bannerSettings?.[page ?? ""] ?? {};
  return {
    height: override?.height ?? bannerDefaults?.height,
    position: override?.position ?? bannerDefaults?.position,
    fit: override?.fit ?? bannerDefaults?.fit,
  };
}

// ---------------------------------------------------------------------------
// PHOTO CREDITS live in lib/data.ts (`bannerCredits`), next to `pageImages`.
// ---------------------------------------------------------------------------

interface PageBannerProps {
  /** Key in `pageImages` (lib/data.ts), e.g. "research". */
  page: string;
  /** Alt text for the image. */
  alt?: string;
}

/**
 * Background image layer of a page header: the photo and the readability
 * overlays. Renders nothing when no image is set for the page. It sits inside
 * the header section of `page-hero.tsx`, which positions the title on top.
 */
export function PageBanner({ page, alt }: PageBannerProps) {
  const src = pageImages?.[page ?? ""] ?? "";
  const hasImage = (src?.length ?? 0) > 0;
  const { position, fit } = getBannerSettings(page);

  // No image set: show nothing, so only the page background is visible.
  if (!hasImage) return null;

  return (
    <div className="absolute inset-0">
      <Image
        src={src}
        alt={alt ?? "Page image"}
        fill
        priority
        sizes="100vw"
        style={{ objectFit: fit, objectPosition: position }}
      />

      {/* Readability overlays for the title sitting on top. */}
      <div className="absolute inset-0 bg-[#050A14]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050A14] via-[#050A14]/50 to-transparent" />
    </div>
  );
}
