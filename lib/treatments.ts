// lib/treatments.ts
export type PackageTier = "hassle-free" | "gold" | "premium" | "exclusive";

export interface TreatmentCategory {
  slug: string;
  name: string;
  category: "hair" | "aesthetic" | "dental" | "checkup" | "general-medical";
  shortDescription: string;
  priceFrom: number;
  priceRangeUsd: [number, number];
  icon: string;
  heroImageQuery?: string;
}

export const treatments: TreatmentCategory[] = [
  {
    slug: "hair-transplant",
    name: "Hair Transplant (FUE/DHI)",
    category: "hair",
    shortDescription: "FUE and DHI hair restoration with natural hairline design.",
    priceFrom: 1500,
    priceRangeUsd: [1500, 4000],
    icon: "Sparkles",
  },
  {
    slug: "rhinoplasty",
    name: "Rhinoplasty (Nose Job)",
    category: "aesthetic",
    shortDescription: "Functional and cosmetic nose reshaping surgery.",
    priceFrom: 2500,
    priceRangeUsd: [2500, 5000],
    icon: "Wand2",
  },
  {
    slug: "breast-augmentation",
    name: "Breast Augmentation",
    category: "aesthetic",
    shortDescription: "Implant or fat-transfer breast enlargement.",
    priceFrom: 3000,
    priceRangeUsd: [3000, 6000],
    icon: "Heart",
  },
  {
    slug: "liposuction",
    name: "Liposuction",
    category: "aesthetic",
    shortDescription: "Body contouring and fat removal, single or multi-area.",
    priceFrom: 2000,
    priceRangeUsd: [2000, 5000],
    icon: "Activity",
  },
  {
    slug: "tummy-tuck",
    name: "Tummy Tuck (Abdominoplasty)",
    category: "aesthetic",
    shortDescription: "Abdominal contouring, often combined with liposuction.",
    priceFrom: 3500,
    priceRangeUsd: [3500, 6500],
    icon: "Activity",
  },
  {
    slug: "bbl",
    name: "Brazilian Butt Lift (BBL)",
    category: "aesthetic",
    shortDescription: "Fat-transfer body contouring for enhanced curves.",
    priceFrom: 3500,
    priceRangeUsd: [3500, 6500],
    icon: "Activity",
  },
  {
    slug: "facelift",
    name: "Facelift & Necklift",
    category: "aesthetic",
    shortDescription: "Surgical facial rejuvenation for a natural, youthful look.",
    priceFrom: 4000,
    priceRangeUsd: [4000, 8000],
    icon: "Smile",
  },
  {
    slug: "dental-veneers-implants",
    name: "Dental Veneers & Implants (Hollywood Smile)",
    category: "dental",
    shortDescription: "Full smile makeover with veneers, crowns, and implants.",
    priceFrom: 2000,
    priceRangeUsd: [2000, 6000],
    icon: "Smile",
  },
  {
    slug: "medical-check-up",
    name: "Medical Check-up Packages",
    category: "checkup",
    shortDescription: "Comprehensive health screening, from standard to VIP.",
    priceFrom: 550,
    priceRangeUsd: [550, 2700],
    icon: "Stethoscope",
  },
  {
    slug: "bariatric-surgery",
    name: "Bariatric (Weight-Loss) Surgery",
    category: "general-medical",
    shortDescription: "Gastric sleeve and related weight-loss procedures.",
    priceFrom: 3500,
    priceRangeUsd: [3500, 6000],
    icon: "Activity",
  },
];

export const categoryLabels: Record<TreatmentCategory["category"], string> = {
  hair: "Hair Transplant",
  aesthetic: "Plastic & Aesthetic Surgery",
  dental: "Dental",
  checkup: "Medical Check-up",
  "general-medical": "General Medical Treatments",
};
