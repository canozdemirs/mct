// Title-cases a person's name, Turkish-locale aware — "can özdemir" -> "Can
// Özdemir", "İSMAİL ŞAHİN" -> "İsmail Şahin". Uses toLocaleUpperCase/
// toLocaleLowerCase('tr-TR') specifically because plain JS case conversion
// gets the dotted İ/i vs dotless I/ı distinction wrong for Turkish text.
export function formatPersonName(raw: string): string {
  return raw
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const first = word.slice(0, 1).toLocaleUpperCase("tr-TR");
      const rest = word.slice(1).toLocaleLowerCase("tr-TR");
      return first + rest;
    })
    .join(" ");
}
