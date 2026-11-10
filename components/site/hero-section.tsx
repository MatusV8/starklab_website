"use client";

import { labInfo } from "@/lib/data";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const scrollToContent = () => {
    // Jump to the first section below the video.
    document
      ?.getElementById?.("home-content")
      ?.scrollIntoView?.({ behavior: "smooth" });
  };

  return (
    <section className="relative aspect-video xl:aspect-auto xl:h-[100svh] w-full overflow-hidden bg-[#050A14]">
      {/* Full-screen video */}
      <video
        className="absolute inset-0 h-full w-full object-contain xl:object-cover"
        src="/hero.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        // no `loop` — it plays once and holds on the last frame
      />

      {/* Slight scrim so the title stays readable over any frame */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050A14] via-transparent to-[#050A14]/30" />

      {/* Title */}
      {/* `pb` pushes the tagline up from the bottom edge — lower the `lg`
          value to move the tagline further down on desktop. */}
      <div className="relative z-10 flex h-full w-full items-end justify-center px-4 pb-[10%] lg:pb-[7%]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut", delay: 1 }}
          className="text-center"
        >
          <p className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            {labInfo?.tagline ?? ""}
          </p>
        </motion.div>
      </div>

      {/* Scroll-down cue — starts fading in at 1.5s, while the tagline above
          is still fading in (its delay 1s, duration 2s). Only opacity is
          animated so the -translate-x-1/2 centering class is left intact. */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1.5 }}
        type="button"
        onClick={scrollToContent}
        aria-label="Scroll down to see more"
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white/80 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-full p-2"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="block"
        >
          <ChevronDown size={30} strokeWidth={2} />
        </motion.span>
      </motion.button>
    </section>
  );
}