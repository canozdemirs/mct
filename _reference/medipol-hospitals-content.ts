/**
 * medipol-hospitals-content.ts
 *
 * Medipol Sağlık Grubu — 11 hastane
 * Kaynak: medipol.com.tr (resmî kurumsal site), Temmuz 2026 itibarıyla çekildi.
 * Uluslararası site: medipolglobal.com
 *
 * NOT: `verified: true` olan alanlar resmî Medipol sayfalarından birebir doğrulandı.
 * `verified: false` olanlar için ilgili hastane sayfasının ayrı bir çekim turu gerekiyor
 * (aşağıdaki TODO bölümüne bak).
 *
 * GÖRSELLER: `officialImageUrl` alanları Medipol'ün kendi CDN'ini gösterir.
 * Bunları PRODUCTION'DA HOTLINK ETME — dosya adına indir, optimize et, kendi
 * /public/hospitals/medipol/ klasörüne koy. Telif notu için dosya sonuna bak.
 */

export type MedipolHospital = {
  slug: string;
  name: string;
  nameEn: string;
  city: string;
  district: string;
  side: "European" | "Asian" | "Ankara";
  type: "general" | "dental";
  openedYear: number | null;
  address: string | null;
  phone: string;
  officialUrl: string;
  officialImageUrl: string;
  tagline: string;
  summaryEn: string;
  highlights: string[];
  stats: Record<string, string | number>;
  verified: boolean;
};

export const MEDIPOL_GROUP = {
  slug: "medipol",
  name: "Medipol Sağlık Grubu",
  nameEn: "Medipol Health Group",
  foundedNote:
    "Medipol has delivered healthcare since 1997; the group is affiliated with Istanbul Medipol University, making most of its hospitals university teaching hospitals.",
  universityAffiliation: "Istanbul Medipol University (medipol.edu.tr)",
  callCenter: "444 70 44",
  internationalSite: "https://medipolglobal.com/",
  hospitalCount: 11,
  positioningForMct:
    "Academic/university hospital group. Strongest differentiators for international patients: JCI Academic Medical Center accreditation at Mega, da Vinci robotic surgery, HIFU, on-site heliport, and the largest branch coverage of any private investment in Turkey.",
} as const;

