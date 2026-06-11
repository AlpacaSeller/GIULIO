import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/content";
import { shoots as shootsStatici } from "@/lib/shoots";
import { getShoots, getShoot } from "@/lib/data";

// I contenuti possono cambiare dall'admin: rigenera ogni 60s,
// e accetta slug nuovi non presenti al momento della build
export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  return shootsStatici.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const shoot = await getShoot(slug);
  if (!shoot) return {};
  return {
    title: `${shoot.titolo} ${shoot.anno} — ${site.nome} ${site.cognome}`,
    description: shoot.racconto,
  };
}

export default async function ShootPage({ params }) {
  const { slug } = await params;
  const shoot = await getShoot(slug);
  if (!shoot) notFound();

  const tutti = await getShoots();
  const idx = tutti.findIndex((s) => s.slug === slug);
  const next = tutti[(idx + 1) % tutti.length] ?? shoot;

  return (
    <main>
      <header className="flex items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="text-sm font-bold uppercase tracking-[0.25em] hover:text-terra"
        >
          {site.nome} {site.cognome}
        </Link>
        <Link
          href="/#viaggi"
          className="text-sm font-semibold uppercase tracking-wider hover:text-terra"
        >
          ← Tutti i viaggi
        </Link>
      </header>

      {/* INTESTAZIONE */}
      <section className="fade-up border-b-2 border-ink px-5 pb-10 pt-6 sm:px-8">
        <p className="font-serif-it text-terra sm:text-lg">
          {String(idx + 1).padStart(2, "0")} / {shoot.anno} · {shoot.luoghi}
        </p>
        <h1 className="mega mt-2">{shoot.titolo}</h1>
        <p className="font-serif-it mt-4 text-xl sm:text-2xl">
          {shoot.sottotitolo}
        </p>
        <p className="mt-6 max-w-xl text-lg leading-relaxed">
          {shoot.racconto}
        </p>
      </section>

      {/* GALLERIA */}
      <section className="px-5 py-10 sm:px-8 sm:py-14">
        <div className="masonry">
          {shoot.foto.map((f, i) => (
            <Reveal key={f.src} delay={(i % 3) * 70}>
              <figure className="group relative overflow-hidden">
                <Image
                  src={f.src}
                  alt={`${shoot.titolo} — scatto ${i + 1}`}
                  width={f.w}
                  height={f.h}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-auto w-full transition duration-500 group-hover:scale-[1.02]"
                  loading={i < 3 ? "eager" : "lazy"}
                />
                {/* Didascalia: sempre visibile su telefono, in hover su desktop */}
                <figcaption className="font-serif-it absolute bottom-2 right-3 text-sm text-paper [text-shadow:0_1px_4px_rgba(0,0,0,0.5)] md:opacity-0 md:transition md:group-hover:opacity-100">
                  {shoot.titolo} · {String(i + 1).padStart(2, "0")}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROSSIMO VIAGGIO */}
      <section className="border-t-2 border-ink px-5 py-14 text-center sm:px-8">
        <p className="font-serif-it text-terra">prossimo viaggio</p>
        <Link
          href={`/viaggi/${next.slug}`}
          className="mega mt-2 inline-block transition hover:text-terra"
          style={{ fontSize: "clamp(2.5rem, 9vw, 7rem)" }}
        >
          {next.titolo} →
        </Link>
      </section>

      <footer className="border-t-2 border-ink px-5 py-5 text-center text-xs uppercase tracking-wider text-ink/50">
        © {new Date().getFullYear()} {site.nome} {site.cognome} — tutte le foto
        sono protette da copyright
      </footer>
    </main>
  );
}
