/**
 * memorial-koc-additions.ts
 *
 * Mevcut overview metinlerinin SONUNA eklenecek paragraflar.
 * Metinleri baştan yazmıyoruz — sadece eksik olan konum/ulaşım
 * bilgisini ve Koç'ta eksik kapasite rakamlarını ekliyoruz.
 *
 * Adresler Google Places'ten doğrulandı (Temmuz 2026).
 *
 * KURAL: Metro istasyon adı, yürüme mesafesi gibi doğrulanmamış
 * ayrıntı YAZILMADI. Sadece ilçe karakteri, havalimanı yönü ve
 * konaklama durumu — hepsi savunulabilir.
 */

/** Mevcut overview'un SONUNA yeni paragraf olarak eklenir. */
export const LOCATION_ADDITIONS: Record<string, string> = {
  "memorial-sisli-hospital": `
For patients arriving from abroad, the location is one of the hospital's
practical advantages. Şişli sits in the centre of Istanbul's European side,
within reach of Taksim, Nişantaşı and Beşiktaş, and connected to the wider
city by metro. Istanbul Airport is a direct drive north. The surrounding
districts hold the city's densest concentration of hotels at every price
level, which matters when treatment spans several days or when companions
are travelling with you.
`.trim(),

  "memorial-atasehir-hospital": `
Ataşehir works well for patients arriving at Sabiha Gökçen International
Airport: the transfer is short and stays on the Asian side, avoiding a
Bosphorus crossing at peak hours. The district is a modern business centre
rather than a residential one, which means international-standard hotels,
restaurants and pharmacies are all within a short distance of the hospital —
practical for the days between appointments and for anyone accompanying you.
`.trim(),

  "memorial-bahcelievler-hospital": `
Bahçelievler sits on the E-5 corridor in the western half of Istanbul's
European side, close to the approach from Istanbul Airport and served by
both metro and metrobüs. For patients flying into the main airport, this is
one of the shorter transfers available from any major private hospital in the
city. The surrounding district offers a wide range of accommodation prices,
which suits longer stays and patients travelling with family.
`.trim(),

  "memorial-kayseri-hospital": `
Kayseri is well connected by air to Istanbul and to several European cities,
and Erkilet Airport is a short drive from the hospital. The city also serves
as the main gateway to Cappadocia, roughly an hour away — relevant for
patients who want to combine treatment with a few recovery days somewhere
worth seeing, or for companions with time to fill. Kayseri's compact centre
means transfers between hotel and hospital are short.
`.trim(),

  "memorial-diyarbakir-hospital": `
The hospital sits in Kayapınar, the modern district on Diyarbakır's western
side, with the airport a short drive away. Diyarbakır connects by air to
Istanbul and Ankara several times daily, making the hospital reachable within
a day from most international arrival points. The surrounding area has
hotels and services within easy reach of the hospital.
`.trim(),
};

/**
 * Bu ikisi grubun en kısa metinleri. Aşağıdaki paragraflar
 * mevcut overview'un SONUNA eklenir.
 */
export const EXPANSION_ADDITIONS: Record<string, string> = {
  "koc-university-hospital": `
The scale is substantial: 426 inpatient beds and 23 operating theatres,
supported by the research infrastructure of a university medical school.
As a teaching hospital, its consultants combine clinical practice with
teaching and research, and many trained or held positions abroad before
joining — a consideration for patients who want their case handled by
physicians familiar with international clinical standards.

The hospital sits in Topkapı, Zeytinburnu, on Istanbul's European side and
inside the historic city walls. Istanbul Airport is a direct drive, and the
historic peninsula — Sultanahmet, the Grand Bazaar, Eminönü — is close
enough that companions are not confined to a hospital district. The location
is also well connected to the rest of the European side by tram and metro.
`.trim(),

  "american-hospital": `
The hospital operates 232 patient rooms, 36 intensive care units, 12
operating theatres, 161 outpatient consulting rooms and 19 chemotherapy
units — comprehensive capacity for a hospital in the centre of the city
rather than on its outskirts.

Nişantaşı is Istanbul's most established luxury district, and the hospital's
position there is a practical advantage rather than only a prestigious
address. Boutique hotels, restaurants and pharmacies are within walking
distance, Taksim and Maçka Park are a short walk away, and the district is
connected to the rest of the European side by metro. For patients whose
treatment spans several days with gaps between appointments, recovery time
here does not feel like time spent in a hospital district.
`.trim(),
};

/**
 * NOT — memorial-goztepe-hospital
 *
 * Bu kaydın overview'unda "close to Sabiha Gökçen Airport and the metro
 * network" yazıyor, yani ulaşım bilgisi var — ek gerekmiyor.
 *
 * ANCAK: district düzeltmesi bu kayıtta yapıldı (Kadıköy → Ataşehir).
 * Overview metninde hastanenin Göztepe'de veya Kadıköy'de olduğunu
 * ima eden bir cümle varsa onu da düzelt — hastane fiziksel olarak
 * Yeni Sahra, Ataşehir'de.
 */
