"use client";

import { TeamMember } from "@/lib/data";
import { Mail, GraduationCap, User, MapPin } from "lucide-react";
import Image from "next/image";
import { safeExternalUrl, safeMailto } from "@/lib/security";


interface MemberCardProps {
  member: TeamMember;
  index: number;
}

export function MemberCard({ member, index }: MemberCardProps) {
  const hasImage = !!(member?.image && (member?.image?.length ?? 0) > 0);

  return (
<div
  className="surface surface-hover hover:shadow-[var(--shadow-md)] p-4 flex items-start gap-4 animate-fadeinup"
  style={{ animationDelay: `${(index ?? 0) * 0.05}s` }}
>
        {/* Photo */}
        <div className="relative w-[72px] h-[112px] shrink-0 rounded-[10px] overflow-hidden bg-[#102132] flex items-center justify-center">
          {hasImage ? (
            <Image
              src={member?.image ?? ""}
              alt={member?.name ?? "Team member"}
              width={72}
              height={112}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <User size={28} className="text-[#E3F2F7]/15" strokeWidth={1.25} />
          )}
        </div>
  
        {/* Info */}
        <div className="min-w-0 flex-1 break-words">
        <h3 className="type-card-title-sm text-[#E3F2F7] mb-1 break-words">
          {member?.name ?? ""}
        </h3>
        <p className="text-xs font-mono text-[#00E5FF] uppercase tracking-wide mb-1.5">
          {member?.role ?? ""}
        </p>
        {(member?.nationality?.length ?? 0) > 0 && (
          <p className="flex items-center gap-1.5 text-xs text-[#E3F2F7]/50 mb-3">
            <MapPin size={12} className="shrink-0 text-[#E3F2F7]/35" />
            {member?.nationality ?? ""}
          </p>
        )}
        {(member?.nationality?.length ?? 0) === 0 && <div className="mb-3" />}
        {(member?.bio?.length ?? 0) > 0 && (
          <p className="type-card-body text-[#E3F2F7]/60 mb-4 line-clamp-3 break-words">
            {member?.bio ?? ""}
          </p>
        )}

        {/* Social links */}
        <div className="flex items-center gap-3">
          {(member?.email?.length ?? 0) > 0 && (
            <a
              href={safeMailto(member?.email)}
              className="text-[#E3F2F7]/40 hover:text-[#00E5FF] transition-colors"
              aria-label="Email"
            >
              <Mail size={16} />
            </a>
          )}
          {(member?.scholar?.length ?? 0) > 0 && (
            <a
              href={safeExternalUrl(member?.scholar)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E3F2F7]/40 hover:text-[#00E5FF] transition-colors"
              aria-label="Google Scholar"
            >
              <GraduationCap size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
