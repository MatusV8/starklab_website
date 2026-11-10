"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { renderRichText } from "@/lib/rich-text";

interface ImageLightboxProps {
  /** Image address to display, or null/empty when nothing is open. */
  src: string | null;
  /** Optional caption shown under the image. Supports **bold**, *italic*
   *  and [label](link), like the captions on the page. */
  caption?: string;
  onClose: () => void;
}

/**
 * Full-screen overlay showing a single image at its natural aspect ratio.
 * Closes on backdrop click, on the close button and on Escape.
 */
export function ImageLightbox({ src, caption, onClose }: ImageLightboxProps) {
  const open = (src?.length ?? 0) > 0;
  // Plain-text version for the screen-reader label and alt text.
  const plainCaption = (caption ?? "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*|\*/g, "");

  // Escape to close + lock background scrolling while open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e?.key === "Escape") onClose?.();
    };

    document?.addEventListener?.("keydown", onKeyDown);
    const previousOverflow = document?.body?.style?.overflow ?? "";
    if (document?.body?.style) document.body.style.overflow = "hidden";

    return () => {
      document?.removeEventListener?.("keydown", onKeyDown);
      if (document?.body?.style) document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-[#050A14]/92 p-4 sm:p-8 cursor-zoom-out"
          role="dialog"
          aria-modal="true"
          aria-label={plainCaption || "Enlarged photo"}
          onClick={() => onClose?.()}
        >
          <button
            type="button"
            onClick={(e) => {
              e?.stopPropagation?.();
              onClose?.();
            }}
            aria-label="Close photo"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 grid place-items-center w-10 h-10 rounded-full bg-[#0B1524]/10 text-white hover:bg-[#E3F2F7]/[0.07]/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
          >
            <X size={20} strokeWidth={1.75} />
          </button>

          <motion.img
            initial={{ scale: 0.97 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.97 }}
            transition={{ duration: 0.18 }}
            src={src ?? ""}
            alt={plainCaption || "Enlarged photo"}
            // object-contain + max sizes keep the original aspect ratio; small
            // images are never upscaled past their natural size.
            className="max-w-[92vw] max-h-[85vh] w-auto h-auto object-contain rounded-[var(--radius)] shadow-[0_20px_60px_rgba(0,0,0,0.45)] cursor-default"
            onClick={(e) => e?.stopPropagation?.()}
          />

          {(caption?.length ?? 0) > 0 ? (
            <p
              className="max-w-[92vw] text-center text-sm text-white/90 bg-[#050A14]/85 border border-white/10 rounded-lg px-4 py-2"
              onClick={(e) => e?.stopPropagation?.()}
            >
              {renderRichText(caption ?? "")}
            </p>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
