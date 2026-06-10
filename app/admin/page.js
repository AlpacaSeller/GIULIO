"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, supabaseAttivo } from "@/lib/supabase";

// ============================================================
// ADMIN — gestione viaggi e foto.
// Richiede Supabase configurato (vedi README e supabase/setup.sql).
// Login: utente creato in Supabase > Authentication > Users.
// ============================================================

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const inputCls =
  "w-full border-2 border-ink bg-paper px-3 py-2.5 text-sm outline-none focus:border-terra";
const btnCls =
  "border-2 border-ink bg-ink px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-paper transition hover:bg-terra hover:border-terra disabled:opacity-40";

export default function AdminPage() {
  const [sessione, setSessione] = useState(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setPronto(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSessione(data.session);
      setPronto(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSessione(s)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!supabaseAttivo)
    return (
      <Guscio>
        <h1 className="text-2xl font-extrabold uppercase">Admin</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed">
          L'area admin non è ancora attiva: manca la configurazione del
          database. Chi gestisce il sito deve seguire la sezione "Attivare
          l'admin" nel README (5 minuti).
        </p>
      </Guscio>
    );

  if (!pronto) return <Guscio>Caricamento...</Guscio>;
  if (!sessione) return <Login />;
  return <Pannello onLogout={() => supabase.auth.signOut()} />;
}

function Guscio({ children }) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <a href="/" className="text-xs font-bold uppercase tracking-widest hover:text-terra">
        ← Torna al sito
      </a>
      <div className="mt-6">{children}</div>
    </main>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState("");

  const entra = async (e) => {
    e.preventDefault();
    setErrore("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setErrore("Credenziali non valide.");
  };

  return (
    <Guscio>
      <h1 className="text-2xl font-extrabold uppercase">Area riservata</h1>
      <form onSubmit={entra} className="mt-6 max-w-xs space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
          required
        />
        {errore && <p className="text-sm font-bold text-terra">{errore}</p>}
        <button type="submit" className={btnCls}>
          Entra
        </button>
      </form>
    </Guscio>
  );
}

function Pannello({ onLogout }) {
  const [viaggi, setViaggi] = useState([]);
  const [aperto, setAperto] = useState(null); // shoot selezionato
  const [msg, setMsg] = useState("");

  const carica = useCallback(async () => {
    const { data } = await supabase
      .from("shoots")
      .select("*, photos(*)")
      .order("ordine");
    setViaggi(data ?? []);
  }, []);

  useEffect(() => {
    carica();
  }, [carica]);

  const avvisa = (t) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 3500);
  };

  // --- crea viaggio ---
  const crea = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const titolo = f.get("titolo");
    const { error } = await supabase.from("shoots").insert({
      slug: slugify(titolo),
      titolo,
      sottotitolo: f.get("sottotitolo"),
      anno: f.get("anno"),
      luoghi: f.get("luoghi"),
      racconto: f.get("racconto"),
      ordine: viaggi.length,
    });
    if (error) return avvisa("Errore: " + error.message);
    e.target.reset();
    avvisa("Viaggio creato ✓");
    carica();
  };

  // --- elimina viaggio (e relative foto da storage) ---
  const eliminaViaggio = async (v) => {
    if (!confirm(`Eliminare "${v.titolo}" e tutte le sue foto?`)) return;
    const percorsi = (v.photos ?? []).map((p) => p.path).filter(Boolean);
    if (percorsi.length) await supabase.storage.from("foto").remove(percorsi);
    await supabase.from("shoots").delete().eq("id", v.id);
    avvisa("Viaggio eliminato");
    setAperto(null);
    carica();
  };

  // --- upload foto ---
  const caricaFoto = async (v, files) => {
    for (const file of files) {
      const path = `${v.slug}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { error: e1 } = await supabase.storage
        .from("foto")
        .upload(path, file);
      if (e1) {
        avvisa("Errore upload: " + e1.message);
        continue;
      }
      const { data: pub } = supabase.storage.from("foto").getPublicUrl(path);
      // dimensioni reali per il layout masonry
      const dims = await new Promise((res) => {
        const img = new window.Image();
        img.onload = () => res({ w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = () => res({ w: 1200, h: 900 });
        img.src = URL.createObjectURL(file);
      });
      await supabase.from("photos").insert({
        shoot_id: v.id,
        url: pub.publicUrl,
        path,
        w: dims.w,
        h: dims.h,
        ordine: (v.photos?.length ?? 0) + 1,
      });
    }
    avvisa("Foto caricate ✓");
    carica();
  };

  const eliminaFoto = async (p) => {
    if (p.path) await supabase.storage.from("foto").remove([p.path]);
    await supabase.from("photos").delete().eq("id", p.id);
    avvisa("Foto eliminata");
    carica();
  };

  const sel = viaggi.find((v) => v.id === aperto);

  return (
    <Guscio>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold uppercase">I tuoi viaggi</h1>
        <button onClick={onLogout} className="text-xs font-bold uppercase tracking-widest hover:text-terra">
          Esci
        </button>
      </div>

      {msg && (
        <p className="mt-4 border-2 border-ink bg-paper-deep px-3 py-2 text-sm font-bold">
          {msg}
        </p>
      )}

      {/* Lista viaggi */}
      <div className="mt-6 space-y-2">
        {viaggi.map((v) => (
          <div key={v.id} className="flex items-center gap-3 border-2 border-ink px-4 py-3">
            <button
              onClick={() => setAperto(aperto === v.id ? null : v.id)}
              className="flex-1 text-left font-bold uppercase hover:text-terra"
            >
              {v.titolo}{" "}
              <span className="text-xs font-normal normal-case text-ink/50">
                · {v.photos?.length ?? 0} foto
              </span>
            </button>
            <button
              onClick={() => eliminaViaggio(v)}
              className="text-xs font-bold uppercase text-terra hover:underline"
            >
              Elimina
            </button>
          </div>
        ))}
        {!viaggi.length && (
          <p className="text-sm text-ink/60">
            Nessun viaggio nel database: il sito sta mostrando i contenuti demo.
            Crea il primo viaggio qui sotto.
          </p>
        )}
      </div>

      {/* Dettaglio viaggio selezionato: foto */}
      {sel && (
        <div className="mt-6 border-2 border-ink p-4">
          <h2 className="font-extrabold uppercase">{sel.titolo} — foto</h2>
          <label className="mt-3 block">
            <span className="text-xs font-bold uppercase tracking-wider">
              Aggiungi foto (puoi selezionarne più di una)
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => caricaFoto(sel, Array.from(e.target.files))}
              className="mt-2 block w-full text-sm file:mr-3 file:border-2 file:border-ink file:bg-ink file:px-3 file:py-2 file:text-xs file:font-bold file:uppercase file:text-paper"
            />
          </label>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {(sel.photos ?? [])
              .sort((a, b) => a.ordine - b.ordine)
              .map((p) => (
                <div key={p.id} className="group relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    onClick={() => eliminaFoto(p)}
                    className="absolute inset-x-0 bottom-0 bg-ink/80 py-1 text-[10px] font-bold uppercase text-paper opacity-0 transition group-hover:opacity-100"
                  >
                    Elimina
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Nuovo viaggio */}
      <form onSubmit={crea} className="mt-8 space-y-3 border-2 border-ink p-4">
        <h2 className="font-extrabold uppercase">Nuovo viaggio</h2>
        <input name="titolo" placeholder="Titolo (es. Portogallo)" className={inputCls} required />
        <input name="sottotitolo" placeholder="Sottotitolo (es. Atlantico e azulejos)" className={inputCls} />
        <div className="flex gap-3">
          <input name="anno" placeholder="Anno" className={inputCls} />
          <input name="luoghi" placeholder="Luoghi (es. Lisbona · Porto)" className={inputCls} />
        </div>
        <textarea name="racconto" placeholder="Racconto breve del viaggio" rows={3} className={inputCls} />
        <button type="submit" className={btnCls}>
          Crea viaggio
        </button>
      </form>
    </Guscio>
  );
}
