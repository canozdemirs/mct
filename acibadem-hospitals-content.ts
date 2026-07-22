// Acıbadem Healthcare Group — detailed content for all 15 Acıbadem hospitals
// Sourced from acibadem.com.tr (EN/TR hospital pages) and Acıbadem Proje Yönetimi project pages.
// Structured to mirror memorial-hospitals-content.ts for consistent merging into lib/hospitals.ts

export const acibademGroupDescription =
  "Acıbadem Healthcare Group, founded in 1991, is one of Turkey's largest private hospital networks, " +
  "operating hospitals across Istanbul, Ankara, Adana, Bursa, Eskişehir, Kayseri, Kocaeli, Bodrum and beyond. " +
  "The group is internationally accredited by JCI (Joint Commission International) and is known for its " +
  "academic medical centers, organ transplantation programs, oncology and cardiovascular surgery expertise, " +
  "and its affiliation with Acıbadem University's School of Medicine.";

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

export interface AcibademHospitalContent {
  slug: string;
  overview: string;
  beds: number;
  operatingRooms?: number;
  intensiveCareBeds?: number;
  area: string; // e.g. "22,000 m²"
}

export const acibademHospitals: AcibademHospitalContent[] = [
  {
    slug: "acibadem-adana-hospital",
    overview:
      "Acıbadem Adana Hospital opened in 2009 to serve patients across Adana and the wider Eastern Mediterranean and Southeast Anatolia region, including referral flow from nearby countries. Operating in a 22,000 m² indoor area, it is JCI-accredited and offers specialized centers in oncology, pediatric bone marrow transplantation, cardiology and cardiovascular surgery.",
    beds: 105,
    operatingRooms: 6,
    intensiveCareBeds: 28,
    area: "22,000 m²",
  },
  {
    slug: "acibadem-ankara-hospital",
    overview:
      "Acıbadem Ankara Hospital opened in 2012 in the Çankaya-Oran district, bringing Acıbadem's JCI-accredited quality standards to the capital and surrounding provinces. The hospital is equipped with advanced diagnostic technology including Flash CT, whole-body MRI and 3D tomosynthesis digital mammography, and offers services across orthopedics, gynecology and obstetrics, general surgery, neurosurgery, ENT, urology and radiology.",
    beds: 103,
    operatingRooms: 4,
    area: "11,000 m²",
  },
  {
    slug: "acibadem-atasehir-hospital",
    overview:
      "Opened on September 1, 2022, Acıbadem Ataşehir Hospital is the group's 18th hospital in Turkey and 24th worldwide. Built in the Acıbadem Holding building, the hospital holds LEED Gold certification for environmental sustainability and uses an AI-driven command center to manage energy use and infrastructure. It includes 10 operating rooms plus a dedicated IVF operating room, minor surgery room, three endoscopy/colonoscopy rooms and two angiography rooms, along with a pediatric clinic in an adjacent building.",
    beds: 300,
    operatingRooms: 10,
    area: "65,000 m²",
  },
  {
    slug: "acibadem-bakirkoy-hospital",
    overview:
      "Acıbadem Bakırköy Hospital opened in 2000 as the group's first hospital on the European side of Istanbul. The hospital operates in an 18,000 m² indoor area with a rooftop heliport for emergency transfers, and its Neonatal Intensive Care Unit is staffed by neonatologists, pediatric subspecialists and pediatric surgeons for high-risk newborns.",
    beds: 102,
    operatingRooms: 7,
    intensiveCareBeds: 27,
    area: "18,000 m²",
  },
  {
    slug: "acibadem-bodrum-hospital",
    overview:
      "Acıbadem Bodrum Hospital opened in June 2012 as a general-purpose hospital serving both year-round residents of the Bodrum peninsula and the region's large seasonal and international tourist population. Designed around the region's natural light and local architectural motifs, the hospital includes interior gardens, dedicated children's areas, a rooftop heliport for emergencies, and centers for oncology, breast health, check-up services and interventional cardiology.",
    beds: 104,
    operatingRooms: 4,
    intensiveCareBeds: 20,
    area: "26,000 m²",
  },
  {
    slug: "acibadem-bursa-hospital",
    overview:
      "Acıbadem Bursa Hospital opened in 2006 as the group's first hospital outside Istanbul. JCI-accredited, the hospital operates in a 30,000 m² facility with dedicated coronary, neonatal, general and cardiovascular surgery intensive care units, alongside a labor-delivery-recovery-postpartum (LDRP) suite for maternity care.",
    beds: 91,
    operatingRooms: 7,
    intensiveCareBeds: 42,
    area: "30,000 m²",
  },
  {
    slug: "acibadem-eskisehir-hospital",
    overview:
      "Acıbadem Eskişehir Hospital opened in 2010, extending care to Eskişehir and neighboring provinces including Afyon, Kütahya and Bilecik. The hospital's smart-building systems monitor over 1,000 points across the facility, and its intensive care rooms use single-patient isolation cabins alongside a dedicated neonatal intensive care unit, two delivery rooms and a baby care room.",
    beds: 107,
    operatingRooms: 5,
    intensiveCareBeds: 34,
    area: "21,137 m²",
  },
  {
    slug: "acibadem-fulya-hospital",
    overview:
      "Acıbadem Fulya Hospital, located in Beşiktaş, operates in a nearly 22,000 m² facility and is home to the group's Sports Medicine Center — recognized by FIFA as a Medical Centre of Excellence. The hospital offers labor-delivery-recovery-postpartum (LDRP) birthing suites, a menopause clinic, breast health center, IVF center, obesity center and a dedicated addiction treatment program alongside its 16-bed intensive care unit.",
    beds: 124,
    operatingRooms: 8,
    intensiveCareBeds: 16,
    area: "22,000 m²",
  },
  {
    slug: "acibadem-international-hospital",
    overview:
      "Located in Yeşilköy, Acıbadem International Hospital began admitting patients in 1989 and joined Acıbadem Healthcare Group in 2005, operating under its current name since 2014. Set on a 19,000 m² indoor area, the hospital houses an Organ Transplant Center performing kidney transplants, alongside cardiac health, IVF and breast health services, plus neurosurgery, thoracic surgery, nuclear medicine and a dedicated sleep laboratory.",
    beds: 112,
    intensiveCareBeds: 26,
    area: "19,000 m²",
  },
  {
    slug: "acibadem-kadikoy-hospital",
    overview:
      "Acıbadem Kadıköy Hospital (Dr. Şinasi Can) expanded its indoor area from 5,000 m² to 17,600 m² in 1998 to meet rising patient demand. The hospital runs a smart-building system monitored across 6,500 control points and is known for high-risk cardiac surgery as well as adult and pediatric hand, knee, shoulder, spine and hip orthopedic procedures.",
    beds: 138,
    intensiveCareBeds: 23,
    area: "17,600 m²",
  },
  {
    slug: "acibadem-kayseri-hospital",
    overview:
      "Acıbadem Kayseri Hospital combines two structures: a historical building first brought into service under Mustafa Kemal Atatürk in 1924 — now restored and housing ophthalmology, medical oncology, dermatology and plastic surgery units — and a modern main hospital building, together covering 22,000 m² and serving patients from Kayseri and the surrounding region.",
    beds: 104,
    operatingRooms: 6,
    intensiveCareBeds: 28,
    area: "22,000 m²",
  },
  {
    slug: "acibadem-kocaeli-hospital",
    overview:
      "Acıbadem Kocaeli Hospital serves patients in Kocaeli and the surrounding Marmara region, operating in a 6,500 m² facility with free patient parking and on-site banking services.",
    beds: 55,
    area: "6,500 m²",
  },
  {
    slug: "acibadem-kozyatagi-hospital",
    overview:
      "Acıbadem Kozyatağı Hospital, the group's third hospital, has served patients on Istanbul's Anatolian side since 2004. Operating in a 13,700 m² facility, its Neonatal Intensive Care Unit brings together neonatologists, pediatric subspecialists and pediatric surgeons for high-risk newborn care.",
    beds: 75,
    operatingRooms: 4,
    intensiveCareBeds: 13,
    area: "13,700 m²",
  },
  {
    slug: "acibadem-maslak-hospital",
    overview:
      "Acıbadem Maslak Hospital began admitting patients in 2009 and, following a 2018 expansion, became the group's largest hospital at 106,000 m². Set beside forested land near the city center with metro access, the hospital holds LEED Gold certification and specializes in MAP/IVF and infertility treatment, alongside a broad range of surgical and diagnostic services.",
    beds: 364,
    area: "106,000 m²",
  },
  {
    slug: "acibadem-taksim-hospital",
    overview:
      "Acıbadem Taksim Hospital opened in October 2015 as the group's 18th hospital, designed as a general-purpose facility in the heart of Istanbul's Beyoğlu district. Its Emergency Department has separate ambulance and patient entrances with dedicated resuscitation, surgical and orthopedic procedure rooms, and the hospital is a candidate Mother-Friendly Hospital offering full labor, prepartum and postpartum counseling services.",
    beds: 93,
    operatingRooms: 7,
    intensiveCareBeds: 17,
    area: "24,000 m²",
  },
];
