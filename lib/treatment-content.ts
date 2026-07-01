// Per-treatment detailed content for /treatments/[slug] pages

export interface TreatmentDetail {
  metaTitle: string;
  metaDescription: string;
  intro: string;
  howPerformed: string;
  stayDuration: string;
  faqs: Array<{ q: string; a: string }>;
  packages: Array<{
    tier: "hassle-free" | "gold" | "premium" | "exclusive";
    name: string;
    inclusions: string[];
    priceUsd: number;
    highlight?: boolean;
  }>;
}

export const treatmentDetails: Record<string, TreatmentDetail> = {
  "hair-transplant": {
    metaTitle: "Hair Transplant in Turkey — FUE & DHI Packages from $1,500",
    metaDescription:
      "Hair transplant in Turkey with FUE and DHI techniques. Ministry of Health certified hospitals in Istanbul. All-inclusive packages from $1,500 — transfer, hotel, follow-up included.",
    intro:
      "Hair transplant in Turkey has become the world's most popular medical tourism procedure for good reason: Istanbul surgeons perform tens of thousands of procedures each year using the same FUE and DHI techniques used in the UK and US — at 60–75% lower cost. Medical Center Turkey coordinates your entire journey: hospital selection, travel, accommodation, and post-operative care.",
    howPerformed:
      "Under local anaesthesia, healthy follicular units are extracted individually from the donor area at the back of the scalp (FUE technique) or implanted directly using a precision Choi implanter pen (DHI technique). A typical session of 2,500–4,000 grafts takes 6–8 hours and is performed as a day procedure.",
    stayDuration: "3–5 days",
    faqs: [
      {
        q: "Is hair transplant in Turkey safe?",
        a: "Yes — when performed in Ministry of Health certified hospitals with board-certified surgeons. MCT only partners with JCI-accredited or equivalent facilities that follow international sterilisation and safety protocols.",
      },
      {
        q: "What is the difference between FUE and DHI?",
        a: "FUE (Follicular Unit Extraction) extracts grafts and places them into pre-opened channels. DHI (Direct Hair Implantation) uses a Choi pen to extract and implant in a single step, reducing time outside the scalp. DHI typically offers higher graft survival and denser results.",
      },
      {
        q: "How many grafts will I need?",
        a: "The number depends on the extent of hair loss. A Norwood 3 pattern typically requires 1,500–2,500 grafts; advanced loss (Norwood 5–6) may need 3,000–4,500 grafts. Your case manager will assess your photos before providing a personalised recommendation.",
      },
      {
        q: "When will I see results?",
        a: "Transplanted hair sheds 2–4 weeks after surgery — this is normal. New growth begins at 3–4 months, with significant density visible at 8–10 months. Final results are assessed at 12–18 months.",
      },
      {
        q: "How much does hair transplant cost in Turkey compared to the UK?",
        a: "A comparable procedure in the UK or USA costs £8,000–£15,000. MCT packages start from $1,500 (approx. £1,200), including hospital, hotel, and transfers. The quality of technique and equipment is equivalent.",
      },
    ],
    packages: [
      {
        tier: "hassle-free",
        name: "Hassle-Free",
        inclusions: [
          "FUE or DHI technique",
          "Ministry of Health certified hospital",
          "VIP airport transfer",
          "3-night hotel accommodation",
          "Post-op care kit",
          "12-month follow-up support",
        ],
        priceUsd: 1500,
      },
      {
        tier: "gold",
        name: "Gold",
        inclusions: [
          "Everything in Hassle-Free",
          "Private hospital room",
          "4-star hotel upgrade",
          "Dedicated case manager",
          "24/7 WhatsApp support",
          "PRP hair treatment session",
        ],
        priceUsd: 2000,
        highlight: true,
      },
      {
        tier: "premium",
        name: "Premium",
        inclusions: [
          "Everything in Gold",
          "Pre-op blood tests included",
          "Full medication package",
          "Video hair density analysis",
          "City tour (half day)",
          "Priority scheduling",
        ],
        priceUsd: 2500,
      },
      {
        tier: "exclusive",
        name: "Exclusive",
        inclusions: [
          "Everything in Premium",
          "5-star hotel (5 nights)",
          "Private driver throughout stay",
          "Senior surgeon consultation",
          "VIP lounge at airport",
          "Lifetime follow-up protocol",
        ],
        priceUsd: 3500,
      },
    ],
  },

  rhinoplasty: {
    metaTitle: "Rhinoplasty in Turkey — Nose Job Packages from $2,500",
    metaDescription:
      "Rhinoplasty in Turkey with experienced plastic surgeons. Open and closed techniques. All-inclusive packages from $2,500 in Istanbul's top certified hospitals.",
    intro:
      "Turkey is one of the world's leading destinations for rhinoplasty, with Istanbul surgeons routinely performing both functional and cosmetic nose reshaping for international patients. Medical Center Turkey coordinates your consultation, surgery, recovery accommodation, and follow-up — so you focus on your results, not logistics.",
    howPerformed:
      "Rhinoplasty is performed under general anaesthesia as an inpatient procedure lasting 2–3 hours. The closed technique (incisions inside the nostrils) leaves no visible scarring; the open technique (a small incision on the columella) allows greater surgical precision for complex cases. Most patients are discharged the following day.",
    stayDuration: "7–10 days",
    faqs: [
      {
        q: "Is rhinoplasty in Turkey safe?",
        a: "Turkey's plastic surgery sector is regulated by the Ministry of Health. MCT partners only with hospitals that have JCI accreditation or equivalent, with surgeons holding European or Turkish Board certification in plastic and reconstructive surgery.",
      },
      {
        q: "What is the difference between open and closed rhinoplasty?",
        a: "Open rhinoplasty involves a small incision on the columella (skin between the nostrils), giving the surgeon full access to the cartilage framework. Closed rhinoplasty uses incisions entirely inside the nose. Open is preferred for complex reshaping; closed suits minor refinements with faster healing.",
      },
      {
        q: "How long does swelling last after rhinoplasty?",
        a: "Initial swelling reduces significantly within the first 2–3 weeks. Around 70% of swelling is gone by 3 months, but full refinement of the nasal tip takes 12–18 months. Most patients look presentable for work within 10–14 days.",
      },
      {
        q: "Do I need to stay in Turkey for the full recovery?",
        a: "We recommend staying 7–10 days minimum so the surgeon can remove the cast and check healing before you fly. Flying too early can increase swelling and bleeding risk. Your aftercare plan is included in all packages.",
      },
      {
        q: "How much can I save getting rhinoplasty in Turkey vs the UK?",
        a: "Rhinoplasty in the UK costs £6,000–£12,000. In Turkey through MCT, packages start from $2,500 (approx. £2,000) including hospital, hotel, and transfers — representing a saving of 65–80%.",
      },
    ],
    packages: [
      {
        tier: "hassle-free",
        name: "Hassle-Free",
        inclusions: [
          "Open or closed rhinoplasty",
          "General anaesthesia included",
          "1-night hospital stay",
          "VIP airport transfer",
          "5-night hotel accommodation",
          "Post-op nasal care kit",
        ],
        priceUsd: 2500,
      },
      {
        tier: "gold",
        name: "Gold",
        inclusions: [
          "Everything in Hassle-Free",
          "Private hospital room",
          "4-star hotel upgrade",
          "Dedicated case manager",
          "Cast removal appointment",
          "24/7 WhatsApp support",
        ],
        priceUsd: 3000,
        highlight: true,
      },
      {
        tier: "premium",
        name: "Premium",
        inclusions: [
          "Everything in Gold",
          "Pre-op blood & anaesthesia tests",
          "Full medication pack",
          "3D nose simulation session",
          "Scar-care gel kit",
          "Nutrition consultation",
        ],
        priceUsd: 3500,
      },
      {
        tier: "exclusive",
        name: "Exclusive",
        inclusions: [
          "Everything in Premium",
          "5-star hotel (8 nights)",
          "Private driver throughout",
          "Senior surgeon direct line",
          "VIP airport lounge",
          "12-month virtual follow-up",
        ],
        priceUsd: 4500,
      },
    ],
  },

  "breast-augmentation": {
    metaTitle: "Breast Augmentation in Turkey — Implant Packages from $3,000",
    metaDescription:
      "Breast augmentation in Turkey with silicone implants. Board-certified plastic surgeons in Istanbul. All-inclusive packages from $3,000 including hospital, hotel, and transfers.",
    intro:
      "Breast augmentation in Turkey combines world-class surgical expertise with significant cost savings. Istanbul's certified plastic surgeons use the same Mentor and Motiva implants used in the UK and Europe, within JCI-accredited hospitals — at 60–70% of the price. MCT manages every detail from pre-operative consultation to your safe return home.",
    howPerformed:
      "Breast augmentation is performed under general anaesthesia, typically as a 1–2 hour procedure. Implants are inserted through a small incision in the inframammary fold (most common), the areola, or the armpit. The implants — either round or anatomical, saline or silicone gel — are placed beneath the breast tissue or the pectoral muscle depending on your anatomy.",
    stayDuration: "5–7 days",
    faqs: [
      {
        q: "Which implant brands are used in Turkey?",
        a: "MCT's partner hospitals use FDA-approved, CE-marked implants from leading brands including Mentor, Motiva, and Polytech — the same brands used in the UK and US. Implant choice is made in consultation with your surgeon based on your anatomy and goals.",
      },
      {
        q: "How long do breast implants last?",
        a: "Modern silicone implants are designed to last 15–20 years or more. They are not lifetime devices, but the majority of patients do not require replacement unless they wish to change size or experience a complication.",
      },
      {
        q: "What is recovery like after breast augmentation?",
        a: "Most patients experience 3–5 days of moderate discomfort managed with prescribed medication. Swelling and firmness are normal for 4–6 weeks. Patients can return to desk work within 1–2 weeks and exercise after 6 weeks.",
      },
      {
        q: "Can I combine breast augmentation with other procedures?",
        a: "Yes. Many patients combine breast augmentation with a lift (mastopexy) or liposuction. MCT can coordinate combination procedures and adjust your package and stay accordingly.",
      },
      {
        q: "How much does breast augmentation cost in Turkey vs the UK?",
        a: "In the UK, breast augmentation typically costs £6,000–£10,000. MCT packages in Turkey start from $3,000 (approx. £2,400), including implants, hospital, hotel, and transfers.",
      },
    ],
    packages: [
      {
        tier: "hassle-free",
        name: "Hassle-Free",
        inclusions: [
          "CE-marked silicone implants",
          "General anaesthesia",
          "1-night hospital stay",
          "VIP airport transfer",
          "5-night hotel",
          "Compression garment",
        ],
        priceUsd: 3000,
      },
      {
        tier: "gold",
        name: "Gold",
        inclusions: [
          "Everything in Hassle-Free",
          "Premium implant brand upgrade",
          "Private hospital room",
          "4-star hotel upgrade",
          "Dedicated case manager",
          "24/7 WhatsApp support",
        ],
        priceUsd: 3800,
        highlight: true,
      },
      {
        tier: "premium",
        name: "Premium",
        inclusions: [
          "Everything in Gold",
          "Pre-op labs & mammogram",
          "Full medication kit",
          "3D surgical simulation",
          "Scar-minimisation treatment",
          "Nutrition plan",
        ],
        priceUsd: 4500,
      },
      {
        tier: "exclusive",
        name: "Exclusive",
        inclusions: [
          "Everything in Premium",
          "5-star hotel (7 nights)",
          "Private driver",
          "Senior surgeon priority",
          "VIP airport lounge",
          "1-year follow-up protocol",
        ],
        priceUsd: 5500,
      },
    ],
  },

  liposuction: {
    metaTitle: "Liposuction in Turkey — Body Contouring Packages from $2,000",
    metaDescription:
      "Liposuction and Vaser liposuction in Turkey. Single or multi-area body contouring with board-certified surgeons in Istanbul. Packages from $2,000.",
    intro:
      "Liposuction in Turkey offers precision body contouring through traditional, Vaser (ultrasound-assisted), or power-assisted techniques. Istanbul's plastic surgery centres treat high volumes of international patients, giving surgeons extensive experience with complex multi-area cases. MCT coordinates your full journey and ensures aftercare continuity when you return home.",
    howPerformed:
      "Under general or local anaesthesia (depending on area size), a thin cannula is inserted through tiny incisions to break up and suction out fat deposits. Vaser liposuction first emulsifies fat cells with ultrasound energy for smoother results and faster recovery. Hi-Def liposuction sculpts around the muscle for athletic definition.",
    stayDuration: "4–6 days",
    faqs: [
      {
        q: "What is the difference between traditional and Vaser liposuction?",
        a: "Traditional liposuction uses mechanical movement to dislodge fat before suctioning. Vaser uses ultrasound energy to liquefy fat cells first, allowing more precise removal, better skin retraction, and typically less bruising and a faster recovery.",
      },
      {
        q: "How much fat can be removed with liposuction?",
        a: "Safety guidelines typically limit fat removal to 5–6 litres per session. Larger volume cases may require staging across two procedures. Your surgeon will advise during consultation.",
      },
      {
        q: "Is liposuction a weight-loss treatment?",
        a: "No. Liposuction is a body contouring procedure, not a weight-loss solution. It removes localised fat deposits that are resistant to diet and exercise. Ideal candidates are close to their target weight.",
      },
      {
        q: "When can I see results after liposuction?",
        a: "Initial swelling hides results for 4–6 weeks. Most patients see clear improvement at 3 months, with final contour visible at 6 months when all swelling has resolved.",
      },
      {
        q: "What areas can be treated with liposuction?",
        a: "Common areas include the abdomen, flanks (love handles), back, thighs, arms, chin, and knees. MCT can coordinate multi-area sessions in a single procedure to maximise your trip.",
      },
    ],
    packages: [
      {
        tier: "hassle-free",
        name: "Hassle-Free",
        inclusions: [
          "Single area liposuction",
          "General or local anaesthesia",
          "1-night hospital stay",
          "VIP airport transfer",
          "4-night hotel",
          "Compression garment",
        ],
        priceUsd: 2000,
      },
      {
        tier: "gold",
        name: "Gold",
        inclusions: [
          "Everything in Hassle-Free",
          "Vaser technique upgrade",
          "Up to 2 areas",
          "Private hospital room",
          "Dedicated case manager",
          "Post-op lymphatic massage (2 sessions)",
        ],
        priceUsd: 2800,
        highlight: true,
      },
      {
        tier: "premium",
        name: "Premium",
        inclusions: [
          "Everything in Gold",
          "Up to 4 areas",
          "Pre-op lab tests included",
          "Full medication kit",
          "5 lymphatic massage sessions",
          "4-star hotel upgrade",
        ],
        priceUsd: 3500,
      },
      {
        tier: "exclusive",
        name: "Exclusive",
        inclusions: [
          "Everything in Premium",
          "Hi-Def or multi-area unlimited",
          "5-star hotel (6 nights)",
          "Private driver throughout",
          "Senior surgeon priority",
          "VIP airport lounge",
        ],
        priceUsd: 4800,
      },
    ],
  },

  "tummy-tuck": {
    metaTitle: "Tummy Tuck in Turkey — Abdominoplasty Packages from $3,500",
    metaDescription:
      "Tummy tuck (abdominoplasty) in Turkey. Surgical abdominal contouring with certified plastic surgeons in Istanbul. All-inclusive packages from $3,500.",
    intro:
      "A tummy tuck (abdominoplasty) removes excess skin and fat from the abdomen and tightens the underlying muscle wall, producing a firmer, flatter profile. Turkey is a leading destination for post-pregnancy and post-weight-loss body contouring, with Istanbul surgeons routinely combining abdominoplasty with liposuction for comprehensive results.",
    howPerformed:
      "Performed under general anaesthesia, a full abdominoplasty involves a horizontal incision from hip to hip, removal of excess skin, tightening of the rectus abdominis muscles, and repositioning of the navel. A mini abdominoplasty addresses only the lower abdomen with a shorter incision. Most patients stay one night in hospital.",
    stayDuration: "7–10 days",
    faqs: [
      {
        q: "What is the difference between a full and mini tummy tuck?",
        a: "A full tummy tuck addresses the entire abdominal area — above and below the navel — and repositions the belly button. A mini tummy tuck focuses on the lower abdomen only, with a shorter scar and no navel repositioning. Your surgeon will recommend the appropriate type based on your anatomy.",
      },
      {
        q: "Can I combine a tummy tuck with liposuction?",
        a: "Yes, and it is common. Liposuction of the flanks and outer abdomen is frequently performed alongside a tummy tuck for more complete contouring. Your MCT package can be tailored accordingly.",
      },
      {
        q: "When can I return to normal activity after a tummy tuck?",
        a: "Light walking is encouraged from day 2. Most patients return to desk work after 2–3 weeks and resume full exercise after 6–8 weeks. Compression garments are worn for 6 weeks.",
      },
      {
        q: "Will I have a visible scar?",
        a: "Yes — a tummy tuck scar runs horizontally low on the abdomen, typically hidden below a bikini line. Scar appearance improves significantly over 12–18 months with proper aftercare.",
      },
      {
        q: "How much does a tummy tuck cost in Turkey vs the UK?",
        a: "UK prices range from £7,000 to £12,000. MCT tummy tuck packages in Turkey start from $3,500 (approx. £2,800), including hospital, hotel, and transfers.",
      },
    ],
    packages: [
      {
        tier: "hassle-free",
        name: "Hassle-Free",
        inclusions: [
          "Full or mini abdominoplasty",
          "General anaesthesia",
          "2-night hospital stay",
          "VIP airport transfer",
          "7-night hotel accommodation",
          "Compression garment",
        ],
        priceUsd: 3500,
      },
      {
        tier: "gold",
        name: "Gold",
        inclusions: [
          "Everything in Hassle-Free",
          "Flank liposuction included",
          "Private hospital room",
          "4-star hotel upgrade",
          "Dedicated case manager",
          "Post-op drain management support",
        ],
        priceUsd: 4500,
        highlight: true,
      },
      {
        tier: "premium",
        name: "Premium",
        inclusions: [
          "Everything in Gold",
          "Pre-op lab tests included",
          "Full medication kit",
          "3 lymphatic massage sessions",
          "Scar-minimisation protocol",
          "Nutritionist consultation",
        ],
        priceUsd: 5500,
      },
      {
        tier: "exclusive",
        name: "Exclusive",
        inclusions: [
          "Everything in Premium",
          "5-star hotel (10 nights)",
          "Private driver throughout",
          "Senior surgeon priority access",
          "VIP airport lounge",
          "12-month virtual follow-up",
        ],
        priceUsd: 6500,
      },
    ],
  },

  bbl: {
    metaTitle: "Brazilian Butt Lift (BBL) in Turkey — Packages from $3,500",
    metaDescription:
      "Brazilian Butt Lift (BBL) in Turkey. Fat-transfer body contouring with board-certified surgeons in Istanbul. All-inclusive packages from $3,500.",
    intro:
      "The Brazilian Butt Lift (BBL) uses your own fat — harvested through liposuction — to enhance the shape and volume of the buttocks. No implants. Turkey has become one of the most sought-after destinations for BBL surgery, with Istanbul surgeons offering high-volume expertise and exceptional results at a fraction of UK or US costs.",
    howPerformed:
      "Under general anaesthesia, liposuction is performed on the abdomen, flanks, thighs, or back to harvest fat. The collected fat is purified and then carefully injected into targeted areas of the buttocks in multiple layers to create shape and projection. The procedure typically takes 2–4 hours.",
    stayDuration: "7–10 days",
    faqs: [
      {
        q: "Is BBL safe?",
        a: "BBL carries surgical risks like any procedure, but advances in technique — particularly injecting fat above the muscle rather than into it — have significantly improved safety. MCT partners only with high-volume BBL surgeons in certified hospitals who follow the latest safety protocols.",
      },
      {
        q: "How long do BBL results last?",
        a: "Around 60–80% of transferred fat survives permanently once the vascular supply is established (typically 3–6 months post-op). Maintaining a stable weight is key to preserving results long-term.",
      },
      {
        q: "Do I need to avoid sitting after BBL?",
        a: "Yes. For the first 6–8 weeks, patients are advised to avoid direct pressure on the buttocks when sitting. Special BBL pillows (provided in your kit) allow you to sit without compressing the transferred fat.",
      },
      {
        q: "How much fat do I need for BBL?",
        a: "A minimum body fat percentage of around 22% is generally required to harvest enough fat for meaningful augmentation. Patients who are very lean may not be suitable candidates. Your surgeon will assess during consultation.",
      },
      {
        q: "How much does BBL cost in Turkey vs the UK or US?",
        a: "BBL in the UK costs £8,000–£14,000; in the US, $10,000–$20,000. MCT packages in Turkey start from $3,500 (approx. £2,800), including surgery, hospital, hotel, and all transfers.",
      },
    ],
    packages: [
      {
        tier: "hassle-free",
        name: "Hassle-Free",
        inclusions: [
          "Fat-transfer BBL (no implants)",
          "Liposuction of harvest areas",
          "2-night hospital stay",
          "VIP airport transfer",
          "7-night hotel accommodation",
          "BBL pillow & compression garment",
        ],
        priceUsd: 3500,
      },
      {
        tier: "gold",
        name: "Gold",
        inclusions: [
          "Everything in Hassle-Free",
          "Private hospital room",
          "4-star hotel upgrade",
          "Dedicated case manager",
          "Post-op lymphatic massage (2 sessions)",
          "24/7 WhatsApp support",
        ],
        priceUsd: 4500,
        highlight: true,
      },
      {
        tier: "premium",
        name: "Premium",
        inclusions: [
          "Everything in Gold",
          "Pre-op labs included",
          "Full medication kit",
          "5 lymphatic massage sessions",
          "Scar care kit",
          "3D body simulation session",
        ],
        priceUsd: 5500,
      },
      {
        tier: "exclusive",
        name: "Exclusive",
        inclusions: [
          "Everything in Premium",
          "5-star hotel (10 nights)",
          "Private driver throughout",
          "Senior surgeon priority",
          "VIP airport lounge",
          "12-month virtual follow-up",
        ],
        priceUsd: 6500,
      },
    ],
  },

  facelift: {
    metaTitle: "Facelift & Necklift in Turkey — Packages from $4,000",
    metaDescription:
      "Facelift and necklift in Turkey with experienced plastic surgeons in Istanbul. Natural rejuvenation results. All-inclusive packages from $4,000.",
    intro:
      "A facelift (rhytidectomy) addresses sagging skin, deep folds, and loss of definition in the face and neck — delivering a natural, refreshed appearance that non-surgical treatments cannot achieve. Istanbul's plastic surgeons are internationally trained in modern SMAS and deep-plane techniques that produce long-lasting, non-pulled results.",
    howPerformed:
      "Under general anaesthesia, incisions are placed discreetly around the ear and into the hairline. The underlying SMAS (muscle and fascia layer) is repositioned and tightened before the skin is re-draped. A necklift may be performed simultaneously. Hospitalisation is typically 1–2 nights.",
    stayDuration: "10–14 days",
    faqs: [
      {
        q: "What is the difference between a SMAS facelift and a deep-plane facelift?",
        a: "A SMAS facelift tightens the superficial muscle layer beneath the skin, which is the standard modern technique. A deep-plane facelift releases and repositions deeper tissue planes, producing more comprehensive rejuvenation of the mid-face and nasolabial folds. Your surgeon will recommend the appropriate technique.",
      },
      {
        q: "How natural will my results look?",
        a: "Modern facelift techniques focus on repositioning tissue rather than simply pulling skin, which is what produces the unnatural 'windswept' look. Our partner surgeons specialise in natural, age-appropriate results.",
      },
      {
        q: "How long does facelift recovery take?",
        a: "Bruising and swelling peak at 5–7 days and subside significantly by 2–3 weeks. Most patients feel comfortable in public at 3–4 weeks. Final results — with all swelling resolved — are seen at 3–6 months.",
      },
      {
        q: "How long do facelift results last?",
        a: "A well-performed facelift typically maintains its benefit for 8–12 years. It does not stop the ageing process but effectively resets the clock by approximately a decade.",
      },
      {
        q: "How much does a facelift cost in Turkey vs the UK?",
        a: "Facelift surgery in the UK costs £10,000–£20,000. MCT packages in Turkey start from $4,000 (approx. £3,200), including surgery, hospital, hotel, and all transfers.",
      },
    ],
    packages: [
      {
        tier: "hassle-free",
        name: "Hassle-Free",
        inclusions: [
          "SMAS facelift or combined necklift",
          "General anaesthesia",
          "2-night hospital stay",
          "VIP airport transfer",
          "10-night hotel accommodation",
          "Post-op recovery kit",
        ],
        priceUsd: 4000,
      },
      {
        tier: "gold",
        name: "Gold",
        inclusions: [
          "Everything in Hassle-Free",
          "Eyelid refinement add-on option",
          "Private hospital room",
          "4-star hotel upgrade",
          "Dedicated case manager",
          "24/7 WhatsApp support",
        ],
        priceUsd: 5500,
        highlight: true,
      },
      {
        tier: "premium",
        name: "Premium",
        inclusions: [
          "Everything in Gold",
          "Deep-plane technique upgrade",
          "Pre-op labs included",
          "Full medication kit",
          "Post-op facial therapy (3 sessions)",
          "Scar minimisation protocol",
        ],
        priceUsd: 6500,
      },
      {
        tier: "exclusive",
        name: "Exclusive",
        inclusions: [
          "Everything in Premium",
          "5-star hotel (12 nights)",
          "Private driver throughout",
          "Senior surgeon priority access",
          "VIP airport lounge",
          "18-month virtual follow-up",
        ],
        priceUsd: 8000,
      },
    ],
  },

  "dental-veneers-implants": {
    metaTitle: "Dental Veneers & Implants in Turkey — Hollywood Smile from $2,000",
    metaDescription:
      "Dental veneers, implants and Hollywood Smile in Turkey. Certified dental clinics in Istanbul. Full smile makeover packages from $2,000 — no hidden fees.",
    intro:
      "Turkey is Europe's most popular destination for dental treatment — particularly full smile makeovers combining veneers, crowns, and implants. Istanbul dental clinics use the same Ivoclar, 3M, and Straumann materials as clinics in the UK and Germany, with comparable quality at 50–70% lower cost. MCT coordinates your dental journey from consultation to completion.",
    howPerformed:
      "Veneers are ultra-thin porcelain or composite shells bonded to the front surfaces of teeth after minimal enamel preparation. Implants involve placing a titanium root into the jawbone (osseointegration takes 3–6 months) followed by a crown. Hollywood Smile packages typically combine veneers on upper and lower arches for a complete transformation.",
    stayDuration: "5–7 days (veneers) / 2 visits for implants",
    faqs: [
      {
        q: "How long do dental veneers last?",
        a: "Porcelain veneers typically last 10–15 years with proper care. They are stain-resistant and highly durable. Composite veneers are less expensive but last 5–8 years.",
      },
      {
        q: "Does getting veneers damage my natural teeth?",
        a: "Minimal enamel reduction (0.3–0.5mm) is required to bond porcelain veneers. The process is irreversible, so it is important to have a thorough consultation with your dentist before proceeding.",
      },
      {
        q: "How many visits to Turkey do I need for dental implants?",
        a: "Traditional implants require two visits: the first to place the implant (which then integrates with the bone over 3–6 months), and a second to fit the permanent crown. Same-day implant solutions (All-on-4, immediate load) are available for suitable candidates.",
      },
      {
        q: "Are the dental materials the same quality as in the UK?",
        a: "Yes. MCT partner clinics use internationally certified materials including Ivoclar Vivadent ceramics, Straumann and Nobel Biocare implants, and 3M bonding systems — the same brands used by leading UK dental practices.",
      },
      {
        q: "How much can I save on dental treatment in Turkey?",
        a: "A full Hollywood Smile (16–20 veneers) costs £12,000–£20,000 in the UK. In Turkey, MCT packages start from $2,000 (approx. £1,600) for a full arch. Individual implants cost £800–£1,200 in Turkey vs £2,500–£3,500 in the UK.",
      },
    ],
    packages: [
      {
        tier: "hassle-free",
        name: "Hassle-Free",
        inclusions: [
          "Up to 10 porcelain veneers or 2 implants",
          "Full dental consultation & X-ray",
          "VIP airport transfer",
          "5-night hotel accommodation",
          "Whitening kit",
          "Digital smile design session",
        ],
        priceUsd: 2000,
      },
      {
        tier: "gold",
        name: "Gold",
        inclusions: [
          "Up to 16 veneers or 4 implants",
          "Everything in Hassle-Free",
          "Premium Ivoclar ceramic upgrade",
          "4-star hotel upgrade",
          "Dedicated case manager",
          "Temporary veneers during lab phase",
        ],
        priceUsd: 3500,
        highlight: true,
      },
      {
        tier: "premium",
        name: "Premium",
        inclusions: [
          "Full arch (20 veneers) or 6 implants",
          "Everything in Gold",
          "Gum contouring if needed",
          "Full-mouth X-ray & 3D scan",
          "Professional cleaning session",
          "Retainer included",
        ],
        priceUsd: 4500,
      },
      {
        tier: "exclusive",
        name: "Exclusive",
        inclusions: [
          "Unlimited veneers + implants",
          "Everything in Premium",
          "5-star hotel (7 nights)",
          "Private driver throughout",
          "VIP airport lounge",
          "3-year warranty on all work",
        ],
        priceUsd: 6000,
      },
    ],
  },

  "medical-check-up": {
    metaTitle: "Medical Check-up Packages in Turkey — From $550",
    metaDescription:
      "Comprehensive medical check-up packages in Turkey. Standard, VIP, and executive health screening in Istanbul's top hospitals. From $550 — full blood panel, cardiac screening, and specialist review.",
    intro:
      "Medical check-up packages in Turkey offer comprehensive health screening at world-class Istanbul hospitals — with same-day results, specialist consultations, and a fraction of the cost of equivalent private health screening in the UK or US. MCT coordinates all appointments, transfers, and results interpretation in English.",
    howPerformed:
      "Check-up packages are day procedures conducted at partner hospitals. A typical programme includes a full blood panel, cardiac tests (ECG, stress test, echocardiography), abdominal ultrasound, chest X-ray, lung function tests, and specialist physician reviews. Results and a full report are provided the same day.",
    stayDuration: "2–4 days",
    faqs: [
      {
        q: "What is included in a standard check-up package?",
        a: "A standard package typically includes a full blood panel, complete metabolic panel, lipid profile, thyroid function, ECG, abdominal ultrasound, chest X-ray, and a physician consultation. Results are provided the same day.",
      },
      {
        q: "What is included in a VIP or executive check-up?",
        a: "VIP packages add cardiac stress testing, echocardiography, pulmonary function testing, bone densitometry, tumour markers, and specialist department reviews (cardiology, gastroenterology, etc.).",
      },
      {
        q: "Do I need to fast before my check-up?",
        a: "Yes — most blood tests require fasting for 8–12 hours before the appointment. Your pre-arrival preparation guide will outline what to eat, drink, and avoid.",
      },
      {
        q: "Will I receive my results in English?",
        a: "All MCT check-up reports are provided in English with a physician explanation session. Your results and recommendations are summarised in a written report you can share with your GP at home.",
      },
      {
        q: "How much does a medical check-up in Turkey cost vs the UK?",
        a: "A comprehensive private health screen in the UK costs £2,000–£5,000. MCT check-up packages in Istanbul start from $550 (approx. £450) for a comprehensive standard screen, up to $2,700 for a full VIP executive programme.",
      },
    ],
    packages: [
      {
        tier: "hassle-free",
        name: "Standard",
        inclusions: [
          "Full blood panel & metabolic panel",
          "ECG & chest X-ray",
          "Abdominal ultrasound",
          "Physician consultation",
          "Same-day English results report",
          "VIP airport transfer",
        ],
        priceUsd: 550,
      },
      {
        tier: "gold",
        name: "Executive",
        inclusions: [
          "Everything in Standard",
          "Cardiac stress test & echo",
          "Pulmonary function test",
          "Tumour markers panel",
          "Specialist department reviews",
          "4-star hotel (1 night)",
        ],
        priceUsd: 1200,
        highlight: true,
      },
      {
        tier: "premium",
        name: "VIP",
        inclusions: [
          "Everything in Executive",
          "Bone density scan",
          "Brain MRI",
          "Full cancer screening panel",
          "Cardiologist & internist review",
          "Personalised health plan",
        ],
        priceUsd: 1900,
      },
      {
        tier: "exclusive",
        name: "VIP Premium",
        inclusions: [
          "Everything in VIP",
          "Whole-body MRI",
          "Genetic health risk screening",
          "5-star hotel (2 nights)",
          "Private driver throughout",
          "12-month digital health monitoring",
        ],
        priceUsd: 2700,
      },
    ],
  },

  "bariatric-surgery": {
    metaTitle: "Bariatric Surgery in Turkey — Gastric Sleeve from $3,500",
    metaDescription:
      "Bariatric and weight-loss surgery in Turkey. Gastric sleeve, gastric bypass, and mini-bypass in Istanbul's certified hospitals. Packages from $3,500.",
    intro:
      "Turkey is one of the world's leading destinations for bariatric surgery, with Istanbul hospitals performing thousands of weight-loss procedures each year for international patients. Gastric sleeve (sleeve gastrectomy), gastric bypass, and mini-bypass are offered in JCI-accredited hospitals with full pre-operative evaluation and post-operative dietary support.",
    howPerformed:
      "Bariatric procedures are performed laparoscopically (keyhole surgery) under general anaesthesia. Gastric sleeve surgery removes approximately 75–80% of the stomach to create a sleeve-shaped pouch, reducing capacity and hunger hormones. Gastric bypass reroutes the small intestine for enhanced metabolic effects. Hospital stay is typically 2–3 nights.",
    stayDuration: "7–10 days",
    faqs: [
      {
        q: "What is the difference between gastric sleeve and gastric bypass?",
        a: "Gastric sleeve reduces the stomach size only, limiting food intake and reducing hunger hormones. Gastric bypass both restricts the stomach and bypasses part of the small intestine, delivering stronger weight loss and metabolic improvements — particularly beneficial for type 2 diabetes.",
      },
      {
        q: "How much weight will I lose after bariatric surgery?",
        a: "Most patients lose 60–80% of their excess body weight within 12–18 months of gastric sleeve surgery. Gastric bypass typically produces 70–90% excess weight loss. Long-term success depends on dietary and lifestyle compliance.",
      },
      {
        q: "Who is a candidate for bariatric surgery?",
        a: "General criteria include a BMI of 40 or above, or BMI of 35+ with obesity-related conditions (type 2 diabetes, hypertension, sleep apnoea). Candidates undergo a pre-operative medical evaluation to confirm suitability.",
      },
      {
        q: "What is recovery like after gastric sleeve?",
        a: "Most patients are mobile and eating liquids within 24 hours. Hospital stay is 2–3 nights. A liquid diet is followed for 2–3 weeks, progressing to soft foods and then normal foods over 4–6 weeks.",
      },
      {
        q: "How much does bariatric surgery cost in Turkey vs the UK?",
        a: "Gastric sleeve surgery in the UK costs £8,000–£15,000 privately. In Turkey, MCT packages start from $3,500 (approx. £2,800), including surgery, hospital, hotel, dietary consultation, and transfers.",
      },
    ],
    packages: [
      {
        tier: "hassle-free",
        name: "Hassle-Free",
        inclusions: [
          "Gastric sleeve (laparoscopic)",
          "Pre-op medical evaluation",
          "3-night hospital stay",
          "VIP airport transfer",
          "7-night hotel accommodation",
          "Post-op dietary guide",
        ],
        priceUsd: 3500,
      },
      {
        tier: "gold",
        name: "Gold",
        inclusions: [
          "Sleeve or bypass — your choice",
          "Everything in Hassle-Free",
          "Private hospital room",
          "4-star hotel upgrade",
          "Dietitian consultation (2 sessions)",
          "Dedicated case manager",
        ],
        priceUsd: 4200,
        highlight: true,
      },
      {
        tier: "premium",
        name: "Premium",
        inclusions: [
          "Everything in Gold",
          "Full pre-op lab & cardiac tests",
          "Endocrinologist review",
          "Vitamin & supplement kit (3-month supply)",
          "Post-op lab panel (remote review)",
          "Psychologist pre-op session",
        ],
        priceUsd: 5000,
      },
      {
        tier: "exclusive",
        name: "Exclusive",
        inclusions: [
          "Everything in Premium",
          "5-star hotel (10 nights)",
          "Private driver throughout",
          "Senior bariatric surgeon priority",
          "VIP airport lounge",
          "12-month remote aftercare programme",
        ],
        priceUsd: 6000,
      },
    ],
  },
};
