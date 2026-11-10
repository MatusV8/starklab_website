"use client";

import { motion } from "framer-motion";

/** Shared reveal: fade up as it scrolls into view, once. */
const rise = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

/** Centered section header: title, optional subtitle, then a short thick rule. */
export function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-10">
      <motion.h2
        {...rise}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="font-display text-3xl sm:text-4xl font-semibold text-[#E3F2F7] tracking-tight"
      >
        {title}
      </motion.h2>

      {subtitle ? (
        <motion.p
          {...rise}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
          className="text-[#E3F2F7]/60 mt-3 max-w-2xl mx-auto leading-relaxed text-base"
        >
          {subtitle}
        </motion.p>
      ) : null}

      <motion.span
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="block mx-auto mt-6 h-[4px] w-14 rounded-full bg-[#00E5FF] origin-center"
      />
    </div>
  );
}