export const MEDIPOL_HOSPITALS: MedipolHospital[] = [
  {
    slug: "medipol-mega-university-hospital",
    name: "Medipol Mega Üniversite Hastanesi",
    nameEn: "Medipol Mega University Hospital",
    city: "Istanbul",
    district: "Bağcılar",
    side: "European",
    type: "general",
    openedYear: 2012,
    address: null, // TODO: doğrula
    phone: "444 70 44",
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-mega",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2025-02/Websitesi_Hastane_Gorsellerii_2023-01-ea513ebb-cd90-4c8e-81ee-f3fbd15c07b3.jpg.webp",
    tagline: "The group's flagship — four specialist hospitals under one roof.",
    summaryEn:
      "Opened in 2012 as the Mega Hospitals Complex in Bağcılar, this is the flagship of the Medipol group. It houses four hospitals on a single campus — General, Dental, Cardiovascular Diseases, and Oncology — operating 24/7 with an academic medical staff. It is the private healthcare investment with the widest range of medical branches in Turkey.",
    highlights: [
      "Four hospitals on one campus: General, Dental, Cardiovascular, Oncology",
      "First hospital in Turkey accredited to JCI Academic Medical Center Hospital standards (accredited February 2014)",
      "da Vinci robotic surgery — used in urology, cardiac surgery, gynaecology and general surgery",
      "HIFU (High Intensity Focused Ultrasound) for prostate cancer, bone metastases and uterine fibroids",
      "On-site heliport rated for Turkey's heaviest helicopter — enables domestic and international patient transfer",
      "'Healing hospital architecture' concept with a 15,000 m² landscaped garden",
      "Pyxis automated pharmacy dispensing with barcode verification",
    ],
    stats: {
      beds: 810,
      intensiveCareUnits: 215,
      operatingRooms: 25,
      outpatientRooms: 358,
      dentalClinics: 42,
      hospitalsOnCampus: 4,
      closedAreaSqm: 165000,
      gardenSqm: 15000,
      parkingSqm: 26000,
    },
    verified: true,
  },
  {
    slug: "medipol-kosuyolu-hospital",
    name: "Medipol Koşuyolu Hastanesi",
    nameEn: "Medipol Koşuyolu Hospital",
    city: "Istanbul",
    district: "Koşuyolu, Kadıköy",
    side: "Asian",
    type: "general",
    openedYear: 1996,
    address: null, // TODO
    phone: "444 70 44",
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-kosuyolu",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2026-05/kosuyolu.png.webp",
    tagline: "The group's original Istanbul hospital, on the Asian side since 1996.",
    summaryEn:
      "Opened in 1996, this is the hospital that brought Medipol's care to a wider Istanbul audience. Located in Koşuyolu, Kadıköy, right beside the E-5 motorway and Koşuyolu Bridge, it is one of the best-connected private hospitals on the Asian side. Roughly 6,500 m² of built area combining modern architecture with advanced diagnostic imaging.",
    highlights: [
      "Easy access — bordered by roads on all four sides, adjacent to E-5 and Koşuyolu Bridge",
      "Mammography, ultrasonography and endoscopy on site for rapid diagnostics",
      "Luxury patient rooms, landscaped garden, large car park",
    ],
    stats: {
      beds: null,
      clinics: 33,
      intensiveCareBeds: 20,
      operatingRooms: 6,
      closedAreaSqm: 6500,
    },
    verified: true,
  },
  {
    slug: "medipol-bahcelievler-university-hospital",
    name: "Medipol Bahçelievler Üniversite Hastanesi",
    nameEn: "Medipol Bahçelievler University Hospital",
    city: "Istanbul",
    district: "Bahçelievler",
    side: "European",
    type: "general",
    openedYear: null, // TODO
    address:
      "Çobançeşme Mahallesi, Fatih Caddesi No:1/8, Bahçelievler, 34196 Istanbul",
    phone: "444 70 44",
    officialUrl:
      "https://medipol.com.tr/hastanelerimiz/bahcelievler-medipol-hastanesi",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2025-02/Websitesi_Hastane_Gorsellerii_2023-02-a2ecc1b2-c956-4af2-923a-3f7cc80eddcf.jpg.webp",
    tagline: "Full-service university hospital on the European side, close to the airport corridor.",
    summaryEn:
      "A university teaching hospital on Istanbul's European side, with fully equipped operating theatres, advanced intensive care units, laboratory, emergency department and treatment-equipped patient rooms, operating 24/7. Strong academic roster across surgical, internal medicine, dentistry and laboratory departments.",
    highlights: [
      "Large professorial roster across surgical and internal medicine departments",
      "Dedicated sleep laboratory (OSAS diagnosis and treatment)",
      "Dentistry department alongside general medicine",
      "10-image official photo gallery available (see photoGallery below)",
    ],
    stats: {},
    verified: true,
  },
  {
    slug: "medipol-acibadem-regional-hospital",
    name: "MEDİPOL Acıbadem Bölge Hastanesi",
    nameEn: "Medipol Acıbadem Regional Hospital",
    city: "Istanbul",
    district: "Acıbadem, Üsküdar",
    side: "Asian",
    type: "general",
    openedYear: null, // TODO
    address: null, // TODO
    phone: "444 70 44",
    officialUrl:
      "https://medipol.com.tr/hastanelerimiz/medipol-acibadem-bolge-hastanesi",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2026-05/acibadem.png.webp",
    tagline: "Medipol expertise in the Acıbadem district on the Asian side.",
    summaryEn:
      "Medipol's regional hospital in the Acıbadem district of Istanbul's Asian side, sharing consultants with the Bahçelievler and Mega campuses.",
    highlights: [],
    stats: {},
    verified: false,
  },
  {
    slug: "medipol-esenler-university-hospital",
    name: "Medipol Esenler Üniversite Hastanesi",
    nameEn: "Medipol Esenler University Hospital",
    city: "Istanbul",
    district: "Esenler",
    side: "European",
    type: "general",
    openedYear: null, // TODO
    address: null, // TODO
    phone: "444 70 44",
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-esenler",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2026-05/Medipol-Esenler--1-.png.webp",
    tagline: "Central location, modern architecture, advanced medical technology in Esenler.",
    summaryEn:
      "A university teaching hospital in the central Esenler district on the European side, combining modern architecture with advanced medical technology and an academic clinical team.",
    highlights: [],
    stats: {},
    verified: false,
  },
  {
    slug: "medipol-camlica-university-hospital",
    name: "Medipol Çamlıca Üniversite Hastanesi",
    nameEn: "Medipol Çamlıca University Hospital",
    city: "Istanbul",
    district: "Çamlıca, Üsküdar",
    side: "Asian",
    type: "general",
    openedYear: null, // TODO
    address: null, // TODO
    phone: "444 70 44",
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-camlica",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2026-05/camlica.png.webp",
    tagline: "One of Istanbul Medipol University's health research and application centres.",
    summaryEn:
      "Part of Istanbul Medipol University's Health Practice and Research Centres network, located on the Asian side. Delivers care across 19 separate medical branches.",
    highlights: ["19 medical branches", "University research and application centre status"],
    stats: { branches: 19 },
    verified: true,
  },
  {
    slug: "medipol-pendik-university-hospital",
    name: "Medipol Pendik Üniversite Hastanesi",
    nameEn: "Medipol Pendik University Hospital",
    city: "Istanbul",
    district: "Pendik",
    side: "Asian",
    type: "general",
    openedYear: null, // TODO
    address: null, // TODO
    phone: "444 70 44",
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-pendik",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2026-05/Medipol-Pendik-Drone.png.webp",
    tagline: "Medipol experience in Pendik — closest campus to Sabiha Gökçen Airport.",
    summaryEn:
      "Medipol's university hospital in Pendik on the far Asian side. Its position makes it the group's most convenient campus for patients arriving at Sabiha Gökçen International Airport.",
    highlights: [
      "Closest Medipol campus to Sabiha Gökçen Airport — a genuine logistics advantage for arriving patients",
    ],
    stats: {},
    verified: false,
  },
  {
    slug: "medipol-vatan-university-hospital",
    name: "Medipol Vatan Üniversite Hastanesi",
    nameEn: "Medipol Vatan University Hospital",
    city: "Istanbul",
    district: "Fatih (Vatan Caddesi)",
    side: "European",
    type: "general",
    openedYear: 2012,
    address: null, // TODO
    phone: "444 70 44",
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-vatan",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2025-02/vatan-klinikleri-4b9a566d-c87d-4bfd-afc0-00098f7ee5ef.jpg.webp",
    tagline: "In the historic peninsula — walking distance from Istanbul's old city.",
    summaryEn:
      "Istanbul Medipol University Health Practice and Research Hospital, Vatan Clinics, opened on 1 February 2012. Its Fatih location puts it within easy reach of the historic peninsula's hotels — relevant for patients combining treatment with sightseeing.",
    highlights: [
      "Opened 1 February 2012",
      "Historic peninsula location — convenient for Sultanahmet/Fatih hotel stays",
    ],
    stats: {},
    verified: true,
  },
  {
    slug: "medipol-sefakoy-university-hospital",
    name: "Medipol Sefaköy Üniversite Hastanesi",
    nameEn: "Medipol Sefaköy University Hospital",
    city: "Istanbul",
    district: "Küçükçekmece (Sefaköy)",
    side: "European",
    type: "general",
    openedYear: 2014,
    address: "Tevfikbey Mah., Maslak Çeşme Cad., Küçükçekmece, Istanbul",
    phone: "444 70 44",
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-sefakoy",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2026-05/Medipol-Sefakoy-2.png.webp",
    tagline: "High-volume research and application hospital near Istanbul Airport corridor.",
    summaryEn:
      "Opened on 5 November 2014, the Sefaköy Research and Application Hospital is one of the group's highest-volume campuses. It handles roughly 400,000 outpatient visits, 5,000 surgeries and 2,500 births each year. Also runs a dedicated spine diseases programme.",
    highlights: [
      "~400,000 outpatient visits per year",
      "~5,000 surgeries per year",
      "~2,500 births per year",
      "Spine disease diagnosis and treatment to international standards",
      "Metrobüs-accessible, close to the Istanbul Airport / Yenibosna corridor",
    ],
    stats: {
      outpatientVisitsPerYear: 400000,
      surgeriesPerYear: 5000,
      birthsPerYear: 2500,
    },
    verified: true,
  },
  {
    slug: "medipol-unkapani-dental-hospital",
    name: "Medipol Unkapanı Üniversite Diş Hastanesi",
    nameEn: "Medipol Unkapanı University Dental Hospital",
    city: "Istanbul",
    district: "Unkapanı, Fatih",
    side: "European",
    type: "dental",
    openedYear: null, // TODO
    address: null, // TODO
    phone: "444 70 44",
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-unkapani",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2025-02/Unkapani-Medipol-Universitesi%20Dis-Hastanesi-0ae7aa8a-2a7c-4a6b-97b9-827c28613f55.jpg.webp",
    tagline: "Dedicated university dental hospital in the historic peninsula.",
    summaryEn:
      "A standalone university dental hospital specialising in oral and dental health, located in Unkapanı. Relevant for MCT's dental packages — a dedicated dental hospital rather than a dental wing.",
    highlights: [
      "Standalone dental hospital — full oral and dental health scope",
      "Directly relevant to MCT dental treatment packages",
    ],
    stats: {},
    verified: true,
  },
  {
    slug: "medipol-ankara-dental-hospital",
    name: "Medipol Ankara Üniversitesi Diş Hastanesi",
    nameEn: "Medipol Ankara University Dental Hospital",
    city: "Ankara",
    district: "Ankara",
    side: "Ankara",
    type: "dental",
    openedYear: 2022,
    address: null, // TODO
    phone: "444 70 44",
    officialUrl:
      "https://medipol.com.tr/hastanelerimiz/medipol-universitesi-ankara-dis-hastanesi",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2025-02/Medipol_Ankara_Dis_Hastanesi_Acilis_isleri_Header_2022_R1-1-copy-ae3d2151-d067-4777-8bc2-db94962f8f26.jpg.webp",
    tagline: "The group's only Ankara campus — dental.",
    summaryEn:
      "Medipol's dental hospital in Ankara, covering the full range of oral and dental health needs with advanced medical technology and an academic clinical team. The group's only non-Istanbul hospital.",
    highlights: ["Only Medipol campus outside Istanbul"],
    stats: {},
    verified: false, // openedYear 2022 dosya adından çıkarıldı — doğrulanmalı
  },
];

