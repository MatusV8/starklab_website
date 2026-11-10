"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface SearchHit {
  type: string;
  title: string;
  subtitle?: string;
  href: string;
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e?.key === "Escape") close();
      if ((e?.metaKey || e?.ctrlKey) && e?.key?.toLowerCase?.() === "k") {
        e?.preventDefault?.();
        setOpen(true);
      }
    };
    window?.addEventListener?.("keydown", onKey);
    return () => window?.removeEventListener?.("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef?.current?.focus?.(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const q = query.trim();
    // Under two characters the dialog shows a hint instead of results, so
    // there is nothing to fetch.
    if (q.length < 2) return;
    const controller = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data?.results ?? []);
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          console.error("Search failed:", err);
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search the site"
        className="p-2 rounded-md text-[#E3F2F7] hover:text-[#00E5FF] hover:bg-[#00E5FF]/5 transition-colors"
      >
        <Search size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#050A14]/70 backdrop-blur-sm flex items-start justify-center px-4 pt-24"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e?.stopPropagation?.()}
              className="w-full max-w-xl bg-[#0C1727] rounded-[18px] ring-1 ring-white/[0.07] overflow-hidden"
              style={{ boxShadow: "0 30px 70px -20px rgba(20,22,27,0.35)" }}
            >
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1A3A4A]">
                <Search size={18} className="text-[#00E5FF] shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e?.target?.value ?? "")}
                  placeholder="Search publications, people, events…"
                  className="flex-1 bg-transparent outline-none text-[#E3F2F7] placeholder:text-[#E3F2F7]/40 text-base"
                />
                {loading && <Loader2 size={16} className="animate-spin text-[#E3F2F7]/40" />}
                <button
                  onClick={close}
                  aria-label="Close search"
                  className="p-1 rounded text-[#E3F2F7]/50 hover:text-[#00E5FF] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {(query?.trim?.()?.length ?? 0) < 2 ? (
                  <p className="px-5 py-8 text-sm text-[#E3F2F7]/50 text-center">
                    Type at least two characters to search.
                  </p>
                ) : (results?.length ?? 0) === 0 && !loading ? (
                  <p className="px-5 py-8 text-sm text-[#E3F2F7]/50 text-center">
                    No matches for “{query}”.
                  </p>
                ) : (
                  <ul className="divide-y divide-[#E3F2F7]/5">
                    {(results ?? [])?.map?.((hit: SearchHit, idx: number) => (
                      <li key={`${hit?.href ?? ""}-${idx}`}>
                        <Link
                          href={hit?.href ?? "/"}
                          onClick={close}
                          className="block px-5 py-3 hover:bg-[#00E5FF]/5 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-full">
                              {hit?.type ?? ""}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-[#E3F2F7] leading-snug">
                            {hit?.title ?? ""}
                          </p>
                          {(hit?.subtitle?.length ?? 0) > 0 && (
                            <p className="text-xs text-[#E3F2F7]/60 mt-0.5 line-clamp-1">
                              {hit?.subtitle}
                            </p>
                          )}
                        </Link>
                      </li>
                    )) ?? null}
                  </ul>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
