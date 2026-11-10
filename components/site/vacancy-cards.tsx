"use client";

import { vacanciesInfo } from "@/lib/data";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, FlaskConical, ExternalLink } from "lucide-react";
import Link from "next/link";
import { safeExternalUrl } from "@/lib/security";

const icons = [GraduationCap, Briefcase, FlaskConical];

export function VacancyCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {(vacanciesInfo?.positions ?? [])?.map?.((pos: any, idx: number) => {
        const Icon = icons?.[idx] ?? Briefcase;
        return (
          <motion.div
            key={pos?.title ?? idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="surface surface-hover p-7 hover:shadow-[var(--shadow-md)] group"
          >
            <div className="w-11 h-11 rounded-full bg-[#102132] flex items-center justify-center mb-5 group-hover:bg-[#00E5FF]/10 transition-colors">
              <Icon size={20} className="text-[#E3F2F7] group-hover:text-[#00E5FF] transition-colors" />
            </div>
            <h3 className="type-card-title text-[#E3F2F7] mb-3">
              {pos?.title ?? ""}
            </h3>
            <p className="type-card-body text-[#E3F2F7]/60 mb-4">
              {pos?.description ?? ""}
            </p>
            {(pos?.applyUrl?.length ?? 0) > 0 ? (
              <a
                href={safeExternalUrl(pos?.applyUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00E5FF] hover:text-[#5CEFFF] transition-colors"
              >
                <ExternalLink size={14} /> {pos?.applyLabel ?? "Apply"}
              </a>
            ) : (
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00E5FF] hover:text-[#5CEFFF] transition-colors"
              >
                {pos?.applyLabel ?? "Contact Us"}
              </Link>
            )}
          </motion.div>
        );
      }) ?? null}
    </div>
  );
}
