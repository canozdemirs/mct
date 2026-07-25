/**
 * medipol-hospitals.ts — KAYNAK MALZEME
 *
 * Medipol Sağlık Grubu — 11 hastane
 * Kaynak: medipol.com.tr resmî sayfaları (Temmuz 2026)
 * Uluslararası site: medipolglobal.com
 *
 * Bu dosya KAYNAK MALZEME olarak saklanır.
 * lib/hospitals.ts bu dosyayı import ETMEZ.
 * Veriler buradan okunup lib/hospitals.ts içine elle aktarılır.
 *
 * Kaynak dosyalar (bu dosyada birleştirildi):
 *   medipol-hospitals-content.ts  — künye verisi
 *   medipol-overviews.ts          — batch 1: Mega, Bahçelievler, Koşuyolu
 *   medipol-overviews-batch3.ts   — batch 3: Pendik, Acıbadem, Esenler, Çamlıca
 *   medipol-overviews-batch4.ts   — batch 4: Unkapanı, Ankara
 *   lib/hospitals.ts              — batch 2 kaynağı: Sefaköy, Vatan
 *
 * NOT: Çamlıca için batch 3 sürümü kullanıldı (kapasite verili).
 * Batch 2'deki Çamlıca metni yetersiz olduğundan batch 3 ile değiştirilmişti.
 *
 * Slug'lar lib/hospitals.ts ile birebir eşleşir.
 * Sıralama: lib/hospitals.ts displayOrder alanına göre (1–11).
 */

type MedipolRef = {
  slug: string;
  nameEn: string;
  city: string;
  district: string;
  side: "European" | "Asian" | "Ankara";
  type: "general" | "dental";
  openedYear: number | null;
  address: string | null;
  officialUrl: string;
  officialImageUrl: string;
  stats: Record<string, string | number | null>;
  highlights: string[];
  verified: boolean;
  overview: string;
};

