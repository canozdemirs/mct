// Case- and Turkish-diacritic-insensitive text folding for the Patients
// list search box. Deliberately NOT done via Postgres ilike -- standard
// Postgres collation doesn't fold Turkish's dotless ı to i (or İ/I the
// other way), so an admin typing plain ASCII wouldn't match an accented
// name. Folding happens here, in JS, on both the search term and each
// candidate field, then matched with a plain substring check.
export function foldSearchText(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}
