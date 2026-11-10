"use client";

"use client";

import { ResearchArea } from "@/lib/data";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";
import React from "react";
import { VirusIcon } from "@/components/site/icons/virus";

const customIcons: Record<string, React.FC<any>> = {
  Virus: VirusIcon,
};

interface ResearchCardProps {
  area: ResearchArea;
  index: number;
  compact?: boolean;
}

export function ResearchCard({ area, index, compact }: ResearchCardProps) {
  const iconName = area?.icon ?? "Circle";
  const IconComponent =
    customIcons?.[iconName] ??
    ((LucideIcons as any)?.[iconName] as React.FC<LucideProps> | undefined);
  const Icon = IconComponent ?? LucideIcons.Circle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0, transitionEnd: { transform: "none" } }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.35, delay: (index ?? 0) * 0.05 }}
      className="h-full surface surface-hover overflow-hidden group"
    >
      <div className="p-7">
        <div className="flex flex-col gap-5">
          <div className="w-11 h-11 rounded-full bg-[#102132] flex items-center justify-center group-hover:bg-[#00E5FF]/10 transition-colors">
            <Icon
              size={20}
              className="text-[#E3F2F7] group-hover:text-[#00E5FF] transition-colors"
            />
          </div>
          <div>
            <h3 className="type-card-title text-[#E3F2F7] mb-2 group-hover:text-[#00E5FF] transition-colors">
              {area?.title ?? ""}
            </h3>
            <p className="type-card-body text-[#E3F2F7]/60">
              {compact
                ? area?.summary ?? ""
                : area?.description ?? area?.summary ?? ""}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}