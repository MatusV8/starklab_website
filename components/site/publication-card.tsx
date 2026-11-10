"use client";

import { Publication } from "@/lib/data";
import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PublicationCardProps {
  pub: Publication;
}

export function PublicationCard({ pub }: PublicationCardProps) {
  return (
    <div>
      <Link
        href={`/publications/${pub?.slug ?? ""}`}
        className="group block surface surface-hover overflow-hidden hover:shadow-[var(--shadow-md)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Text */}
          <div className="flex-1 p-5 min-w-0">
            <div className="flex items-start gap-3">
              <FileText size={22} className="shrink-0 mt-1 text-[#00E5FF]/50" />
              <div className="min-w-0">
                {/* Text sizes: see .type-card-* in app/globals.css */}
                <h3 className="type-card-title text-[#E3F2F7] group-hover:text-[#00E5FF] transition-colors break-words">
                  {pub?.title ?? ""}
                </h3>
                <p className="type-card-body text-[#E3F2F7]/60 mt-2 line-clamp-2">
                  {pub?.authors ?? ""}
                </p>
                <p className="text-xs font-mono text-[#00E5FF]/80 mt-2">
                  {pub?.venue ?? ""}
                  {(pub?.year ?? 0) > 0 ? ` · ${pub?.year}` : ""}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#00E5FF] mt-2.5 opacity-70 group-hover:opacity-100 transition-opacity">
                  View details <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