/**
 * Bahçelievler resmî görsel galerisi (10 adet, tam çözünürlük).
 * Diğer hastaneler için galeri linklerinin ayrıca çekilmesi gerekiyor.
 */
export const MEDIPOL_PHOTO_GALLERIES: Record<string, string[]> = {
  "medipol-bahcelievler-university-hospital": Array.from(
    { length: 10 },
    (_, i) =>
      `https://media.medipol.com.tr/assets/s3fs-public/2025-05/Bahcelievler-Medipol-Hastanesi-${String(
        i + 1
      ).padStart(2, "0")}.jpg`
  ),
  // NOT: yukarıdaki URL'ler VersionId query parametresi olmadan yazıldı.
  // Tam çalışan URL'ler için hastane sayfasını tekrar çek — her dosyanın
  // kendine ait bir UUID + VersionId'si var.
};

/**
 * TODO — kalan çekim turu
 * Aşağıdaki sayfaların /hastane-hakkinda alt sayfaları henüz çekilmedi.
 * Her biri Mega'daki gibi "Sayılarla ..." istatistik bloğu ve adres içeriyor:
 *
 *  - medipol-acibadem-bolge-hastanesi
 *  - medipol-esenler
 *  - medipol-camlica
 *  - medipol-pendik
 *  - medipol-vatan
 *  - medipol-unkapani
 *  - medipol-universitesi-ankara-dis-hastanesi
 *
 * Ayrıca her hastane sayfasının altında "Neredeyiz?" bloğunda tam adres,
 * telefon, faks ve e-posta var — bunlar toplu çekilebilir.
 */
