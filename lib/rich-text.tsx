import React from "react";
import Link from "next/link";

// [label](target) — target may contain balanced parentheses, e.g.
// https://en.wikipedia.org/wiki/Enhancer_(genetics)
// or be wrapped in angle brackets: [label](<https://x.org/a(b)c>)
const LINK_RE =
  /\[([^\]]+)\]\(\s*(?:<([^>]+)>|((?:[^()\s]|\([^()]*\))+))\s*\)/g;

// **bold** and *italic*, parsed after links are split out. Bold is matched
// first so a `**…**` pair is not read as two italic markers.
const EMPHASIS_RE = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;

/**
 * Renders **bold** / *italic* markers within a plain-text segment.
 * `prefix` keeps React keys unique when several segments end up side by side.
 */
function renderEmphasis(text: string, prefix = ""): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  EMPHASIS_RE.lastIndex = 0;
  while ((match = EMPHASIS_RE.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(noBreakHyphens(text.slice(last, match.index)));
    }
    if (match[1] !== undefined) {
      nodes.push(<strong key={`${prefix}b${key++}`}>{noBreakHyphens(match[1])}</strong>);
    } else {
      nodes.push(<em key={`${prefix}i${key++}`}>{noBreakHyphens(match[2])}</em>);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    nodes.push(noBreakHyphens(text.slice(last)));
  }
  return nodes;
}

const LINK_CLASS =
  "text-[#00E5FF] underline decoration-[#00E5FF]/40 hover:decoration-[#00E5FF] underline-offset-2";

/** Non-breaking hyphens so text never wraps straight after a "-". */
export function noBreakHyphens(text: string): string {
  return (text ?? "").replace(/-/g, "\u2011");
}

/**
 * Renders [label](target) links plus **bold** / *italic*.
 *
 * `linksAsText: true` shows each link as its label only (no <a>). Use it
 * inside an element that is already a link, such as a preview card, where a
 * nested link would be invalid HTML.
 */
export function renderRichText(
  input: string,
  { linksAsText = false }: { linksAsText?: boolean } = {}
): React.ReactNode[] {
  const text = input ?? "";
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  let seg = 0; // segment counter for unique emphasis keys

  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(...renderEmphasis(text.slice(last, match.index), `s${seg++}`));
    }

    const label = match[1] ?? "";
    // group 2 = <angle-bracketed>, group 3 = bare target
    const target = (match[2] ?? match[3] ?? "").trim();
    // "//host" is a protocol-relative link to another site, not an internal path.
    const isInternal = target.startsWith("/") && !target.startsWith("//");
    const isSafe = isInternal || /^https?:\/\//i.test(target);

    if (!isSafe || linksAsText) {
      nodes.push(...renderEmphasis(label, `s${seg++}`));
    } else if (isInternal) {
      nodes.push(
        <Link key={`l${key++}`} href={target} className={LINK_CLASS}>
          {renderEmphasis(label, `s${seg++}`)}
        </Link>
      );
    } else {
      nodes.push(
        <a
          key={`l${key++}`}
          href={target}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          {renderEmphasis(label, `s${seg++}`)}
        </a>
      );
    }

    last = match.index + match[0].length;
  }

  if (last < text.length) {
    nodes.push(...renderEmphasis(text.slice(last), `s${seg++}`));
  }

  return nodes;
}