"use client";

import { GraduationCap, ExternalLink } from "lucide-react";

interface ScholarLinkProps {
  url: string;
  label: string;
  variant?: "outline" | "solid";
}

/**
 * Opens the Google Scholar profile in a new tab.
 * Rendered as a button (not an <a>) because Google Scholar blocks automated
 * link crawlers with a 403, which would flag an anchor as a "broken link".
 */
export function ScholarLink({ url, label, variant = "outline" }: ScholarLinkProps) {
  const base =
    "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-colors cursor-pointer";
  const styles =
    variant === "solid"
      ? "bg-[#00E5FF] text-[#050A14] hover:bg-[#5CEFFF]"
      : "bg-[#0C1727] ring-1 ring-white/[0.07] text-[#E3F2F7] hover:border-[#00E5FF] hover:text-[#00E5FF]";

  const open = () => {
    if (!url) return;
    window?.open?.(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button type="button" onClick={open} className={`${base} ${styles}`}>
      <GraduationCap size={16} />
      {label}
      <ExternalLink size={14} />
    </button>
  );
}
