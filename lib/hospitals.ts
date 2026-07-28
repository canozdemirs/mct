// lib/hospitals.ts
// MCT Partner Hospitals — data source for /hospitals-in-turkey and /[hospital] pages
// Slugs match the existing WordPress URLs 1:1 — DO NOT change slugs (SEO).
// TODO fields: fill from old site content, rewritten in clean English.

export interface HospitalGroup {
  name: string;
  logo: string;
  description: string;
}

export interface Hospital {
  slug: string;
  name: string;
  group: keyof typeof hospitalGroups;
  city: string;
  district: string;
  accreditations: string[];
  beds: number | null;
  operatingRooms: number | null;
  intensiveCareBeds?: number;
  displayOrder?: number;
  area: string;
  overview: string;
  languages: string[];
  freeServices: string[];
  treatmentUnits: string[];
  mapEmbedUrl: string;
  address?: string;
  images: string[];
}

export const hospitalGroups = {
  acibadem: {
    name: "Acıbadem Healthcare Group",
    logo: "/images/hospitals/groups/acibadem.png",
    description:
      "Acıbadem Healthcare Group, founded in 1991, is one of Turkey's largest private hospital networks, operating hospitals across Istanbul, Ankara, Adana, Bursa, Eskişehir, Kayseri, Kocaeli, Bodrum and beyond. The group is internationally accredited by JCI (Joint Commission International) and is known for its academic medical centers, organ transplantation programs, oncology and cardiovascular surgery expertise, and its affiliation with Acıbadem University's School of Medicine.",
  },
  memorial: {
    name: "Memorial Healthcare Group",
    logo: "/images/hospitals/groups/memorial.png",
    description:
      "Memorial Healthcare Group opened its first hospital, Memorial Şişli, in February 2000 and has since grown into one of Turkey's leading private hospital networks, with more than 1,300 physicians — over 700 holding academic titles — and 7,300+ healthcare professionals. Memorial Şişli was the first hospital in Turkey, and the 21st in the world, to earn JCI (Joint Commission International) accreditation, and the group is internationally recognized in organ transplantation, IVF, oncology, cardiology, and cardiovascular surgery.",
  },
  medipol: {
    name: "Medipol Health Group",
    logo: "/images/hospitals/groups/medipol.png",
    description: "", // TODO
  },
  "koc-healthcare": {
    name: "Koç Healthcare Institutions",
    logo: "/images/hospitals/groups/koc-healthcare.png",
    description:
      "American Hospital and Koç University Hospital operate under Koç Healthcare Institutions, the non-profit, research-driven healthcare arm of the Vehbi Koç Foundation.", // TODO: refine
  },
  estethica: {
    name: "Estethica",
    logo: "/images/hospitals/groups/estethica.png",
    description:
      "Estethica is a Turkish aesthetic surgery and hair transplant hospital group, operating under the ethical-care motto 'Sağlıklı Güzellik' (Healthy Beauty) since 2008. Known as one of the world's leading aesthetic surgery hospitals, Estethica specializes in plastic and reconstructive surgery, hair transplantation, cosmetic dermatology, dental aesthetics, and weight-loss and healthy-living programs, following Turkish Ministry of Health SKS-Hastane quality accreditation standards.",
  },
} as const;

// Shared defaults — override per hospital where needed
const DEFAULT_FREE_SERVICES = [
  "Free consultation and treatment plan",
  "Airport pickup and VIP transfers",
  "Translation and interpreter services",
  "Hotel booking assistance",
  "Personal patient coordinator",
]; // TODO: confirm against MCT package definitions

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

export const ACIBADEM_LANGUAGES = [
  "Turkish",
  "English",
  "Arabic",
  "French",
  "German",
  "Greek",
  "Romanian",
  "Russian",
  "Swedish",
];

export const ACIBADEM_TREATMENT_UNITS = [
  "Cardiology",
  "Cardiovascular Surgery",
  "General Surgery",
  "Internal Medicine",
  "Medical Oncology",
  "Gynecology and Obstetrics",
  "IVF and Reproductive Medicine",
  "Neurology",
  "Neurosurgery",
  "Orthopedics and Traumatology",
  "Ophthalmology",
  "Otorhinolaryngology (ENT)",
  "Pediatrics",
  "Pediatric Surgery",
  "Nephrology",
  "Gastroenterology",
  "Dermatology",
  "Urology",
  "Endocrinology",
  "Pulmonary Medicine",
  "Radiology",
  "Physical Medicine and Rehabilitation",
  "Anesthesiology and Reanimation",
  "Emergency Service",
  "Aesthetic, Plastic and Reconstructive Surgery",
  "Oral and Dental Health",
  "Psychology",
  "Nutrition and Diet",
];

export const ESTETHICA_LANGUAGES = ["Turkish", "English", "Arabic"];

export const ESTETHICA_TREATMENT_UNITS = [
  "Plastic, Reconstructive and Aesthetic Surgery",
  "Hair Transplantation and Hair Health Clinic",
  "Oral and Dental Health Clinic",
  "Cosmetic Dermatology Clinic",
  "Healthy Living and Nutrition Clinic",
  "Weight Loss Clinic",
];

