# Giulio — Portfolio fotografo di viaggio

Sito Next.js stile "carta editoriale": fondo crema, tipografia gigante (Syne + Fraunces), indice viaggi con anteprima al passaggio, gallerie masonry.

## Demo → reale

1. `lib/content.js` → nome completo, email, Instagram, dominio
2. `lib/shoots.js` → le foto ora sono segnaposto (picsum.photos). Per quelle vere:
   - metti i file in `public/shoots/<slug>/01.jpg, 02.jpg...` (esporta max 1600px lato lungo, qualità 80 — pesano poco e bastano)
   - sostituisci `src` con `"/shoots/<slug>/01.jpg"` e aggiorna `w`/`h` con le proporzioni reali
   - rimuovi `remotePatterns` da `next.config.mjs`
3. Aggiungere un viaggio = copiare un blocco in `lib/shoots.js`. Niente CMS: per un fotografo che aggiorna 2-3 volte l'anno è la soluzione più semplice e a costo zero (eventuale CMS = upsell futuro).

## Attivare l'admin (gestione autonoma viaggi/foto)

Senza configurazione il sito mostra i dati demo di `lib/shoots.js` e `/admin` resta disattivato. Per attivarlo (5 minuti):

1. Crea un progetto su supabase.com (free tier)
2. SQL Editor → incolla ed esegui `supabase/setup.sql`
3. Authentication → Users → Add user → email/password per Giulio
4. Project Settings → API → copia URL e anon key
5. Su Vercel (o in `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
6. Redeploy. Da `/admin` Giulio può: creare/eliminare viaggi, caricare foto (anche multiple), eliminarle. Il sito si aggiorna da solo entro 60 secondi (ISR).

Appena nel database c'è almeno un viaggio, i dati demo spariscono automaticamente.

## Sviluppo e deploy

```bash
npm install
npm run dev      # http://localhost:3000
```

Deploy: repo GitHub → Vercel → Add New Project (zero config). Dominio cliente quando firmato il preventivo.

## Upsell possibili (per il preventivo)

- Vendita stampe (Stripe)
- Sezione "su commissione" con pacchetti
- CMS (Sanity/Contentful) se vuole autonomia totale
- Versione inglese
