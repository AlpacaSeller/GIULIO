import Link from "next/link";
import { site } from "@/lib/content";

// Globo essenziale a tratto fine: meridiano, equatore e un punto terracotta
// (la prossima destinazione). Usato nel header e richiamato nell'icona PWA.
export function Globe({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4.2" ry="9" />
      <path d="M3 12h18" />
      <circle cx="16.2" cy="7.4" r="1.6" fill="#c8451f" stroke="none" />
    </svg>
  );
}

export default function Wordmark({ href = "/" }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] transition hover:text-terra"
      aria-label={`${site.nome} — home`}
    >
      <Globe className="shrink-0" />
      {site.nome} {site.cognome}
    </Link>
  );
}