export const hospitals: Hospital[] = [
  // ─────────────────────────────── ACIBADEM (15) ───────────────────────────────
  {
    slug: "acibadem-adana-hospital",
    name: "Acıbadem Adana Hospital",
    group: "acibadem",
    city: "Adana",
    district: "",
    accreditations: ["JCI"],
    beds: 105,
    operatingRooms: 6,
    area: "22,000 m²",
    overview:
      "Acıbadem Adana Hospital opened in 2009 to serve patients across Adana and the wider Eastern Mediterranean and Southeast Anatolia region, including referral flow from nearby countries. Operating in a 22,000 m² indoor area, it is JCI-accredited and offers specialized centers in oncology, pediatric bone marrow transplantation, cardiology and cardiovascular surgery.",
    languages: ACIBADEM_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ACIBADEM_TREATMENT_UNITS,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Cumhuriyet+Cad.+No:66+Seyhan+Adana&z=14&output=embed",
    images: [
      "/images/hospitals/acibadem-adana/1.jpg",
      "/images/hospitals/acibadem-adana/2.jpg",
      "/images/hospitals/acibadem-adana/3.jpg",
      "/images/hospitals/acibadem-adana/4.jpg",
    ],
  },
  {
    slug: "acibadem-ankara-hospital",
    name: "Acıbadem Ankara Hospital",
    group: "acibadem",
    city: "Ankara",
    district: "",
    accreditations: ["JCI"],
    beds: 103,
    operatingRooms: 4,
    area: "11,000 m²",
    overview:
      "Acıbadem Ankara Hospital opened in 2012 in the Çankaya-Oran district, bringing Acıbadem's JCI-accredited quality standards to the capital and surrounding provinces. The hospital is equipped with advanced diagnostic technology including Flash CT, whole-body MRI and 3D tomosynthesis digital mammography, and offers services across orthopedics, gynecology and obstetrics, general surgery, neurosurgery, ENT, urology and radiology.",
    languages: ACIBADEM_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ACIBADEM_TREATMENT_UNITS,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Turan+Güneş+Bulvarı+630.+Sok+No:6+Çankaya+Ankara&z=14&output=embed",
    images: [
      "/images/hospitals/acibadem-ankara/1.jpg",
      "/images/hospitals/acibadem-ankara/2.jpg",
      "/images/hospitals/acibadem-ankara/3.jpg",
      "/images/hospitals/acibadem-ankara/4.jpg",
    ],
  },
  {
    slug: "acibadem-atasehir-hospital",
    name: "Acıbadem Ataşehir Hospital",
    group: "acibadem",
    city: "Istanbul",
    district: "Ataşehir",
    accreditations: ["JCI"],
    beds: 300,
    operatingRooms: 10,
    area: "65,000 m²",
    overview:
      "Opened on September 1, 2022, Acıbadem Ataşehir Hospital is the group's 18th hospital in Turkey and 24th worldwide. Built in the Acıbadem Holding building, the hospital holds LEED Gold certification for environmental sustainability and uses an AI-driven command center to manage energy use and infrastructure. It includes 10 operating rooms plus a dedicated IVF operating room, minor surgery room, three endoscopy/colonoscopy rooms and two angiography rooms, along with a pediatric clinic in an adjacent building.",
    languages: ACIBADEM_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ACIBADEM_TREATMENT_UNITS,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Atatürk+Mah.+Turgut+Özal+Bulvarı+A+Blok+No:11+Ataşehir+Istanbul&z=14&output=embed",
    images: [
      "/images/hospitals/acibadem-atasehir/1.jpg",
      "/images/hospitals/acibadem-atasehir/2.jpg",
      "/images/hospitals/acibadem-atasehir/3.jpg",
      "/images/hospitals/acibadem-atasehir/4.jpg",
    ],
  },
  {
    slug: "acibadem-bakirkoy-hospital",
    name: "Acıbadem Bakırköy Hospital",
    group: "acibadem",
    city: "Istanbul",
    district: "Bakırköy",
    accreditations: ["JCI"],
    beds: 102,
    operatingRooms: 7,
    area: "18,000 m²",
    overview:
      "Acıbadem Bakırköy Hospital opened in 2000 as the group's first hospital on the European side of Istanbul. The hospital operates in an 18,000 m² indoor area with a rooftop heliport for emergency transfers, and its Neonatal Intensive Care Unit is staffed by neonatologists, pediatric subspecialists and pediatric surgeons for high-risk newborns.",
    languages: ACIBADEM_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ACIBADEM_TREATMENT_UNITS,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Halit+Ziya+Uşaklıgil+Cad.+No:1+Bakırköy+Istanbul&z=14&output=embed",
    images: [
      "/images/hospitals/acibadem-bakirkoy/1.jpg",
      "/images/hospitals/acibadem-bakirkoy/2.jpg",
      "/images/hospitals/acibadem-bakirkoy/3.jpg",
      "/images/hospitals/acibadem-bakirkoy/4.jpg",
    ],
  },
  {
    slug: "acibadem-bodrum-hospital",
    name: "Acıbadem Bodrum Hospital",
    group: "acibadem",
    city: "Muğla",
    district: "Bodrum",
    accreditations: ["JCI"],
    beds: 104,
    operatingRooms: 4,
    area: "26,000 m²",
    overview:
      "Acıbadem Bodrum Hospital opened in June 2012 as a general-purpose hospital serving both year-round residents of the Bodrum peninsula and the region's large seasonal and international tourist population. Designed around the region's natural light and local architectural motifs, the hospital includes interior gardens, dedicated children's areas, a rooftop heliport for emergencies, and centers for oncology, breast health, check-up services and interventional cardiology.",
    languages: ACIBADEM_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ACIBADEM_TREATMENT_UNITS,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Türkkuyusu+Mah.+Kıbrıs+Şehitleri+Cad.+Bodrum+Muğla&z=14&output=embed",
    images: [
      "/images/hospitals/acibadem-bodrum/1.jpg",
      "/images/hospitals/acibadem-bodrum/2.jpg",
      "/images/hospitals/acibadem-bodrum/3.jpg",
      "/images/hospitals/acibadem-bodrum/4.jpg",
    ],
  },
  {
    slug: "acibadem-bursa-hospital",
    name: "Acıbadem Bursa Hospital",
    group: "acibadem",
    city: "Bursa",
    district: "",
    accreditations: ["JCI"],
    beds: 91,
    operatingRooms: 7,
    area: "30,000 m²",
    overview:
      "Acıbadem Bursa Hospital opened in 2006 as the group's first hospital outside Istanbul. JCI-accredited, the hospital operates in a 30,000 m² facility with dedicated coronary, neonatal, general and cardiovascular surgery intensive care units, alongside a labor-delivery-recovery-postpartum (LDRP) suite for maternity care.",
    languages: ACIBADEM_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ACIBADEM_TREATMENT_UNITS,
    mapEmbedUrl: "https://maps.google.com/maps?q=Acıbadem+Bursa+Hastanesi&z=14&output=embed",
    images: [
      "/images/hospitals/acibadem-bursa/1.jpg",
      "/images/hospitals/acibadem-bursa/2.jpg",
      "/images/hospitals/acibadem-bursa/3.jpg",
      "/images/hospitals/acibadem-bursa/4.jpg",
    ],
  },
  {
    slug: "acibadem-eskisehir-hospital",
    name: "Acıbadem Eskişehir Hospital",
    group: "acibadem",
    city: "Eskişehir",
    district: "",
    accreditations: ["JCI"],
    beds: 107,
    operatingRooms: 5,
    area: "21,137 m²",
    overview:
      "Acıbadem Eskişehir Hospital opened in 2010, extending care to Eskişehir and neighboring provinces including Afyon, Kütahya and Bilecik. The hospital's smart-building systems monitor over 1,000 points across the facility, and its intensive care rooms use single-patient isolation cabins alongside a dedicated neonatal intensive care unit, two delivery rooms and a baby care room.",
    languages: ACIBADEM_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ACIBADEM_TREATMENT_UNITS,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Hoşnudiye+Mah.+Acıbadem+Sok.+No:19+Tepebaşı+Eskişehir&z=14&output=embed",
    images: [
      "/images/hospitals/acibadem-eskisehir/1.jpg",
      "/images/hospitals/acibadem-eskisehir/2.jpg",
      "/images/hospitals/acibadem-eskisehir/3.jpg",
      "/images/hospitals/acibadem-eskisehir/4.jpg",
    ],
  },
  {
    slug: "acibadem-fulya-hospital",
    name: "Acıbadem Fulya Hospital",
    group: "acibadem",
    city: "Istanbul",
    district: "Fulya",
    accreditations: ["JCI"],
    beds: 124,
    operatingRooms: 8,
    area: "22,000 m²",
    overview:
      "Acıbadem Fulya Hospital, located in Beşiktaş, operates in a nearly 22,000 m² facility and is home to the group's Sports Medicine Center — recognized by FIFA as a Medical Centre of Excellence. The hospital offers labor-delivery-recovery-postpartum (LDRP) birthing suites, a menopause clinic, breast health center, IVF center, obesity center and a dedicated addiction treatment program alongside its 16-bed intensive care unit.",
    languages: ACIBADEM_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ACIBADEM_TREATMENT_UNITS,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Dikilitaş+Mah.+Hakkı+Yeten+Cd.+No:23+Beşiktaş+Istanbul&z=14&output=embed",
    images: [
      "/images/hospitals/acibadem-fulya/1.jpg",
      "/images/hospitals/acibadem-fulya/2.jpg",
      "/images/hospitals/acibadem-fulya/3.jpg",
      "/images/hospitals/acibadem-fulya/4.jpg",
    ],
  },
  {
    slug: "acibadem-international-hospital",
    name: "Acıbadem International Hospital",
    group: "acibadem",
    city: "Istanbul",
    district: "Yeşilköy",
    accreditations: ["JCI"],
    beds: 112,
    operatingRooms: null,
    area: "19,000 m²",
    overview:
      "Located in Yeşilköy, Acıbadem International Hospital began admitting patients in 1989 and joined Acıbadem Healthcare Group in 2005, operating under its current name since 2014. Set on a 19,000 m² indoor area, the hospital houses an Organ Transplant Center performing kidney transplants, alongside cardiac health, IVF and breast health services, plus neurosurgery, thoracic surgery, nuclear medicine and a dedicated sleep laboratory.",
    languages: ACIBADEM_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ACIBADEM_TREATMENT_UNITS,
    mapEmbedUrl: "https://maps.google.com/maps?q=41.061527,28.8354341&z=14&output=embed",
    images: [
      "/images/hospitals/acibadem-international/1.jpg",
      "/images/hospitals/acibadem-international/2.jpg",
      "/images/hospitals/acibadem-international/3.jpg",
      "/images/hospitals/acibadem-international/4.jpg",
    ],
  },
  {
    slug: "acibadem-kadikoy-hospital",
    name: "Acıbadem Kadıköy Hospital",
    group: "acibadem",
    city: "Istanbul",
    district: "Kadıköy",
    accreditations: ["JCI"],
    beds: 138,
    operatingRooms: null,
    area: "17,600 m²",
    overview:
      "Acıbadem Kadıköy Hospital (Dr. Şinasi Can) expanded its indoor area from 5,000 m² to 17,600 m² in 1998 to meet rising patient demand. The hospital runs a smart-building system monitored across 6,500 control points and is known for high-risk cardiac surgery as well as adult and pediatric hand, knee, shoulder, spine and hip orthopedic procedures.",
    languages: ACIBADEM_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ACIBADEM_TREATMENT_UNITS,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Acıbadem+Mah.+Tekin+Sk.+No:8+Kadıköy+Istanbul&z=14&output=embed",
    images: [
      "/images/hospitals/acibadem-kadikoy/1.jpg",
      "/images/hospitals/acibadem-kadikoy/2.jpg",
      "/images/hospitals/acibadem-kadikoy/3.jpg",
      "/images/hospitals/acibadem-kadikoy/4.jpg",
    ],
  },
  {
    slug: "acibadem-kayseri-hospital",
    name: "Acıbadem Kayseri Hospital",
    group: "acibadem",
    city: "Kayseri",
    district: "",
    accreditations: ["JCI"],
    beds: 104,
    operatingRooms: 6,
    area: "22,000 m²",
    overview:
      "Acıbadem Kayseri Hospital combines two structures: a historical building first brought into service under Mustafa Kemal Atatürk in 1924 — now restored and housing ophthalmology, medical oncology, dermatology and plastic surgery units — and a modern main hospital building, together covering 22,000 m² and serving patients from Kayseri and the surrounding region.",
    languages: ACIBADEM_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ACIBADEM_TREATMENT_UNITS,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Seyitgazi+Mah.+Mustafa+Kemal+Paşa+Bulvarı+No:1+Melikgazi+Kayseri&z=14&output=embed",
    images: [
      "/images/hospitals/acibadem-kayseri/1.jpg",
      "/images/hospitals/acibadem-kayseri/2.jpg",
      "/images/hospitals/acibadem-kayseri/3.jpg",
      "/images/hospitals/acibadem-kayseri/4.jpg",
    ],
  },
  {
    slug: "acibadem-kocaeli-hospital",
    name: "Acıbadem Kocaeli Hospital",
    group: "acibadem",
    city: "Kocaeli",
    district: "",
    accreditations: ["JCI"],
    beds: 55,
    operatingRooms: null,
    area: "6,500 m²",
    overview:
      "Acıbadem Kocaeli Hospital serves patients in Kocaeli and the surrounding Marmara region, operating in a 6,500 m² facility with free patient parking and on-site banking services.",
    languages: ACIBADEM_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ACIBADEM_TREATMENT_UNITS,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Yeni+Mahalle+İnkılap+Cad.+Kocaeli&z=14&output=embed",
    images: [
      "/images/hospitals/acibadem-kocaeli/1.jpg",
      "/images/hospitals/acibadem-kocaeli/2.jpg",
      "/images/hospitals/acibadem-kocaeli/3.jpg",
      "/images/hospitals/acibadem-kocaeli/4.jpg",
    ],
  },
  {
    slug: "acibadem-kozyatagi-hospital",
    name: "Acıbadem Kozyatağı Hospital",
    group: "acibadem",
    city: "Istanbul",
    district: "Kozyatağı",
    accreditations: ["JCI"],
    beds: 75,
    operatingRooms: 4,
    area: "13,700 m²",
    overview:
      "Acıbadem Kozyatağı Hospital, the group's third hospital, has served patients on Istanbul's Anatolian side since 2004. Operating in a 13,700 m² facility, its Neonatal Intensive Care Unit brings together neonatologists, pediatric subspecialists and pediatric surgeons for high-risk newborn care.",
    languages: ACIBADEM_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ACIBADEM_TREATMENT_UNITS,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Ondokuz+Mayıs+Mah.+Begonya+Sok.+No:12+Kadıköy+Istanbul&z=14&output=embed",
    images: [
      "/images/hospitals/acibadem-kozyatagi/1.jpg",
      "/images/hospitals/acibadem-kozyatagi/2.jpg",
      "/images/hospitals/acibadem-kozyatagi/3.jpg",
      "/images/hospitals/acibadem-kozyatagi/4.jpg",
    ],
  },
  {
    slug: "acibadem-maslak-hospital",
    name: "Acıbadem Maslak Hospital",
    group: "acibadem",
    city: "Istanbul",
    district: "Maslak",
    accreditations: ["JCI"],
    beds: 364,
    operatingRooms: null,
    area: "106,000 m²",
    overview:
      "Acıbadem Maslak Hospital began admitting patients in 2009 and, following a 2018 expansion, became the group's largest hospital at 106,000 m². Set beside forested land near the city center with metro access, the hospital holds LEED Gold certification and specializes in MAP/IVF and infertility treatment, alongside a broad range of surgical and diagnostic services.",
    languages: ACIBADEM_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ACIBADEM_TREATMENT_UNITS,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Büyükdere+Cad.+No:40+Maslak+Istanbul&z=14&output=embed",
    images: [
      "/images/hospitals/acibadem-maslak/1.jpg",
      "/images/hospitals/acibadem-maslak/2.jpg",
      "/images/hospitals/acibadem-maslak/3.jpg",
      "/images/hospitals/acibadem-maslak/4.jpg",
    ],
  },
  {
    slug: "acibadem-taksim-hospital",
    name: "Acıbadem Taksim Hospital",
    group: "acibadem",
    city: "Istanbul",
    district: "Taksim",
    accreditations: ["JCI"],
    beds: 93,
    operatingRooms: 7,
    area: "24,000 m²",
    overview:
      "Acıbadem Taksim Hospital opened in October 2015 as the group's 18th hospital, designed as a general-purpose facility in the heart of Istanbul's Beyoğlu district. Its Emergency Department has separate ambulance and patient entrances with dedicated resuscitation, surgical and orthopedic procedure rooms, and the hospital is a candidate Mother-Friendly Hospital offering full labor, prepartum and postpartum counseling services.",
    languages: ACIBADEM_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ACIBADEM_TREATMENT_UNITS,
    mapEmbedUrl: "https://maps.google.com/maps?q=Acıbadem+Taksim+Hastanesi+Beyoğlu+Istanbul&z=14&output=embed",
    images: [
      "/images/hospitals/acibadem-taksim/1.jpg",
      "/images/hospitals/acibadem-taksim/2.jpg",
      "/images/hospitals/acibadem-taksim/3.jpg",
      "/images/hospitals/acibadem-taksim/4.jpg",
    ],
  },

  // ─────────────────────────────── MEMORIAL (9) ───────────────────────────────
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
    accreditations: [],
    beds: 144,
    operatingRooms: null,
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
    accreditations: [],
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
    accreditations: [],
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
    accreditations: [],
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

  // ─────────────────────────────── MEDIPOL (11) ───────────────────────────────
  {
    slug: "medipol-ankara-university-hospital",
    name: "Medipol Ankara University Dental Hospital",
    group: "medipol",
    displayOrder: 11,
    city: "Ankara",
    district: "Ankara",
    accreditations: [],
    beds: null,
    operatingRooms: null,
    area: "",
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
    languages: [],
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ["Oral and Dental Health"],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Celal+Bayar+Blv+No:88+Çankaya+Ankara&z=15&output=embed",
    address: "Eti Mahallesi, Celal Bayar Bulvarı No:88/1, 06570 Çankaya, Ankara",
    images: [
      "/images/hospitals/medipol-ankara/1.jpg",
      "/images/hospitals/medipol-ankara/2.jpg",
      "/images/hospitals/medipol-ankara/3.jpg",
      "/images/hospitals/medipol-ankara/4.jpg",
    ],
  },
  {
    slug: "medipol-bahcelievler-hospital",
    name: "Medipol Bahçelievler University Hospital",
    group: "medipol",
    displayOrder: 2,
    city: "Istanbul",
    district: "Bahçelievler",
    accreditations: [],
    beds: null,
    operatingRooms: null,
    area: "",
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
at every price point for companions or for recovery stays between appointments.`,
    languages: [],
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: [],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Fatih+Caddesi+No:1+Bahçelievler+Istanbul&z=15&output=embed",
    address: "Çobançeşme Mahallesi, Fatih Caddesi No:1/8, Bahçelievler, 34196 İstanbul",
    images: [
      "/images/hospitals/medipol-bahcelievler/1.jpg",
      "/images/hospitals/medipol-bahcelievler/2.jpg",
      "/images/hospitals/medipol-bahcelievler/3.jpg",
      "/images/hospitals/medipol-bahcelievler/4.jpg",
    ],
  },
  {
    slug: "medipol-camlica-university-hospital",
    name: "Medipol Çamlıca University Hospital",
    group: "medipol",
    displayOrder: 3,
    city: "Istanbul",
    district: "Çamlıca, Üsküdar",
    accreditations: [],
    beds: null,
    operatingRooms: null,
    area: "",
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
    languages: [],
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: [],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Alemdağ+Caddesi+No:100+Üsküdar+Istanbul&z=15&output=embed",
    address: "Alemdağ Caddesi, Bulgurlu Mahallesi No:100, Üsküdar, İstanbul",
    images: [
      "/images/hospitals/medipol-camlica/1.webp",
      "/images/hospitals/medipol-camlica/2.jpg",
      "/images/hospitals/medipol-camlica/3.jpg",
      "/images/hospitals/medipol-camlica/4.jpg",
    ],
  },
  {
    slug: "medipol-esenler-university-hospital",
    name: "Medipol Esenler University Hospital",
    group: "medipol",
    displayOrder: 9,
    city: "Istanbul",
    district: "Esenler",
    accreditations: [],
    beds: null,
    operatingRooms: null,
    area: "",
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
larger campuses.`,
    languages: [],
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: [],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Bahçeler+Caddesi+No:5+Esenler+Istanbul&z=15&output=embed",
    address: "Birlik Mahallesi, Bahçeler Caddesi No:5, 34250 Esenler, İstanbul",
    images: [
      "/images/hospitals/medipol-esenler/1.webp",
      "/images/hospitals/medipol-esenler/2.jpg",
      "/images/hospitals/medipol-esenler/3.jpg",
      "/images/hospitals/medipol-esenler/4.jpg",
    ],
  },
  {
    slug: "medipol-istanbul-hospital",
    name: "Medipol Istanbul Hospital (Koşuyolu)",
    group: "medipol",
    displayOrder: 7,
    city: "Istanbul",
    district: "Koşuyolu, Kadıköy",
    accreditations: [],
    beds: null,
    intensiveCareBeds: 20,
    operatingRooms: 6,
    area: "6,500 m²",
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
and Sabiha Gökçen Airport is a short drive east.`,
    languages: [
      "Arabic",
      "English",
      "French",
      "German",
      "Greek",
      "Romanian",
      "Russian",
      "Swedish",
      "Turkish",
    ],
    freeServices: [
      "Online doctor consultation",
      "Medical records transfer",
      "Rehabilitation",
      "Translation services",
      "Interpreter services",
      "Airport pickup",
      "Hotel booking",
      "Free WiFi",
      "Phone in room",
      "TV in room",
      "Special dietary requests",
      "Private patient rooms",
      "Family accommodation",
      "Pharmacy",
      "Laundry",
      "Mobility accessible rooms",
    ],
    treatmentUnits: [
      "Allergy-Immunology",
      "Audiology",
      "Cardiovascular Surgery",
      "Clinical Laboratories",
      "Ear Nose and Throat",
      "Endocrinology",
      "General Surgery",
      "ICU Coronary Care",
      "Infectious Diseases",
      "Internal Medicine",
      "Medical Oncology",
      "Neurology",
      "Nuclear Medicine",
      "Obstetrics and Gynaecology",
      "Ophthalmology",
      "Orthopedics and Traumatology",
      "Pathology",
      "Pediatrics",
      "Plastic and Reconstructive Surgery",
      "Psychology",
      "Radiation Treatment",
      "Rheumatology",
      "Speech and Language Pathology",
      "Urology",
      "Anesthesiology and Reanimation",
      "Cardiology",
      "Check Up",
      "Dermatology",
      "Emergency Service",
      "Gastroenterology",
      "Hematology",
      "ICU Neonatal",
      "Intensive Care Units",
      "IVF",
      "Nephrology",
      "Neurosurgery",
      "Nutrition and Diet",
      "Operating Room",
      "Oral and Dental Health",
      "Pain Management",
      "Pediatric Surgery",
      "Physiotherapy and Rehabilitation",
      "Psychiatry",
      "Pulmonary Medicine",
      "Radiology and Medical Imaging",
      "Sleep Disorders Lab",
      "Thoracic Surgery",
      "Vascular Surgery",
    ],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=E-5+Harem+Yolu+Üzeri+Koşuyolu+Kadıköy+Istanbul&z=15&output=embed",
    address: "E-5 Harem Yolu Üzeri, Koşuyolu/Kadıköy 34718 Istanbul",
    images: [
      "/images/hospitals/medipol-istanbul/1.webp",
      "/images/hospitals/medipol-istanbul/2.jpg",
      "/images/hospitals/medipol-istanbul/3.jpg",
      "/images/hospitals/medipol-istanbul/4.jpg",
    ],
  },
  {
    slug: "medipol-mega-university-hospital",
    name: "Medipol Mega University Hospital",
    group: "medipol",
    displayOrder: 1,
    city: "Istanbul",
    district: "Bağcılar",
    accreditations: ["JCI Academic Medical Center"],
    beds: 810,
    operatingRooms: 25,
    intensiveCareBeds: 215,
    area: "165,000 m²",
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
    languages: [],
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: [],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=TEM+Avrupa+Otoyolu+Göztepe+Çıkışı+No:1+Bağcılar+Istanbul&z=14&output=embed",
    address: "TEM Avrupa Otoyolu Göztepe Çıkışı No: 1, Bağcılar, 34214 İstanbul",
    images: [
      "/images/hospitals/medipol-mega/3.jpg",
      "/images/hospitals/medipol-mega/2.jpg",
      "/images/hospitals/medipol-mega/1.jpg",
      "/images/hospitals/medipol-mega/4.jpg",
    ],
  },
  {
    slug: "medipol-pendik-university-hospital",
    name: "Medipol Pendik University Hospital",
    group: "medipol",
    displayOrder: 5,
    city: "Istanbul",
    district: "Pendik",
    accreditations: [],
    beds: null,
    operatingRooms: null,
    area: "",
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
for companions during a multi-day stay.`,
    languages: [],
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: [],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Adnan+Menderes+Bulvarı+No:31+Pendik+Istanbul&z=15&output=embed",
    address: "Bahçelievler Mahallesi, Adnan Menderes Bulvarı No:31-33, Pendik, İstanbul",
    images: [
      "/images/hospitals/medipol-pendik/1.webp",
      "/images/hospitals/medipol-pendik/2.jpg",
      "/images/hospitals/medipol-pendik/3.jpg",
      "/images/hospitals/medipol-pendik/4.jpg",
    ],
  },
  {
    slug: "medipol-sefakoy-university-hospital",
    name: "Medipol Sefaköy University Hospital",
    group: "medipol",
    displayOrder: 4,
    city: "Istanbul",
    district: "Küçükçekmece (Sefaköy)",
    accreditations: [],
    beds: null,
    operatingRooms: null,
    area: "",
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
Airport is a short drive north.`,
    languages: [],
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: [],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Tevfikbey+Mah+Maslak+Çeşme+Cad+Küçükçekmece+Istanbul&z=15&output=embed",
    address: "Tevfikbey Mah., Maslak Çeşme Cad., Küçükçekmece, İstanbul",
    images: [
      "/images/hospitals/medipol-sefakoy/1.webp",
      "/images/hospitals/medipol-sefakoy/2.jpg",
      "/images/hospitals/medipol-sefakoy/3.jpg",
      "/images/hospitals/medipol-sefakoy/4.jpg",
    ],
  },
  {
    slug: "medipol-unkapani-university-hospital",
    name: "Medipol Unkapanı University Dental Hospital",
    group: "medipol",
    displayOrder: 10,
    city: "Istanbul",
    district: "Unkapanı, Fatih",
    accreditations: [],
    beds: null,
    operatingRooms: null,
    area: "",
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
    languages: [],
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ["Oral and Dental Health"],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Atatürk+Bulvarı+No:27+Unkapanı+Fatih+Istanbul&z=15&output=embed",
    address: "Atatürk Bulvarı No:27, Unkapanı, Fatih, İstanbul",
    images: [
      "/images/hospitals/medipol-unkapani/1.jpg",
      "/images/hospitals/medipol-unkapani/2.jpg",
      "/images/hospitals/medipol-unkapani/3.jpg",
      "/images/hospitals/medipol-unkapani/4.jpg",
    ],
  },
  {
    slug: "medipol-vatan-university-hospital",
    name: "Medipol Vatan University Hospital",
    group: "medipol",
    displayOrder: 8,
    city: "Istanbul",
    district: "Fatih",
    accreditations: [],
    beds: null,
    operatingRooms: null,
    area: "",
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
    languages: [],
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: [],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Vatan+Cad+Halıcılar+Köşkü+Sk+No:11+Fatih+Istanbul&z=15&output=embed",
    address: "Vatan Cad., Halıcılar Köşkü Sk. No:11, Aksaray, Fatih, İstanbul",
    images: [
      "/images/hospitals/medipol-vatan/1.jpg",
      "/images/hospitals/medipol-vatan/2.jpg",
      "/images/hospitals/medipol-vatan/3.jpg",
      "/images/hospitals/medipol-vatan/4.jpg",
    ],
  },
  {
    slug: "medipol-acibadem-regional-hospital",
    name: "Medipol Acıbadem Regional Hospital",
    group: "medipol",
    displayOrder: 6,
    city: "Istanbul",
    district: "Acıbadem, Kadıköy",
    accreditations: [],
    beds: null,
    operatingRooms: null,
    area: "",
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
corridor, making transfers from either airport straightforward.`,
    languages: [],
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: [],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Şht.+Emin+Çölen+Sokağı+No:4+Acıbadem+Kadıköy+Istanbul&z=15&output=embed",
    address: "Acıbadem, Şht. Emin Çölen Sokağı No:4, 34718 Kadıköy/İstanbul",
    images: [
      "/images/hospitals/medipol-acibadem/5.jpg",
      "/images/hospitals/medipol-acibadem/3.jpg",
      "/images/hospitals/medipol-acibadem/4.jpg",
      "/images/hospitals/medipol-acibadem/2.jpg",
    ],
  },

  // ────────────────────── KOÇ HEALTHCARE INSTITUTIONS (2) ──────────────────────
  {
    slug: "koc-university-hospital",
    name: "Koç University Hospital",
    group: "koc-healthcare",
    city: "Istanbul",
    district: "Topkapı",
    accreditations: ["JCI"],
    beds: 426,
    operatingRooms: 23,
    intensiveCareBeds: 55,
    area: "220,000 m²",
    overview:
      "Koç University Hospital opened in September 2014 as the teaching and research hospital of Koç University's School of Medicine, located on the university's Health Sciences Campus in Topkapı, Istanbul. Operating at North American clinical standards, the hospital expanded through a second construction phase completed in 2016. It houses a Comprehensive Cancer Program spanning medical oncology, radiation oncology, and surgical oncology, an Organ Transplantation Center performing pancreas and liver transplants, a Bone Marrow Transplantation Unit with HEPA-filtered isolation rooms, and specialized centers launched in 2016–2017 including Genetic Diagnosis, IVF, Adult Stem Cell, Gamma Knife Radiosurgery, Cosmetic Dermatology, and Hyperbaric Oxygen Therapy. The hospital is part of Koç Healthcare Institutions together with American Hospital, and is recognized as a Baby-Friendly Hospital by Turkey's Ministry of Health.",
    languages: ["Turkish", "English", "Arabic", "Russian", "German"],
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: [
      "Medical Oncology",
      "Radiation Oncology",
      "General Surgery",
      "Organ Transplantation (Liver, Pancreas)",
      "Bone Marrow Transplantation",
      "Cardiology",
      "Cardiovascular Surgery",
      "Neurosurgery",
      "Neurology",
      "Orthopedics and Traumatology",
      "Gynecology and Obstetrics",
      "IVF and Reproductive Medicine",
      "Pediatrics",
      "Pediatric Intensive Care",
      "Neonatal Intensive Care",
      "Genetic Diagnosis",
      "Cosmetic Dermatology",
      "Undersea and Hyperbaric Medicine",
      "Emergency Service",
      "Radiology",
    ],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Koç+Üniversitesi+Hastanesi+Topkapı+Zeytinburnu+Istanbul&z=15&output=embed",
    images: [
      "/images/hospitals/koc-university/1.jpg",
      "/images/hospitals/koc-university/2.jpg",
      "/images/hospitals/koc-university/3.jpg",
      "/images/hospitals/koc-university/4.jpg",
    ],
  },
  {
    slug: "american-hospital",
    name: "American Hospital",
    group: "koc-healthcare",
    city: "Istanbul",
    district: "Nişantaşı",
    accreditations: ["JCI", "ISO 9001", "ISO 14001", "ISO 27001"],
    beds: 241,
    operatingRooms: 12,
    area: "50,000 m²",
    overview:
      "American Hospital, known locally as Amerikan Hastanesi, was founded in 1920 by Rear Admiral Mark L. Bristol of the US Navy as the American Hospital of Constantinople — Turkey's first non-profit private hospital. Originally opened with 45 beds and 3 operating rooms in Çarşıkapı, the hospital moved to its current Nişantaşı location in 1939. In 1995 it joined the non-profit Vehbi Koç Foundation Healthcare Institutions, and in 2020 celebrated its 100th anniversary. American Hospital operates 232 patient rooms, 36 intensive care beds, 12 operating rooms, 161 outpatient clinic rooms, 46 observation beds and 19 chemotherapy units on its Nişantaşı campus, and holds a rooftop helipad for emergency transfers. In March 2024 it became the first private hospital in Turkey to receive ISO 14001 certification, alongside its existing ISO 9001, ISO 27001 and JCI accreditations.",
    languages: ["Turkish", "English", "Arabic", "Russian", "German"],
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: [
      "Cardiology",
      "Cardiovascular Surgery",
      "Medical Oncology",
      "Radiation Oncology",
      "General Surgery",
      "Neurosurgery",
      "Orthopedics and Traumatology",
      "Gynecology and Obstetrics",
      "Pediatrics",
      "Pediatric Surgery",
      "Gastroenterology",
      "Nephrology",
      "Endocrinology and Metabolic Diseases",
      "Dermatology",
      "Plastic, Reconstructive and Aesthetic Surgery",
      "Physical Medicine and Rehabilitation",
      "Chest Diseases",
      "Infectious Diseases",
      "Emergency Service",
      "Intensive Care",
    ],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Güzelbahçe+Sokak+No:20+Nişantaşı+Şişli+Istanbul&z=15&output=embed",
    images: [
      "/images/hospitals/american/1.jpg",
      "/images/hospitals/american/2.jpg",
      "/images/hospitals/american/3.jpg",
      "/images/hospitals/american/4.jpg",
    ],
  },

  // ─────────────────────────────── ESTETHICA (1) ───────────────────────────────
  {
    slug: "estethica",
    name: "Estethica Ataşehir",
    group: "estethica",
    city: "Istanbul",
    district: "Ataşehir",
    accreditations: ["ISO", "TUV SUD"],
    beds: null,
    operatingRooms: null,
    area: "",
    overview: `Estethica is an aesthetic and reconstructive surgery clinic in Ataşehir,
Istanbul, operating since 2006. Unlike the general hospital groups in our
network, Estethica is built entirely around elective procedures — its theatres,
recovery areas and patient pathways are designed for planned treatment rather
than emergency care.

For international patients this changes the experience in practical ways.
Scheduling is arranged around your travel dates, not around emergency
admissions. Consultation, procedure and follow-up are usually completed within
a single trip. And because international patients are a core part of the
clinic's work rather than an add-on, the coordination around your treatment is
built in rather than improvised.

The clinic covers plastic, aesthetic and reconstructive surgery, hair
transplantation, dermatology and medical aesthetics, dental treatment,
ophthalmology and varicose vein treatment. Patients combining procedures — a
hair transplant alongside dental work, for example — can often have both
handled on the same site within the same trip.

Ataşehir suits patients arriving at Sabiha Gökçen Airport: the transfer is
short and avoids crossing the Bosphorus. The district is a modern business
centre with a dense concentration of hotels, practical for stays spanning
several days of appointments and for companions during the procedure.`,
    languages: ESTETHICA_LANGUAGES,
    freeServices: DEFAULT_FREE_SERVICES,
    treatmentUnits: ESTETHICA_TREATMENT_UNITS,
    mapEmbedUrl: "https://maps.google.com/maps?q=Işıklar+Cad+No+28+Ataşehir+Istanbul&z=16&output=embed",
    address: "Küçükbakkalköy Mah., Işıklar Cad. No:28, 34758 Ataşehir, Istanbul",
    images: [
      "/images/hospitals/estethica/1.jpg",
      "/images/hospitals/estethica/2.jpg",
      "/images/hospitals/estethica/3.jpg",
      "/images/hospitals/estethica/4.jpg",
    ],
  },
];

// ─────────────────────────────── HELPERS ───────────────────────────────

export function getHospitalBySlug(slug: string): Hospital | undefined {
  return hospitals.find((h) => h.slug === slug);
}

export function getHospitalsByGroup(groupKey: keyof typeof hospitalGroups): Hospital[] {
  return hospitals.filter((h) => h.group === groupKey);
}

export function getAllHospitalSlugs(): string[] {
  return hospitals.map((h) => h.slug);
}
