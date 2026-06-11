import Image from "next/image";
import Link from "next/link";
import { site, marqueeExtras } from "@/lib/content";
import { getShoots } from "@/lib/data";
import Reveal from "@/components/Reveal";

// Asterisco SVG: sempre terracotta, su ogni dispositivo
// (il carattere ✳ su telefono diventa un'emoji verde)
function Star() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      className="-mt-0.5 inline text-terra"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6 1v10M1.7 3.5l8.6 5M10.3 3.5l-8.6 5" />
    </svg>
  );
}

// I contenuti possono cambiare dall'admin: rigenera la pagina ogni 60s
export const revalidate = 60;

function Marquee({ shoots }) {
  // Destinazioni reali (cliccabili) alternate alle parole decorative
  const items = [];
  shoots.forEach((s, i) => {
    items.push({ label: s.titolo, href: `/viaggi/${s.slug}` });
    items.push({ label: marqueeExtras[i % marqueeExtras.length] });
  });
  const doppio = [...items, ...items];
  return (
    <div className="marquee border-y-2 border-ink py-3">
      {[0, 1].map((t) => (
        <div key={t} className="marquee-track" aria-hidden={t === 1}>
          {doppio.map((w, i) =>
            w.href ? (
              <Link
                key={`${t}-${i}`}
                href={w.href}
                className="px-6 text-sm font-semibold uppercase tracking-[0.2em] underline-offset-4 transition hover:text-terra hover:underline"
              >
                {w.label} <Star />
              </Link>
            ) : (
              <span
                key={`${t}-${i}`}
                className="px-6 text-sm font-semibold uppercase tracking-[0.2em] text-ink/60"
              >
                {w.label} <Star />
              </span>
            )
          )}
        </div>
      ))}
    </div>
  );
}

export default async function Home() {
  const shoots = await getShoots();
  return (
    <main>
      {/* HEADER */}
      <header className="flex items-center justify-between px-5 py-5 sm:px-8">
        <span className="text-sm font-bold uppercase tracking-[0.25em]">
          {site.nome} {site.cognome}
        </span>
        <nav className="flex gap-5 text-sm font-semibold uppercase tracking-wider">
          <a href="#viaggi" className="hover:text-terra">Viaggi</a>
          <a href="#chi" className="hover:text-terra">Chi sono</a>
          <a href="#contatti" className="hover:text-terra">Contatti</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="fade-up px-5 pb-10 pt-10 sm:px-8 sm:pt-16">
        <p className="font-serif-it text-lg text-terra sm:text-2xl">
          {site.ruolo}
        </p>
        <h1 className="mega mt-2">{site.nome}</h1>
        <p className="font-serif-it mt-6 max-w-md text-xl leading-snug sm:text-2xl">
          {site.tagline}
        </p>
      </section>

      <Marquee shoots={shoots} />

      {/* INDICE VIAGGI */}
      <section id="viaggi" className="scroll-mt-10 px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
            I viaggi
          </h2>
          <span className="font-serif-it text-terra">
            {shoots.length} racconti
          </span>
        </div>

        <div className="border-t-2 border-ink">
          {shoots.map((s, i) => (
            <Link
              key={s.slug}
              href={`/viaggi/${s.slug}`}
              className="index-row tap-feedback group relative flex items-baseline gap-4 border-b-2 border-ink py-6 transition sm:gap-8 sm:py-8"
            >
              <span className="font-serif-it w-10 shrink-0 text-terra sm:w-14 sm:text-lg">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="row-title text-3xl font-extrabold uppercase leading-none tracking-tight transition-all sm:text-6xl">
                {s.titolo}
              </span>
              {/* Miniatura inline su mobile/tablet (l'hover c'è solo da desktop) */}
              {s.cover && (
                <span className="relative ml-auto block h-16 w-14 shrink-0 self-center overflow-hidden border-2 border-ink lg:hidden">
                  <Image
                    src={s.cover}
                    alt=""
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                </span>
              )}
              <span className="hidden shrink-0 text-right text-xs uppercase tracking-wider text-ink/60 sm:block lg:ml-auto">
                {s.anno}
                <br />
                {s.foto.length} scatti
              </span>
              {/* Anteprima al passaggio */}
              <span className="row-img pointer-events-none absolute right-16 top-1/2 z-10 hidden h-44 w-36 -translate-y-1/2 overflow-hidden border-4 border-paper shadow-2xl lg:block">
                <Image
                  src={s.cover}
                  alt=""
                  fill
                  sizes="150px"
                  className="object-cover"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CHI SONO */}
      <section
        id="chi"
        className="scroll-mt-10 border-y-2 border-ink bg-paper-deep px-5 py-14 sm:px-8 sm:py-20"
      >
        <div className="grid gap-8 sm:grid-cols-[1fr_2fr]">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
            Chi sono
          </h2>
          <div className="max-w-xl space-y-4 text-lg leading-relaxed">
            {site.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="font-serif-it text-terra">
              — {site.nome}
            </p>
          </div>
        </div>
      </section>

      {/* CONTATTI */}
      <section
        id="contatti"
        className="scroll-mt-10 px-5 py-16 text-center sm:px-8 sm:py-24"
      >
        <p className="font-serif-it text-xl text-terra sm:text-2xl">
          Stampe, collaborazioni, commissioni
        </p>
        <a
          href={`mailto:${site.email}`}
          className="mega mt-4 inline-block break-all underline decoration-terra decoration-4 underline-offset-8 transition hover:text-terra sm:break-normal"
          style={{ fontSize: "clamp(1.6rem, 6vw, 5rem)" }}
        >
          scrivimi
        </a>
        <div className="mt-10 flex justify-center gap-6 text-sm font-semibold uppercase tracking-wider">
          <a href={site.instagram} className="hover:text-terra">
            Instagram
          </a>
          <a href={`mailto:${site.email}`} className="hover:text-terra">
            Email
          </a>
        </div>
      </section>

      <footer className="border-t-2 border-ink px-5 py-5 text-center text-xs uppercase tracking-wider text-ink/50">
        © {new Date().getFullYear()} {site.nome} {site.cognome} — tutte le foto
        sono protette da copyright
      </footer>
    </main>
  );
}
