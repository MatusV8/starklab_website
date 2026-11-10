import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { labInfo, contactInfo } from "@/lib/data";
import { MapPin, Mail, Phone, Building, Users } from "lucide-react";

export default function ContactPage() {
  // Optional cards under "Meet us": add `points: [{ title, text }, ...]` to
  // contactInfo.meetUs in lib/data.ts to show them.
  const meetUs: typeof contactInfo.meetUs & { points?: { title: string; text: string }[] } =
    contactInfo.meetUs;
  const points = meetUs.points ?? [];

  return (
    <>
      <main className="pb-20">
        <PageHero
          page="contact"
          alt="Contact"
          title={contactInfo?.heading ?? "Get in Touch"}
          subtitle={contactInfo?.description ?? ""}
        />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-14 sm:pt-16 space-y-16">
          {/* 1 — Meet us */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <Users size={20} className="shrink-0 text-[#00E5FF]" />
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#E3F2F7] tracking-[-0.02em]">
                {meetUs?.heading ?? "Meet us"}
              </h2>
            </div>
            {(meetUs?.description?.length ?? 0) > 0 && (
              <p className="max-w-3xl text-[#E3F2F7]/65 leading-relaxed mb-8 break-words">
                {meetUs?.description ?? ""}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {points.map((point, idx) => (
                <div key={point?.title ?? idx} className="surface p-6 min-w-0">
                  <h3 className="type-card-title-sm text-[#E3F2F7] mb-2 break-words">
                    {point?.title ?? ""}
                  </h3>
                  <p className="type-card-body text-[#E3F2F7]/60 break-words">
                    {point?.text ?? ""}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 2 — Contact details + location */}
          <section>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#E3F2F7] tracking-[-0.02em] mb-8">
              {contactInfo?.detailsHeading ?? "Contact details & location"}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Details */}
              <div className="surface p-7 min-w-0">
                <div className="space-y-5">
                  <div className="flex items-start gap-3 min-w-0">
                    <Building size={18} className="shrink-0 mt-0.5 text-[#00E5FF]" />
                    <div className="min-w-0 text-sm text-[#E3F2F7]/80 break-words">
                      <p className="font-semibold text-[#E3F2F7]">{labInfo?.name ?? ""}</p>
                      <p>{labInfo?.institution ?? "[INSTITUTION]"}</p>
                      <p>{labInfo?.department ?? "[DEPARTMENT]"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 min-w-0">
                    <MapPin size={18} className="shrink-0 mt-0.5 text-[#00E5FF]" />
                    <div className="min-w-0 text-sm text-[#E3F2F7]/80 break-words">
                      <p>{labInfo?.address ?? "[ADDRESS]"}</p>
                      <p>
                        {labInfo?.postalCode ?? ""} {labInfo?.city ?? "[CITY]"},{" "}
                        {labInfo?.country ?? "[COUNTRY]"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 min-w-0">
                    <Mail size={18} className="shrink-0 mt-0.5 text-[#00E5FF]" />
                    <span
                      className="min-w-0 text-sm text-[#E3F2F7]/80 break-words"
                      suppressHydrationWarning
                    >
                      {labInfo?.email ?? "[EMAIL]"}
                    </span>
                  </div>

                  {(labInfo?.phone?.length ?? 0) > 0 && labInfo?.phone !== "[PHONE]" && (
                    <div className="flex items-start gap-3 min-w-0">
                      <Phone size={18} className="shrink-0 mt-0.5 text-[#00E5FF]" />
                      <span
                        className="min-w-0 text-sm text-[#E3F2F7]/80 break-words"
                        suppressHydrationWarning
                      >
                        {labInfo?.phone ?? ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="surface p-7 min-w-0">
                <div className="aspect-video rounded-lg overflow-hidden bg-[#102132]">
                  {(contactInfo?.mapEmbedUrl?.length ?? 0) > 0 ? (
                    <iframe
                      src={contactInfo?.mapEmbedUrl ?? ""}
                      title="Lab location"
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center px-4">
                        <MapPin size={32} className="mx-auto text-[#00E5FF]/30 mb-2" />
                        <p className="text-sm text-[#E3F2F7]/60 break-words">
                          {contactInfo?.locationLabel ?? ""}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}