export const MEDIPOL_HOSPITALS: MedipolRef[] = [
  // ─────────────────────────────────────────────────────────
  // 1. MEGA — displayOrder 1
  // ─────────────────────────────────────────────────────────
  {
    slug: "medipol-mega-university-hospital",
    nameEn: "Medipol Mega University Hospital",
    city: "Istanbul",
    district: "Bağcılar",
    side: "European",
    type: "general",
    openedYear: 2012,
    address: null, // TODO: doğrula
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-mega",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2025-02/Websitesi_Hastane_Gorsellerii_2023-01-ea513ebb-cd90-4c8e-81ee-f3fbd15c07b3.jpg.webp",
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
    highlights: [
      "Four hospitals on one campus: General, Dental, Cardiovascular, Oncology",
      "First hospital in Turkey accredited to JCI Academic Medical Center Hospital standards (Feb 2014)",
      "da Vinci robotic surgery — urology, cardiac surgery, gynaecology, general surgery",
      "HIFU for prostate cancer, bone metastases and uterine fibroids",
      "On-site heliport rated for Turkey's heaviest helicopter",
      "15,000 m² landscaped garden",
    ],
    verified: true,
    overview: `Medipol Mega is the flagship of the Medipol group and one of the largest
private healthcare investments in Turkey. Opened in Bağcılar in 2012 as the
Mega Hospitals Complex, it brings seven specialist hospitals onto a single
campus — General, Dental, Cardiovascular, Obstetrics, IVF, Oncology and Eye —
so a patient needing more than one department never has to travel between
buildings.

The scale is unusual even by international standards: 810 beds, 215 intensive
care units, 25 operating theatres that can run simultaneously, and 358
outpatient consulting rooms across 165,000 m² of built space. It carries the
widest range of medical branches of any private hospital in the country.

In February 2014 Medipol Mega became the first hospital in Turkey accredited
under Joint Commission International's Academic Medical Center Hospital
standards — a stricter framework than standard JCI accreditation, applied to
hospitals that also teach medicine and conduct clinical research.

For international patients the practical advantages are concrete. The campus
has its own heliport, rated for the heaviest helicopter operating in Turkey and
built for domestic and cross-border patient transfer. Robotic surgery using the
da Vinci system is performed in urology, cardiac surgery, gynaecology and
general surgery. HIFU is available for prostate cancer, bone metastases and
uterine fibroids — a non-invasive option with short hospital stays and low
complication risk.

The hospital sits on the European side beside the TEM motorway, roughly
40 minutes from Istanbul Airport.`,
  },

  // ─────────────────────────────────────────────────────────
  // 2. BAHÇELİEVLER — displayOrder 2
  // ─────────────────────────────────────────────────────────
  {
    slug: "medipol-bahcelievler-hospital",
    nameEn: "Medipol Bahçelievler University Hospital",
    city: "Istanbul",
    district: "Bahçelievler",
    side: "European",
    type: "general",
    openedYear: null,
    address: "Çobançeşme Mahallesi, Fatih Caddesi No:1/8, Bahçelievler, 34196 Istanbul",
    officialUrl: "https://medipol.com.tr/hastanelerimiz/bahcelievler-medipol-hastanesi",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2025-02/Websitesi_Hastane_Gorsellerii_2023-02-a2ecc1b2-c956-4af2-923a-3f7cc80eddcf.jpg.webp",
    stats: {},
    highlights: [
      "Large professorial roster across surgical and internal medicine departments",
      "Dedicated sleep laboratory (OSAS diagnosis and treatment)",
      "Dentistry department alongside general medicine",
    ],
    verified: true,
    overview: `Medipol Bahçelievler is a university teaching hospital on Istanbul's European
side, and one of the group's busiest general campuses. It operates around the
clock with fully equipped operating theatres, advanced intensive care units,
an on-site laboratory, an emergency department, and patient rooms fitted for
treatment rather than recovery alone.

What distinguishes this campus is the depth of its academic roster. Because it
functions as a teaching hospital of Istanbul Medipol University, a large share
of its consultants hold professor or associate professor titles, spanning
cardiology, oncology, orthopaedics, general surgery, urology, paediatrics and
obstetrics. Patients are treated by the same senior clinicians who teach and
publish in these fields.

The hospital covers four broad areas — surgical medicine, internal medicine,
dentistry and laboratory services — meaning most treatment pathways can be
completed on one site, including dental work that would otherwise require a
separate clinic. A dedicated sleep laboratory handles obstructive sleep apnoea
diagnosis and treatment.

For patients arriving from abroad, the location works in your favour. Bahçelievler
sits on the E-5 corridor in the western half of the European side, close to the
Istanbul Airport approach and well served by metro and metrobüs. Transfers from
the airport are short, and the surrounding district has a wide range of hotels
at every price point for companions or for recovery stays between appointments.

Address: Çobançeşme Mahallesi, Fatih Caddesi No:1/8, Bahçelievler.`,
  },

  // ─────────────────────────────────────────────────────────
  // 3. ÇAMLICA — displayOrder 3
  // batch 3 sürümü kullanıldı (kapasite verili)
  // ─────────────────────────────────────────────────────────
  {
    slug: "medipol-camlica-university-hospital",
    nameEn: "Medipol Çamlıca University Hospital",
    city: "Istanbul",
    district: "Çamlıca, Üsküdar",
    side: "Asian",
    type: "general",
    openedYear: null,
    address: null,
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-camlica",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2026-05/camlica.png.webp",
    stats: {
      beds: 100,
      operatingRooms: 6,
      closedAreaSqm: 13000,
      staff: 350,
      branches: 19,
    },
    highlights: [
      "19 medical branches",
      "100 beds, 6 advanced operating theatres, general and neonatal ICU",
      "University research and application centre status",
    ],
    verified: true,
    overview: `Medipol Çamlıca is one of Istanbul Medipol University's Health Practice and
Research Centres, on the Asian side of the city in Üsküdar. Across 13,000 m²
of floor space it operates 100 inpatient beds, 6 advanced operating theatres,
general and neonatal intensive care units, and a staff of more than 350.

The hospital opened delivering 19 medical branches, with the range planned to
expand considerably. Radiology and laboratory services are held to high quality
standards on site, and the emergency department is comprehensive — meaning a
complication or an unexpected finding does not require transfer elsewhere.

As a university hospital, its consultants combine clinical practice with
teaching and research. Patients are treated by the same senior physicians who
train Turkish medical students, and clinical protocols are shared across the
Medipol network.

Its position suits patients who prefer to be treated away from the density of
central Istanbul. Çamlıca sits on the higher ground of the Asian side, quieter
and greener than the European campuses, while remaining within reach of both
Bosphorus bridges. Sabiha Gökçen Airport lies to the east, and the surrounding
Üsküdar and Kadıköy districts offer a wide range of accommodation for
companions or for recovery stays between appointments.`,
  },

  // ─────────────────────────────────────────────────────────
  // 4. SEFAKÖY — displayOrder 4
  // ─────────────────────────────────────────────────────────
  {
    slug: "medipol-sefakoy-university-hospital",
    nameEn: "Medipol Sefaköy University Hospital",
    city: "Istanbul",
    district: "Küçükçekmece (Sefaköy)",
    side: "European",
    type: "general",
    openedYear: 2014,
    address: "Tevfikbey Mah., Maslak Çeşme Cd. No:30, 34295 Küçükçekmece",
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-sefakoy",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2026-05/Medipol-Sefakoy-2.png.webp",
    stats: {
      outpatientVisitsPerYear: 400000,
      surgeriesPerYear: 5000,
      birthsPerYear: 2500,
    },
    highlights: [
      "Opened 5 November 2014",
      "~400,000 outpatient visits per year",
      "~5,000 surgeries per year",
      "~2,500 births per year",
      "Spine disease diagnosis and treatment programme",
      "Directly on metrobüs corridor (Beylikdüzü–Mecidiyeköy)",
      "Short drive from Istanbul Airport",
    ],
    verified: true,
    overview: `Medipol Sefaköy opened on 5 November 2014 as a Research and Application
Hospital of Istanbul Medipol University, and has grown into one of the group's
highest-volume campuses on the European side.

The numbers tell the story: roughly 400,000 outpatient consultations, 5,000
surgeries and 2,500 births every year. For an international patient, volume
matters more than it might seem — surgical teams performing a procedure
hundreds of times a year work faster, handle complications better, and have
tighter theatre scheduling than teams doing it occasionally.

The hospital covers surgical medicine, internal medicine and laboratory
services, with consultants across neurosurgery, general surgery, urology,
orthopaedics and traumatology, cardiology, gastroenterology, ENT, ophthalmology,
obstetrics and gynaecology, paediatrics, dermatology and physiotherapy. Its
spine programme handles diagnosis and treatment to international standards,
covering both surgical and conservative pathways.

Getting there is unusually easy for a hospital in this part of the city.
Sefaköy sits directly on the metrobüs route — the Beylikdüzü–Mecidiyeköy
corridor — so patients staying almost anywhere on the European side can reach
it without changing transport. Coming from Başakşehir, Esenler, Bağcılar or
Güneşli, the Basın Ekspres connection road leads straight to it. Istanbul
Airport is a short drive north.

Address: Tevfikbey Mah., Maslak Çeşme Cd. No:30, 34295 Küçükçekmece.`,
  },

  // ─────────────────────────────────────────────────────────
  // 5. ESENLER — displayOrder 5
  // ─────────────────────────────────────────────────────────
  {
    slug: "medipol-esenler-university-hospital",
    nameEn: "Medipol Esenler University Hospital",
    city: "Istanbul",
    district: "Esenler",
    side: "European",
    type: "general",
    openedYear: null,
    address: "Birlik Mahallesi, Bahçeler Caddesi No:5, 34250 Esenler, Istanbul",
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-esenler",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2026-05/Medipol-Esenler--1-.png.webp",
    stats: {},
    highlights: [
      "Metro-accessible (Esenler and Menderes stations)",
      "Comprehensive emergency department with on-site surgical team",
      "Short transfer from Istanbul Airport",
    ],
    verified: false,
    overview: `Medipol Esenler is a university teaching hospital on Istanbul's European side,
operating as one of Istanbul Medipol University's Health Practice and Research
Centres. It delivers both outpatient and inpatient care, and is recognised as
one of Istanbul's leading private hospitals in several specific specialties.

The emergency department is comprehensively equipped, with surgical
intervention, emergency intervention, dressing, plaster, injection and
observation units on site. Trauma from accidents, burns, haemorrhage,
respiratory difficulty, cardiac events and poisoning are all handled here, and
where surgery is needed the hospital's own emergency surgical team performs it
without transfer to another site.

For international patients, Esenler's value is its position. The district sits
at the centre of the European side, close to the Istanbul Airport corridor and
directly served by the metro — Esenler and Menderes stations are both within
reach. It is a shorter transfer from Istanbul Airport than most hospitals on
the Asian side, and connections to the historic peninsula are direct.

The hospital combines modern architecture with current medical technology and
an academic clinical team, sharing consultants and protocols with the group's
larger campuses.

Address: Birlik Mahallesi, Bahçeler Caddesi No:5, 34250 Esenler, Istanbul.`,
  },

  // ─────────────────────────────────────────────────────────
  // 6. ACIBADEM REGIONAL — displayOrder 6
  // ⚠️ district düzeltmesi: "Acıbadem, Kadıköy"
  //    lib/hospitals.ts'te hâlâ "Acıbadem, Üsküdar" var — güncellenmeli
  // ─────────────────────────────────────────────────────────
  {
    slug: "medipol-acibadem-regional-hospital",
    nameEn: "Medipol Acıbadem Regional Hospital",
    city: "Istanbul",
    district: "Acıbadem, Kadıköy", // düzeltildi — Kadıköy'e bağlı
    side: "Asian",
    type: "general",
    openedYear: null,
    address: "Acıbadem, Şht. Emin Çölen Sokağı No:4, 34718 Kadıköy, Istanbul",
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-acibadem-bolge-hastanesi",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2026-05/acibadem.png.webp",
    stats: {
      beds: 218,
      intensiveCareUnits: 54,
      outpatientRooms: 118,
    },
    highlights: [
      "218 beds, 54 ICU, 118 outpatient consulting rooms",
      "Newest Medipol campus — current equipment and patient room standards",
      "Academic consultants from Medipol university network",
      "NOT connected to Acıbadem Healthcare Group — district shares the name",
    ],
    verified: true,
    overview: `Medipol Acıbadem Regional Hospital is the newest addition to the Medipol group,
opened on the Asian side of Istanbul in the Acıbadem district of Kadıköy. It is
a Medipol hospital — not connected to the Acıbadem Healthcare Group, which
shares the district's name.

Despite being the most recent campus, it is one of the group's larger ones:
218 inpatient beds, 54 intensive care units and 118 outpatient consulting
rooms. That combination — high consulting-room count alongside substantial
inpatient capacity — means diagnostic appointments and surgery can usually be
scheduled within the same short window rather than spread across separate
visits.

Being new has practical advantages for an international patient. Equipment is
current rather than inherited, patient rooms are built to contemporary comfort
standards, and the building was designed around modern clinical workflow rather
than retrofitted into an older structure.

The hospital operates 24 hours a day with intensive care units, advanced
operating theatres, laboratory, emergency department and treatment-equipped
rooms, staffed by academic consultants drawn from the wider Medipol university
network. A cafe and prayer room inside the building serve patients and
accompanying family.

Kadıköy is well connected to both sides of the city and sits close to the E-5
corridor, making transfers from either airport straightforward.

Address: Acıbadem, Şht. Emin Çölen Sokağı No:4, 34718 Kadıköy, Istanbul.`,
  },

  // ─────────────────────────────────────────────────────────
  // 7. ISTANBUL (KOŞUYOLU) — displayOrder 7
  // lib/hospitals.ts slug: medipol-istanbul-hospital
  // medipol-hospitals-content.ts slug: medipol-kosuyolu-hospital (farklı)
  // ─────────────────────────────────────────────────────────
  {
    slug: "medipol-istanbul-hospital",
    nameEn: "Medipol Istanbul Hospital (Koşuyolu)",
    city: "Istanbul",
    district: "Koşuyolu, Kadıköy",
    side: "Asian",
    type: "general",
    openedYear: 1996,
    address: "E-5 Harem Yolu Üzeri, Koşuyolu/Kadıköy 34718 Istanbul",
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-kosuyolu",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2026-05/kosuyolu.png.webp",
    stats: {
      clinics: 33,
      intensiveCareBeds: 20,
      operatingRooms: 6,
      closedAreaSqm: 6500,
    },
    highlights: [
      "Group's original Istanbul hospital, operating since 1996",
      "Bordered by roads on all four sides — E-5 and Koşuyolu Bridge adjacent",
      "Mammography, ultrasonography and endoscopy on site",
      "24/7 emergency department with 11-bed observation unit",
    ],
    verified: true,
    overview: `Medipol Istanbul Hospital — also known today as Medipol Koşuyolu Hospital — is
where the group's Istanbul story began. Opened in 1996, it carried forward a
healthcare practice dating back to 1987 and brought Medipol's care to a much
wider audience in the city.

It remains one of the leading private hospitals on Istanbul's Asian side.
Roughly 6,500 m² of built space houses 33 clinics, 20 intensive care beds and
6 operating theatres, alongside private patient rooms, a landscaped garden and
extensive parking. The scale is deliberately human — smaller and calmer than
the group's mega-campuses, which suits patients who prefer a quieter setting
for procedures that don't require a large multi-specialty complex.

Diagnostics are handled on site. Mammography, ultrasonography and endoscopy
allow breast, digestive, urinary and genital system conditions to be
investigated and diagnosed quickly, often within a single visit — useful when
your time in Istanbul is limited.

The emergency department runs 24 hours a day, 365 days a year, with two
surgical intervention rooms, two emergency intervention rooms, dressing,
plaster and injection facilities, and an 11-bed observation unit supported by
central oxygen and nitrous oxide systems.

Location is one of its strongest assets. The hospital sits in Koşuyolu,
Kadıköy, directly beside the E-5 motorway and the Koşuyolu Bridge, with roads
on all four sides. Access from either side of the Bosphorus is straightforward,
and Sabiha Gökçen Airport is a short drive east.

Address: E-5 Harem Yolu Üzeri, Koşuyolu/Kadıköy 34718 Istanbul.`,
  },

  // ─────────────────────────────────────────────────────────
  // 8. VATAN — displayOrder 8
  // ─────────────────────────────────────────────────────────
  {
    slug: "medipol-vatan-university-hospital",
    nameEn: "Medipol Vatan University Hospital",
    city: "Istanbul",
    district: "Fatih",
    side: "European",
    type: "general",
    openedYear: 2012,
    address: null,
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-vatan",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2025-02/vatan-klinikleri-4b9a566d-c87d-4bfd-afc0-00098f7ee5ef.jpg.webp",
    stats: {},
    highlights: [
      "Opened 1 February 2012",
      "Historic peninsula location — Sultanahmet, Eminönü, Grand Bazaar within reach",
      "Tram and metro connections through Fatih",
      "Widest hotel selection of any Istanbul district",
    ],
    verified: true,
    overview: `Istanbul Medipol University Health Practice and Research Hospital — Vatan
Clinics — began serving patients on 1 February 2012. It sits on Vatan Caddesi
in Fatih, inside Istanbul's historic peninsula, and functions as a university
teaching hospital within the Medipol group.

Its defining advantage for international patients is location. Fatih puts the
hospital within easy reach of Sultanahmet, Eminönü and the Grand Bazaar — the
part of the city most visitors want to see. For patients travelling with family,
or for procedures that need several appointments spread across a week, this
means companions are not stranded in a hospital district with nothing around
them, and recovery days can include a short walk somewhere worth walking.

Clinically, the hospital operates as part of the university network, sharing
academic staff and clinical protocols with the group's larger campuses. Patients
requiring a procedure beyond its scope are referred within the Medipol network
rather than sent outside it — continuity of records and consulting team is
preserved.

Tram and metro connections through Fatih make transfers straightforward, and
the surrounding area has the widest hotel selection of any district in the city,
at every price level.`,
  },

  // ─────────────────────────────────────────────────────────
  // 9. PENDİK — displayOrder 9
  // ─────────────────────────────────────────────────────────
  {
    slug: "medipol-pendik-university-hospital",
    nameEn: "Medipol Pendik University Hospital",
    city: "Istanbul",
    district: "Pendik",
    side: "Asian",
    type: "general",
    openedYear: 2019,
    address: "Bahçelievler Mah., Adnan Menderes Bulvarı No:31-33, Pendik, Istanbul",
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-pendik",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2026-05/Medipol-Pendik-Drone.png.webp",
    stats: {
      beds: 97,
      intensiveCareUnits: 26,
      branches: 19,
      staff: 480,
      languages: 6,
    },
    highlights: [
      "Closest Medipol campus to Sabiha Gökçen Airport",
      "MR60 airport bus stops 140 m from entrance",
      "Marmaray stop 650 m away — direct to Yenikapı / historic peninsula",
      "97 beds, 26 ICU, 19 medical branches, ~480 staff",
      "Services in 6 languages",
    ],
    verified: true,
    overview: `Medipol Pendik opened in 2019 as one of Istanbul Medipol University's Health
Practice and Research Centres, on the far Asian side of the city. It operates
97 inpatient beds and 26 intensive care units across 19 medical branches, with
a staff of around 480 and services delivered in six languages.

Its real advantage for international patients is arrival logistics. Pendik is
the closest Medipol campus to Sabiha Gökçen International Airport — the MR60
airport bus stops 140 metres from the entrance. Patients flying into Istanbul
Airport on the European side can take the metrobüs to Mecidiyeköy and the 251
bus to Pendik, and the Marmaray line stops 650 metres away, connecting the
hospital directly to Yenikapı and the historic peninsula.

For a patient arriving with luggage after a long flight, this matters more than
it might appear. Most Istanbul hospitals require a taxi transfer of an hour or
more from the arrival airport; here the walk from the bus stop is shorter than
the walk through most terminals.

The hospital runs 24 hours a day with intensive care units, advanced operating
theatres, an on-site laboratory, emergency department and treatment-equipped
patient rooms. A cafe, prayer room and hairdresser inside the building serve
patients and the family members staying with them — a practical consideration
for companions during a multi-day stay.

Address: Bahçelievler Mah., Adnan Menderes Bulvarı No:31-33, Pendik, Istanbul.`,
  },

  // ─────────────────────────────────────────────────────────
  // 10. UNKAPANI DİŞ — displayOrder 10
  // ⚠️ İMPLANT UYARISI: immediate loading protokolü uygulanıyorsa
  //    "ikinci ziyaret" cümlesini düzelt — beklenti yönetimi açısından kritik
  // ─────────────────────────────────────────────────────────
  {
    slug: "medipol-unkapani-university-hospital",
    nameEn: "Medipol Unkapanı University Dental Hospital",
    city: "Istanbul",
    district: "Unkapanı, Fatih",
    side: "European",
    type: "dental",
    openedYear: null,
    address: null,
    officialUrl: "https://medipol.com.tr/hastanelerimiz/medipol-unkapani",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2025-02/Unkapani-Medipol-Universitesi%20Dis-Hastanesi-0ae7aa8a-2a7c-4a6b-97b9-827c28613f55.jpg.webp",
    stats: {},
    highlights: [
      "Standalone dental hospital — not a dental wing inside a general hospital",
      "Full oral and dental health scope",
      "Historic peninsula location — close to Fatih hotels",
    ],
    verified: true,
    overview: `Medipol Unkapanı is a dedicated university dental hospital in the Unkapanı
area of Fatih, on Istanbul's historic peninsula. It is a standalone dental
hospital rather than a dental department inside a general hospital — the
distinction matters, because the entire building, equipment and clinical team
are built around oral and dental health rather than sharing theatre time and
imaging with other specialties.

For patients travelling to Istanbul for dental treatment, this shapes the
experience in practical terms. Appointments can be scheduled in longer blocks,
several procedures can be combined in one day, and imaging or laboratory work
happens on site rather than being sent elsewhere. A treatment plan that would
take weeks of separate appointments at home is compressed into a single trip.

Medical Center Turkey's dental packages are built around a seven-day stay in
Istanbul. That window covers the initial examination and imaging, the treatment
plan, the procedures themselves, and the final fitting and check before you fly
home. Crown, veneer and smile-design work is generally completed within it.
Implants are different: the implant post needs months to fuse with the bone
before the permanent tooth is fitted, so implant treatment usually involves a
second visit. Your coordinator will set out exactly what your case requires
before you book flights, so there are no surprises in the final days of the
trip.

Being a university hospital, treatment is delivered by academic dental staff
of Istanbul Medipol University. The Fatih location puts the hospital within
reach of the historic peninsula's hotels — practical for a week-long stay, and
for companions who want something to do between appointments.`,
  },

  // ─────────────────────────────────────────────────────────
  // 11. ANKARA DİŞ — displayOrder 11
  // ⚠️ İMPLANT UYARISI: immediate loading protokolü uygulanıyorsa
  //    "ikinci ziyaret" cümlesini düzelt
  // openedYear 2022 dosya adından çıkarıldı — doğrulanmalı
  // ─────────────────────────────────────────────────────────
  {
    slug: "medipol-ankara-university-hospital",
    nameEn: "Medipol Ankara University Dental Hospital",
    city: "Ankara",
    district: "Ankara",
    side: "Ankara",
    type: "dental",
    openedYear: 2022,
    address: null,
    officialUrl:
      "https://medipol.com.tr/hastanelerimiz/medipol-universitesi-ankara-dis-hastanesi",
    officialImageUrl:
      "https://media.medipol.com.tr/assets/s3fs-public/styles/max_witdh_800/public/2025-02/Medipol_Ankara_Dis_Hastanesi_Acilis_isleri_Header_2022_R1-1-copy-ae3d2151-d067-4777-8bc2-db94962f8f26.jpg.webp",
    stats: {},
    highlights: [
      "Only Medipol campus outside Istanbul",
      "Standalone dental hospital — full oral and dental health scope",
      "Esenboğa Airport connected to most European capitals",
    ],
    verified: false,
    overview: `Medipol Ankara University Dental Hospital is the group's only campus outside
Istanbul, and its only dental hospital in the capital. Like Unkapanı, it is a
standalone dental hospital — the building, equipment and clinical team are
dedicated entirely to oral and dental health rather than shared with other
departments.

It delivers the full range of oral and dental treatment with current dental
technology and an academic clinical team drawn from Medipol University,
following the same clinical protocols as the group's Istanbul campuses.

Medical Center Turkey's dental packages are built around a seven-day stay.
That window covers examination and imaging, the treatment plan, the procedures
and the final fitting before you fly home. Crown, veneer and smile-design work
is generally completed within it. Implant treatment is the exception: the
implant post needs months to fuse with the bone before the permanent tooth is
fitted, so it usually involves a second visit. Your coordinator will confirm
what your specific case requires before you book flights.

Ankara suits patients who are already travelling to the capital, or who prefer
a calmer city than Istanbul for a week of treatment. Esenboğa Airport connects
to most European capitals, and Ankara's compact centre means shorter transfers
between hotel and hospital than Istanbul typically allows.

For most international patients arriving specifically for dental treatment,
Medical Center Turkey coordinates care in Istanbul. If Ankara suits your travel
plans better, tell your coordinator at the consultation stage.`,
  },
];
