// ============================================================
// MEMORIAL — filled content for lib/hospitals.ts (v2, verified)
// Facts verified against Memorial's own current sites
// (memorial.com.tr/en + memorialhospitalsgroup.com), July 2026.
// Overviews rewritten in clean English. Slugs unchanged (SEO).
// No hospital phone/website anywhere — all contact via MCT.
// ============================================================

// --- Group description (replace the TODO in hospitalGroups.memorial) ---

export const memorialGroupDescription =
  "Memorial Healthcare Group opened its first hospital, Memorial Şişli, in February 2000 and has since grown into one of Turkey's leading private hospital networks, with more than 1,300 physicians — over 700 holding academic titles — and 7,300+ healthcare professionals. Memorial Şişli was the first hospital in Turkey, and the 21st in the world, to earn JCI (Joint Commission International) accreditation, and the group is internationally recognized in organ transplantation, IVF, oncology, cardiology, and cardiovascular surgery.";

// --- Shared constants for Memorial hospitals ---
// DEFAULT_FREE_SERVICES already exists in hospitals.ts.

export const MEMORIAL_LANGUAGES = [
  "English",
  "Arabic",
  "French",
  "German",
  "Greek",
  "Romanian",
  "Russian",
  "Swedish",
  "Turkish",
];

export const MEMORIAL_TREATMENT_UNITS = [
  "Allergy & Immunology",
  "Anesthesiology and Reanimation",
  "Audiology",
  "Cardiology",
  "Cardiovascular Surgery",
  "Check-Up",
  "Clinical Laboratories",
  "Dermatology",
  "Ear, Nose and Throat",
  "Emergency Service",
  "Endocrinology",
  "Gastroenterology",
  "General Surgery",
  "Hematology",
  "Infectious Diseases",
  "Intensive Care Units (General, Coronary, Neonatal)",
  "Internal Medicine",
  "IVF",
  "Medical Oncology",
  "Nephrology",
  "Neurology",
  "Neurosurgery",
  "Nuclear Medicine",
  "Nutrition and Diet",
  "Obstetrics and Gynaecology",
  "Ophthalmology",
  "Oral and Dental Health",
  "Orthopedics and Traumatology",
  "Pain Management",
  "Pathology",
  "Pediatric Surgery",
  "Pediatrics",
  "Physiotherapy and Rehabilitation",
  "Plastic and Reconstructive Surgery",
  "Psychiatry",
  "Psychology",
  "Pulmonary Medicine",
  "Radiation Oncology",
  "Radiology and Medical Imaging",
  "Rheumatology",
  "Sleep Disorders Lab",
  "Speech and Language Pathology",
  "Thoracic Surgery",
  "Urology",
  "Vascular Surgery",
];

// --- The 9 Memorial hospital entries ---
// 8 replace the existing placeholders; memorial-goztepe-hospital is NEW
// (no old WordPress page, so no redirect needed — it's a brand-new URL).
// Accreditations policy: only what Memorial currently claims on its own
// sites is listed. JCI: Şişli, Ankara, Bahçelievler, Antalya. The old MCT
// pages also claimed JCI for Ataşehir, Diyarbakır, Dicle — removed here
// pending written confirmation from Memorial.

