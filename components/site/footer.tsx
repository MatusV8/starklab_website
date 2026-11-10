import Link from "next/link";
import Image from "next/image";
import { labInfo } from "@/lib/data";
import { Mail, MapPin } from "lucide-react";
import { safeExternalUrl } from "@/lib/security";

export function Footer() {
  const labName = labInfo?.name ?? "Stark Lab";
  return (
    <footer className="bg-[#030711] text-[#E3F2F7]/70">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Lab info */}
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-3">
              {labInfo?.name ?? "Stark Lab"}
            </h3>
            <p className="text-sm text-white/55 leading-relaxed">
              {labInfo?.institution ?? "[INSTITUTION]"}
            </p>
            <p className="text-sm text-white/55">
              {labInfo?.department ?? "[DEPARTMENT]"}
            </p>

            {/* Institute logos */}
            <div className="mt-5 flex flex-wrap items-center gap-4">
              {(labInfo?.institutionLogos ?? [])?.map?.((logo: any, idx: number) => {
                const url = logo?.url ?? "";
                const name = logo?.name ?? "Institute";
                if ((url?.length ?? 0) === 0) {
                  return (
                    <div
                      key={name + idx}
                      className="h-10 w-28 rounded border border-dashed border-white/20 flex items-center justify-center text-[9px] uppercase tracking-widest text-white/35 text-center px-1"
                    >
                      {name}
                    </div>
                  );
                }
                const logoImage = (
                  <div className="relative h-14 w-40">
                    <Image
                      src={url}
                      alt={`${name} logo`}
                      fill
                      className="object-contain object-left"
                      sizes="112px"
                    />
                  </div>
                );
                return (logo?.href?.length ?? 0) > 0 ? (
                  <a
                    key={name + idx}
                    href={safeExternalUrl(logo?.href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-80 hover:opacity-100 transition-opacity"
                    aria-label={name}
                  >
                    {logoImage}
                  </a>
                ) : (
                  <div key={name + idx} className="opacity-80">
                    {logoImage}
                  </div>
                );
              }) ?? null}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/research" className="text-sm text-white/70 hover:text-white transition-colors">Research</Link>
              <Link href="/publications" className="text-sm text-white/70 hover:text-white transition-colors">Publications</Link>
              <Link href="/vacancies" className="text-sm text-white/70 hover:text-white transition-colors">Vacancies</Link>
              <Link href="/contact" className="text-sm text-white/70 hover:text-white transition-colors">Contact</Link>
              <Link href="/imprint" className="text-sm text-white/70 hover:text-white transition-colors">Imprint</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 mb-4">Contact</h4>
            <div className="flex items-start gap-2 text-sm mb-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[#00E5FF]" />
              <span suppressHydrationWarning>{labInfo?.address ?? "[ADDRESS]"}, {labInfo?.postalCode ?? ""} {labInfo?.city ?? "[CITY]"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail size={16} className="shrink-0 text-[#00E5FF]" />
              <span suppressHydrationWarning>{labInfo?.email ?? "[EMAIL]"}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-white/40">
          <Link href="/imprint" className="hover:text-white transition-colors">
            Imprint
          </Link>{" "}
          · © {new Date().getFullYear()} {labName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
