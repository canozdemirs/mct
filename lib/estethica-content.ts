// Estethica — content for the single remaining Estethica hospital (Ataşehir).
// The other former Estethica locations (İncirli, Bakırköy, Levent) have been sold /
// are no longer part of the group — only Estethica Ataşehir remains active.
// Sourced from estethica.com.tr (official site).

export const estheticaGroupDescription =
  "estethica is a Turkish aesthetic surgery and hair transplant hospital group, operating " +
  "under the ethical-care motto 'Sağlıklı Güzellik' (Healthy Beauty) since 2008. Known as one " +
  "of the world's leading aesthetic surgery hospitals, estethica specializes in plastic and " +
  "reconstructive surgery, hair transplantation, cosmetic dermatology, dental aesthetics, and " +
  "weight-loss and healthy-living programs, following Turkish Ministry of Health SKS-Hastane " +
  "quality accreditation standards.";

export const ESTETHICA_LANGUAGES = ["Turkish", "English", "Arabic"];

export const ESTETHICA_TREATMENT_UNITS = [
  "Plastic, Reconstructive and Aesthetic Surgery",
  "Hair Transplantation and Hair Health Clinic",
  "Oral and Dental Health Clinic",
  "Cosmetic Dermatology Clinic",
  "Healthy Living and Nutrition Clinic",
  "Weight Loss Clinic",
];

export interface EstheticaHospitalContent {
  slug: string;
  overview: string;
  area?: string;
  accreditations: string[];
  languages: string[];
  treatmentUnits: string[];
  mapEmbedUrl: string;
  address: string;
}

export const estheticaHospitals: EstheticaHospitalContent[] = [
  {
    slug: "estethica",
    overview:
      "estethica Ataşehir is the group's flagship and now only remaining hospital, located in the Küçükbakkalköy district on Istanbul's Anatolian side. Operating since 2008 under the 'Sağlıklı Güzellik' (Healthy Beauty) philosophy, the hospital was the first Turkish aesthetic-surgery hospital to be graded A+ by the Turkish government and has received over 100 awards. It follows Turkish Ministry of Health SKS-Hastane quality standards across patient care, medication management, infection control, operating rooms, and intensive care. The hospital offers a virtual 360° tour and hosts dedicated patient rooms designed around a 'world cities' concept, along with modern operating rooms serving its plastic surgery, hair transplant, dental, dermatology, and weight-loss patients.",
    accreditations: ["JCI", "ISO", "TUV SUD"],
    languages: ESTETHICA_LANGUAGES,
    treatmentUnits: ESTETHICA_TREATMENT_UNITS,
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d43608.90021857418!2d29.033902150871715!3d40.98503240000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac63ca74b4dc5%3A0x3c0ea5b0da9d7027!2sestethica%20Ata%C5%9Fehir%20%7C%20Sa%C3%A7%20Ekimi%20ve%20Plastik%20Cerrahi%20Hastanesi!5e1!3m2!1str!2sbe!4v1763139578228!5m2!1str!2sbe",
    address: "Küçükbakkalköy Mah. Işıklar Cad. No: 28, Ataşehir / İstanbul",
  },
];
