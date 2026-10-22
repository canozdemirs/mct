// Case- and Turkish-diacritic-insensitive folding for the Patients list
// search box. Only the search TERM is folded here -- the searchable
// text itself lives in leads.search_text, a generated column populated
// by the SQL twin of this exact function (fold_search_text(), see
// supabase/migrations/leads_search.sql). Both must stay byte-for-byte
// equivalent, which is why this uses the same explicit character
// mapping (translate-style) rather than Unicode NFD normalization: the
// Postgres side needs an IMMUTABLE, index-safe function with no
// extension dependency, so matching that exactly here (instead of two
// different-but-"equivalent" implementations) is what keeps a JS-folded
// query term guaranteed to match a SQL-folded column.
const FROM = "İIıŞşĞğÜüÖöÇç";
const TO = "iiisSgGuUoOcC";
const FOLD_MAP = new Map(Array.from(FROM).map((ch, i) => [ch, TO[i]]));

export function foldSearchText(value: string): string {
  let out = "";
  for (const ch of value) {
    out += FOLD_MAP.get(ch) ?? ch;
  }
  return out.toLowerCase();
}
