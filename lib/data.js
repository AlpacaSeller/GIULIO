import { supabase } from "@/lib/supabase";
import { shoots as shootsStatici, getShoot as getShootStatico } from "@/lib/shoots";

// Strato dati unico: Supabase se configurato, altrimenti lib/shoots.js.
// Le pagine non sanno da dove arrivano i dati.

function mappaShoot(row) {
  const foto = (row.photos ?? [])
    .sort((a, b) => a.ordine - b.ordine)
    .map((p) => ({ src: p.url, w: p.w || 1200, h: p.h || 900 }));
  return {
    slug: row.slug,
    titolo: row.titolo,
    sottotitolo: row.sottotitolo ?? "",
    anno: row.anno ?? "",
    luoghi: row.luoghi ?? "",
    racconto: row.racconto ?? "",
    cover: foto[0]?.src ?? "",
    foto,
  };
}

export async function getShoots() {
  if (!supabase) return shootsStatici;
  const { data, error } = await supabase
    .from("shoots")
    .select("*, photos(*)")
    .order("ordine", { ascending: true });
  if (error || !data?.length) return shootsStatici;
  return data.map(mappaShoot);
}

export async function getShoot(slug) {
  if (!supabase) return getShootStatico(slug);
  const { data, error } = await supabase
    .from("shoots")
    .select("*, photos(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return getShootStatico(slug);
  return mappaShoot(data);
}
