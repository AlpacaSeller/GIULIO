import "./globals.css";
import { Syne, Fraunces } from "next/font/google";
import { site } from "@/lib/content";

// Syne: geometrico, da galleria d'arte — non il solito sans.
// Fraunces: serif espressivo per i corsivi. Insieme: editoriale indipendente.
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic", "normal"],
  variable: "--font-fraunces",
});

export const viewport = {
  themeColor: "#f3eee3",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(site.domain),
  title: `${site.nome} ${site.cognome} — ${site.ruolo}`.replace("  ", " "),
  description: `${site.tagline} Portfolio di fotografia di viaggio.`,
  openGraph: {
    title: `${site.nome} — ${site.ruolo}`,
    description: site.tagline,
    type: "website",
    locale: "it_IT",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${syne.variable} ${fraunces.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
