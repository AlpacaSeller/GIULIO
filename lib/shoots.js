// ============================================================
// I VIAGGI (shoot). Per aggiungerne uno: copia un blocco.
//
// FOTO DEMO: ora usano picsum.photos (segnaposto realistici).
// FOTO REALI: metti i file in /public/shoots/<slug>/01.jpg, 02.jpg...
// e sostituisci src con "/shoots/<slug>/01.jpg". Poi rimuovi
// remotePatterns da next.config.mjs.
// ============================================================

// Genera URL segnaposto con proporzioni miste (verticali/orizzontali)
const ph = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const shoots = [
  {
    slug: "marocco",
    titolo: "Marocco",
    sottotitolo: "Polvere rossa e tè alla menta",
    anno: "2024",
    luoghi: "Marrakech · Atlante · Merzouga",
    racconto:
      "Dieci giorni dal caos dei souk al silenzio assoluto delle dune. Il Marocco è un paese che si fotografa da solo: tu devi solo arrivare puntuale alla luce giusta.",
    cover: ph("marocco1", 1200, 1500),
    foto: [
      { src: ph("marocco1", 1200, 1500), w: 1200, h: 1500 },
      { src: ph("marocco2", 1200, 800), w: 1200, h: 800 },
      { src: ph("marocco3", 1200, 1500), w: 1200, h: 1500 },
      { src: ph("marocco4", 1200, 900), w: 1200, h: 900 },
      { src: ph("marocco5", 1200, 1600), w: 1200, h: 1600 },
      { src: ph("marocco6", 1200, 800), w: 1200, h: 800 },
      { src: ph("marocco7", 1200, 1400), w: 1200, h: 1400 },
      { src: ph("marocco8", 1200, 900), w: 1200, h: 900 },
    ],
  },
  {
    slug: "islanda",
    titolo: "Islanda",
    sottotitolo: "La fine del mondo, andata e ritorno",
    anno: "2023",
    luoghi: "Ring Road · Vestrahorn · Highlands",
    racconto:
      "Un'isola dove il meteo cambia idea ogni venti minuti e ogni curva è una scenografia. Ho guidato 2.800 km per capire che la foto migliore era sempre quella dopo.",
    cover: ph("islanda1", 1200, 800),
    foto: [
      { src: ph("islanda1", 1200, 800), w: 1200, h: 800 },
      { src: ph("islanda2", 1200, 1500), w: 1200, h: 1500 },
      { src: ph("islanda3", 1200, 900), w: 1200, h: 900 },
      { src: ph("islanda4", 1200, 1400), w: 1200, h: 1400 },
      { src: ph("islanda5", 1200, 800), w: 1200, h: 800 },
      { src: ph("islanda6", 1200, 1600), w: 1200, h: 1600 },
      { src: ph("islanda7", 1200, 900), w: 1200, h: 900 },
      { src: ph("islanda8", 1200, 1500), w: 1200, h: 1500 },
    ],
  },
  {
    slug: "vietnam",
    titolo: "Vietnam",
    sottotitolo: "Motorini, nebbia e pho alle sette",
    anno: "2025",
    luoghi: "Hanoi · Ha Giang Loop · Hoi An",
    racconto:
      "Il nord del Vietnam in motorino: quattro giorni di tornanti nella nebbia, risaie verticali e bambini che salutano chiunque passi. Mai sviluppato così tanti rullini.",
    cover: ph("vietnam1", 1200, 1500),
    foto: [
      { src: ph("vietnam1", 1200, 1500), w: 1200, h: 1500 },
      { src: ph("vietnam2", 1200, 800), w: 1200, h: 800 },
      { src: ph("vietnam3", 1200, 1400), w: 1200, h: 1400 },
      { src: ph("vietnam4", 1200, 900), w: 1200, h: 900 },
      { src: ph("vietnam5", 1200, 1500), w: 1200, h: 1500 },
      { src: ph("vietnam6", 1200, 800), w: 1200, h: 800 },
      { src: ph("vietnam7", 1200, 1600), w: 1200, h: 1600 },
      { src: ph("vietnam8", 1200, 900), w: 1200, h: 900 },
    ],
  },
  {
    slug: "andalusia",
    titolo: "Andalusia",
    sottotitolo: "Bianco calce, ombra netta",
    anno: "2022",
    luoghi: "Siviglia · Ronda · Cadice",
    racconto:
      "Il viaggio che mi ha insegnato a fotografare il mezzogiorno: quando tutti rientrano per il caldo, le ombre diventano geometrie e i paesi bianchi diventano carta millimetrata.",
    cover: ph("andalusia1", 1200, 900),
    foto: [
      { src: ph("andalusia1", 1200, 900), w: 1200, h: 900 },
      { src: ph("andalusia2", 1200, 1500), w: 1200, h: 1500 },
      { src: ph("andalusia3", 1200, 800), w: 1200, h: 800 },
      { src: ph("andalusia4", 1200, 1400), w: 1200, h: 1400 },
      { src: ph("andalusia5", 1200, 900), w: 1200, h: 900 },
      { src: ph("andalusia6", 1200, 1500), w: 1200, h: 1500 },
    ],
  },
  {
    slug: "giappone",
    titolo: "Giappone",
    sottotitolo: "Neon e silenzio",
    anno: "2025",
    luoghi: "Tokyo · Kyoto · Osaka",
    racconto:
      "Due settimane tra il rumore assoluto di Shibuya e il silenzio dei templi alle sei del mattino. Il Giappone è il paese dei contrasti perfetti: o fotografi tutto, o niente.",
    cover: ph("giappone1", 1200, 1600),
    foto: [
      { src: ph("giappone1", 1200, 1600), w: 1200, h: 1600 },
      { src: ph("giappone2", 1200, 800), w: 1200, h: 800 },
      { src: ph("giappone3", 1200, 1500), w: 1200, h: 1500 },
      { src: ph("giappone4", 1200, 900), w: 1200, h: 900 },
      { src: ph("giappone5", 1200, 1400), w: 1200, h: 1400 },
      { src: ph("giappone6", 1200, 800), w: 1200, h: 800 },
      { src: ph("giappone7", 1200, 1500), w: 1200, h: 1500 },
      { src: ph("giappone8", 1200, 900), w: 1200, h: 900 },
      { src: ph("giappone9", 1200, 1600), w: 1200, h: 1600 },
    ],
  },
];

export function getShoot(slug) {
  return shoots.find((s) => s.slug === slug);
}
