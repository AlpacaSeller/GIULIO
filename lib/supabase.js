import { createClient } from "@supabase/supabase-js";

// Client Supabase: esiste solo se le env sono configurate.
// Senza env il sito usa i dati statici di lib/shoots.js (modalità demo).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;
export const supabaseAttivo = Boolean(supabase);