export const memorialHospitals: Hospital[] = [
  {
    slug: "memorial-sisli-hospital",
    name: "Memorial Şişli Hospital",
    group: "memorial",
    city: "Istanbul",
    district: "Şişli",
    accreditations: ["JCI", "ISO"],
    beds: 252,
    operatingRooms: 13,
    area: "53,000 m²",
    overview:
      "Memorial Şişli Hospital is the flagship of Memorial Healthcare Group. Planned from 1996 with the support of ECRI, one of the leading hospital consultancy firms in the United States, it welcomed its first patient in February 2000 on the European side of Istanbul. Just two years later it became the first hospital in Turkey — and the 21st in the world — to receive JCI (Joint Commission International) accreditation, setting a new benchmark for healthcare quality in the country.\n\nOperating on a 53,000 m² closed area, the hospital serves with a 252-bed capacity, 13 operating rooms, four intensive care units (cardiovascular surgery, general, coronary, and neonatal), and three laboratories. Its specialized centers include the Organ Transplantation Center, IVF and Genetics Center, Stroke Center, Breast Health Center, Oncology Center, da Vinci Robotic Surgery Center, and Bone Marrow Transplant Center. Today Memorial Şişli is an international reference hospital receiving patients from 167 countries.",
    languages: MEMORIAL_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: MEMORIAL_TREATMENT_UNITS,
    mapEmbedUrl: "https://maps.google.com/maps?q=41.061527,28.972632&z=14&output=embed",
    images: [
      "/images/hospitals/memorial-sisli/1.jpg",
      "/images/hospitals/memorial-sisli/2.jpg",
      "/images/hospitals/memorial-sisli/3.jpg",
      "/images/hospitals/memorial-sisli/4.jpg",
    ],
  },
  {
    slug: "memorial-atasehir-hospital",
    name: "Memorial Ataşehir Hospital",
    group: "memorial",
    city: "Istanbul",
    district: "Ataşehir",
    accreditations: [], // JCI claim on old site not confirmed on Memorial's current pages — verify before adding
    beds: 144,
    operatingRooms: null, // not published by Memorial — confirm directly if needed
    area: "22,000 m²",
    overview:
      "Memorial Ataşehir Hospital, opened in 2010, brings Memorial Healthcare Group's international standards to the Anatolian side of Istanbul. The hospital was designed down to the smallest detail — modern architecture, advanced medical technology, and comfortable patient rooms — so that patients feel both special and safe, and it operates around the clock in every specialty.\n\nSet on a 22,000 m² campus with a 144-bed capacity, the hospital is particularly strong in cardiovascular surgery, organ transplantation, medical oncology, da Vinci robotic surgery, and IVF, serving as Memorial's IVF treatment base on the Anatolian side. Its Organ Transplant Center performs liver and kidney transplants with success rates above the world average, and the facility includes Coronary, General, Cardiovascular Surgery, and Neonatal intensive care units, a coronary angiography service, and MR and CT rooms designed with ambient technology to keep patients relaxed during imaging.",
    languages: MEMORIAL_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: MEMORIAL_TREATMENT_UNITS,
    mapEmbedUrl: "https://maps.google.com/maps?q=40.984375,29.106864&z=14&output=embed",
    images: [
      "/images/hospitals/memorial-atasehir/1.jpg",
      "/images/hospitals/memorial-atasehir/2.jpg",
      "/images/hospitals/memorial-atasehir/3.jpg",
      "/images/hospitals/memorial-atasehir/4.jpg",
    ],
  },
  {
    slug: "memorial-bahcelievler-hospital",
    name: "Memorial Bahçelievler Hospital",
    group: "memorial",
    city: "Istanbul",
    district: "Bahçelievler",
    accreditations: ["JCI", "LEED Platinum"],
    beds: 320,
    operatingRooms: 15,
    area: "72,000 m²",
    overview:
      "Memorial Bahçelievler Hospital, the 11th hospital of Memorial Healthcare Group, opened in February 2018 as one of the most comprehensive health complexes in the world. It holds the prestigious LEED Platinum certificate for energy-efficient, environmentally friendly design — awarded only to leading green buildings worldwide — and was designed as one of the finest examples of contemporary hospital architecture, where the healing influence of nature and art is built into the patient experience.\n\nServing on a 72,000 m² campus that includes 8,000 m² of green space, the hospital offers a 320-bed capacity, 15 operating theaters — one of them a hybrid operating room — 49 intensive care beds, 31 medical observation rooms, and 135 outpatient clinics. Its technology includes the Elekta Versa HD Signature radiotherapy system for cancer treatment, da Vinci robotic surgery, 3 Tesla MRI, dual-energy CT, and PET-CT, and its intensive care units were the first in Turkey to feature fixed patient-lift systems in every room.",
    languages: MEMORIAL_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: MEMORIAL_TREATMENT_UNITS,
    mapEmbedUrl: "https://maps.google.com/maps?q=40.993097,28.852337&z=14&output=embed",
    images: [
      "/images/hospitals/memorial-bahcelievler/1.jpg",
      "/images/hospitals/memorial-bahcelievler/2.jpg",
      "/images/hospitals/memorial-bahcelievler/3.jpg",
      "/images/hospitals/memorial-bahcelievler/4.jpg",
    ],
  },
  {
    slug: "memorial-goztepe-hospital",
    name: "Memorial Göztepe Hospital",
    group: "memorial",
    city: "Istanbul",
    district: "Göztepe",
    accreditations: [], // newly opened — no accreditation published yet; add when Memorial announces
    beds: 300,
    operatingRooms: 19,
    area: "81,000 m²",
    overview:
      "Memorial Göztepe Hospital is the newest member of Memorial Healthcare Group, opened in November 2025 as the group's 13th hospital and one of the largest health investments on the Anatolian side of Istanbul. Built from the ground up as an eco-friendly, energy-efficient project that integrates art and architecture into the healing environment, it was designed to set a new standard of care for Istanbul and the wider region, with excellent transport access close to Sabiha Gökçen Airport and the metro network.\n\nSpanning an 81,000 m² closed area, the hospital offers a capacity of more than 300 beds, 19 operating theaters including hybrid operating rooms, 55 intensive care beds, and 127 outpatient clinics. Its hybrid operating rooms are equipped with advanced imaging systems that allow surgeons to perform complex cardiac, neurosurgical, orthopedic, and endovascular procedures with maximum precision, while robotic rehabilitation systems accelerate recovery for neurological and orthopedic patients. Specialized strengths include a multidisciplinary Heart Team, a comprehensive stroke unit with 24/7 interventional neuroradiology, one of Turkey's largest private bone marrow transplant centers, organ transplantation, oncology, a one-stop Check-Up Center, and a dedicated child-friendly pediatric ecosystem with its own play areas and consultation rooms.",
    languages: MEMORIAL_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: MEMORIAL_TREATMENT_UNITS,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Memorial+G%C3%B6ztepe+Hastanesi+Istanbul&z=14&output=embed",
    images: [
      "/images/hospitals/memorial-goztepe/1.jpg",
      "/images/hospitals/memorial-goztepe/2.jpg",
      "/images/hospitals/memorial-goztepe/3.jpg",
      "/images/hospitals/memorial-goztepe/4.jpg",
    ],
  },
  {
    slug: "memorial-ankara-hospital",
    name: "Memorial Ankara Hospital",
    group: "memorial",
    city: "Ankara",
    district: "Çankaya",
    accreditations: ["JCI"],
    beds: 230,
    operatingRooms: 11,
    area: "42,000 m²",
    overview:
      "Memorial Ankara Hospital, the 10th hospital of Memorial Healthcare Group, brings the group's world-class standards to Turkey's capital. One of the largest private hospitals in Ankara with a 42,000 m² closed area, it serves as a regional healthcare hub for Central Anatolia, the Black Sea region, and international patients, with reference-level departments, an academic medical faculty, and easy access on the Konya highway.\n\nThe hospital offers a 230-bed capacity — 60 of which are in intensive care — 11 fully equipped operating rooms, and 63 outpatient clinics. It hosts Memorial's globally recognized departments including cardiovascular surgery, invasive cardiology, medical and radiation oncology, bone marrow transplantation, IVF, orthopedics, and neurosurgery. Technology is built around patient comfort: a 256-slice CT scanner minimizes radiation exposure, a wide-bore 70 cm MRI eases claustrophobia, and operating rooms use adjustable LED lighting that meets international surgical standards.",
    languages: MEMORIAL_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: MEMORIAL_TREATMENT_UNITS,
    mapEmbedUrl: "https://maps.google.com/maps?q=39.903538,32.815306&z=14&output=embed",
    images: [
      "/images/hospitals/memorial-ankara/1.jpg",
      "/images/hospitals/memorial-ankara/2.jpg",
      "/images/hospitals/memorial-ankara/3.jpg",
      "/images/hospitals/memorial-ankara/4.jpg",
    ],
  },
  {
    slug: "memorial-antalya-hospital",
    name: "Memorial Antalya Hospital",
    group: "memorial",
    city: "Antalya",
    district: "Kepez",
    accreditations: ["JCI"],
    beds: 114,
    operatingRooms: 5,
    area: "15,000 m²",
    overview:
      "Memorial Antalya Hospital represents Memorial Healthcare Group on Turkey's Mediterranean coast and is one of the region's most important contributors to health tourism, welcoming patients from 167 countries. Shortly after opening, the hospital received JCI (Joint Commission International) accreditation and has renewed it in successive three-year cycles. Its central Kepez location keeps it close to Antalya's holiday resorts, the airport, and the main bus terminal.\n\nThe hospital serves with 114 patient beds and 28 intensive care beds, five operating theaters, an advanced radiology department, an interventional radiology unit, a coronary angiography service, and a chemotherapy unit. Modern architectural design and patient rooms with five-star hotel comfort support recovery, and intensive care units feature day-night ambient lighting designed to positively affect patient psychology. As a paperless, filmless hospital, it shares imaging and laboratory results digitally with all Memorial hospitals across Turkey.",
    languages: MEMORIAL_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: MEMORIAL_TREATMENT_UNITS,
    mapEmbedUrl: "https://maps.google.com/maps?q=36.917617,30.69347&z=14&output=embed",
    images: [
      "/images/hospitals/memorial-antalya/1.jpg",
      "/images/hospitals/memorial-antalya/2.jpg",
      "/images/hospitals/memorial-antalya/3.jpg",
      "/images/hospitals/memorial-antalya/4.jpg",
    ],
  },
  {
    slug: "memorial-kayseri-hospital",
    name: "Memorial Kayseri Hospital",
    group: "memorial",
    city: "Kayseri",
    district: "Kocasinan",
    accreditations: [],
    beds: 119,
    operatingRooms: 5,
    area: "11,000 m²",
    overview:
      "Memorial Kayseri Hospital opened in 2013 as the 9th hospital of Memorial Healthcare Group, carrying the group's excellence-focused service culture to the Central Anatolia region. With a respected academic physician staff and modern patient rooms and living areas, it is positioned to meet the full range of healthcare needs of the region at international standards.\n\nSet on an 11,000 m² area, the hospital offers a 119-bed capacity and five technologically advanced operating rooms, with state-of-the-art imaging units, laboratories, and intensive care units. Through the PACS filmless hospital system it shares imaging and laboratory results with all Memorial hospitals across Turkey. The hospital also hosts the Memorial Kayseri IVF Center — the only architecturally independent IVF center in Central Anatolia — with a 10-bed capacity, advanced embryology, andrology, and embryo-freezing laboratories, serving both regional and international patients.",
    languages: MEMORIAL_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: MEMORIAL_TREATMENT_UNITS,
    mapEmbedUrl: "https://maps.google.com/maps?q=38.728712,35.479552&z=14&output=embed",
    images: [
      "/images/hospitals/memorial-kayseri/1.jpg",
      "/images/hospitals/memorial-kayseri/2.jpg",
      "/images/hospitals/memorial-kayseri/3.jpg",
      "/images/hospitals/memorial-kayseri/4.jpg",
    ],
  },
  {
    slug: "memorial-diyarbakir-hospital",
    name: "Memorial Diyarbakır Hospital",
    group: "memorial",
    city: "Diyarbakır",
    district: "Kayapınar",
    accreditations: [], // JCI claim on old site not confirmed on Memorial's current pages — verify before adding
    beds: 141,
    operatingRooms: 6,
    area: "14,000 m²",
    overview:
      "Memorial Diyarbakır Hospital opened in 2011 as the 7th hospital of Memorial Healthcare Group, bringing the group's international standards to Southeastern Anatolia. One of Memorial's two hospitals in the city, it is designed to serve not only Diyarbakır but the entire region and international patients, with an academic staff of specialist physicians, modern diagnostic and treatment units, and architecture built around patient comfort.\n\nFounded on a 14,000 m² covered area, the hospital offers a 141-bed capacity, six operating rooms, and 43 intensive care beds (23 neonatal, 20 general). Its Oncology Center is the regional reference for cancer care, combining medical oncology, radiation oncology (Varian IMRT LINAC), nuclear medicine (PET-CT and scintigraphy), interventional radiology, and oncological surgery under one roof to create a personalized treatment plan for every patient. Comfortable suite rooms and sections designed for patients with disabilities complete the facility.",
    languages: MEMORIAL_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: MEMORIAL_TREATMENT_UNITS,
    mapEmbedUrl: "https://maps.google.com/maps?q=37.936,40.187779&z=14&output=embed",
    images: [
      "/images/hospitals/memorial-diyarbakir/1.jpg",
      "/images/hospitals/memorial-diyarbakir/2.jpg",
      "/images/hospitals/memorial-diyarbakir/3.jpg",
      "/images/hospitals/memorial-diyarbakir/4.jpg",
    ],
  },
  {
    slug: "memorial-dicle-hospital",
    name: "Memorial Dicle Hospital",
    group: "memorial",
    city: "Diyarbakır",
    district: "Kayapınar",
    accreditations: [], // JCI claim on old site not confirmed on Memorial's current pages — verify before adding
    beds: 135,
    operatingRooms: 9,
    area: "21,000 m²",
    overview:
      "Memorial Dicle Hospital opened in 2013 as the 8th hospital of Memorial Healthcare Group and its second in Diyarbakır. Located on the Şanlıurfa road close to the airport, hotel chains, and the bus terminal, it is strategically positioned to serve the entire Southeastern Anatolia region as well as international patients, with an academic staff of specialist physicians and architecture designed for patient comfort.\n\nEstablished on a 21,000 m² closed area, the hospital offers a 135-bed capacity, nine operating rooms, and 78 intensive care beds in total — 50 neonatal, 16 general, 5 cardiology, and 7 cardiovascular surgery. It serves as the region's reference center in cardiology, interventional cardiology, and cardiovascular surgery, performing complex procedures such as CTO interventions, EPS ablation, TAVI, coronary bypass, and heart valve repair and replacement. The facility also includes an IVF center with genetic testing, the region's most comprehensive pediatric orthopedics department, comfortable suite rooms, and sections designed for patients with disabilities.",
    languages: MEMORIAL_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: MEMORIAL_TREATMENT_UNITS,
    mapEmbedUrl: "https://maps.google.com/maps?q=37.925497,40.162134&z=14&output=embed",
    images: [
      "/images/hospitals/memorial-dicle/1.jpg",
      "/images/hospitals/memorial-dicle/2.jpg",
      "/images/hospitals/memorial-dicle/3.jpg",
      "/images/hospitals/memorial-dicle/4.jpg",
    ],
  },
];
