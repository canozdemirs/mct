"use client";

import { useMemo, useState } from "react";

/**
 * MCT Türkiye'de Tedavi Maliyeti Hesaplama
 * -----------------------------------------
 * Eski WordPress sitesindeki "Treatment Prices" formunun mantığını takip eder:
 * Ülke → Tedavi Kategorisi → Alt Hizmet → Tedavi Süresi (gün, elle girilir) →
 * Kişi Sayısı → Ekstra Hizmetler (Transport / Konaklama / Yeme / Istanbul Turu)
 * → Estimated Cost (kalemler fiyatsız, toplamda € gösterilir)
 *
 * NOT (2026-07-30 güncellemesi): Daha önce tedavi/alt-hizmet ücretinin hiçbir
 * zaman gösterilmeyeceği kararlaştırılmıştı (yetki belgesi / "tedavi planı"
 * riski nedeniyle). Kullanıcı bunu bilerek değiştirdi: artık seçilen alt
 * hizmetin (varsa) referans fiyatı da toplama dahil ediliyor ve hastaya
 * gösteriliyor. Tek tek kalem fiyatları (transport/konaklama/yemek/tur/tedavi)
 * hâlâ ayrı ayrı gösterilmiyor — sadece "Estimated Total Cost" olarak tek
 * rakam halinde. Bu, bilinçli bir geri adım; ileride tekrar sorgulanırsa bu
 * notu ve önceki tartışmayı hatırlat.
 */

const BRAND_BLUE = "#1b5fa8";
const BRAND_TEAL = "#1ab3c8";

// ---- Tedavi kategorileri: eski sitedeki "Service Type Selection" listesiyle birebir ----
// NOT: defaultDays placeholder'dır — gerçek partner hastane sürelerine göre
// güncellenmeli. Tedavi ücreti bilinçli olarak burada YOK — bu araç tedavi
// fiyatı göstermiyor/hesaplamıyor.
type TreatmentCategory = {
  id: string;
  name: string;
  defaultDays: number;
};

const TREATMENT_CATEGORIES: TreatmentCategory[] = [
  { id: "breast-augmentation", name: "Breast Augmentation", defaultDays: 6 },
  { id: "cardiology", name: "Cardiology Surgery", defaultDays: 9 },
  { id: "cardiovascular", name: "Cardiovascular Surgery", defaultDays: 12 },
  { id: "dental", name: "Dental Treatment", defaultDays: 9 },
  { id: "eye-diseases", name: "Eye Diseases Surgery", defaultDays: 4 },
  { id: "gastroenterology", name: "Gastroenterology Surgery", defaultDays: 7 },
  { id: "general-surgery", name: "General Surgery", defaultDays: 7 },
  { id: "gynecomastia", name: "Gynecomastia Surgery", defaultDays: 6 },
  { id: "hair-transplant", name: "Hair Transplant Surgery", defaultDays: 2 },
  { id: "ivf", name: "IVF Treatment", defaultDays: 12 },
  { id: "liposuction", name: "Liposuction Surgery", defaultDays: 4 },
  { id: "medical-checkup", name: "Medical Check Up", defaultDays: 3 },
  { id: "neurochirurgia", name: "Neurochirurgia Surgery", defaultDays: 12 },
  { id: "orthopedics", name: "Orthopedics Surgery", defaultDays: 9 },
  { id: "otolaryngology", name: "Otolaryngology Surgery", defaultDays: 6 },
  { id: "plastic-surgery", name: "Plastic Surgery", defaultDays: 6 },
  { id: "radiation-oncology", name: "Radiation Oncology Surgery", defaultDays: 16 },
  { id: "rhinoplasty", name: "Rhinoplasty Surgery", defaultDays: 6 },
  { id: "transplantation", name: "Transplantation Surgery", defaultDays: 23 },
  { id: "urology", name: "Urology Surgery", defaultDays: 7 },
  { id: "womens-diseases", name: "Women's Diseases Surgery", defaultDays: 7 },
  { id: "other", name: "Other", defaultDays: 7 },
];

// ---- Alt hizmetler (Service Type seçilince açılan ikinci dropdown) ----
// NOT: Bu liste placeholder'dır — gerçek partner hastane hizmet listelerine
// göre güncellenmeli. Kategoriye alt hizmet tanımlanmamışsa dropdown açılmaz.
type SubService = { name: string; price?: number; defaultDays?: number }; // price is added into the visible Estimated Total Cost; defaultDays (if set) overrides the category-level default when this specific service is picked

const SUB_SERVICES: Record<string, SubService[]> = {
  "breast-augmentation": [
    { name: "Silicone Implants (Round)", price: 4424, defaultDays: 6 },
    { name: "Fat Transfer (Fat-to-Breast)", defaultDays: 6 },
    { name: "Breast Lift + Augmentation", price: 5030, defaultDays: 6 },
    { name: "Implant Revision", price: 1830, defaultDays: 6 },
    { name: "Other" },
  ],
  "cardiology": [
    { name: "Angiography", price: 800, defaultDays: 4 },
    { name: "Angioplasty / Stent", price: 4500, defaultDays: 6 },
    { name: "Pacemaker Implantation", price: 6000, defaultDays: 7 },
    { name: "Cardiac Check-up", defaultDays: 3 },
    { name: "Other" },
  ],
  "cardiovascular": [
    { name: "Coronary Bypass (CABG)", price: 12000, defaultDays: 14 },
    { name: "Heart Valve Surgery", price: 14000, defaultDays: 14 },
    { name: "Aortic Surgery", price: 16000, defaultDays: 16 },
    { name: "Other" },
  ],
  "dental": [
    { name: "Tooth Extraction", price: 130, defaultDays: 4 },
    { name: "Dental Filling", price: 100, defaultDays: 4 },
    { name: "Root Canal Treatment", price: 120, defaultDays: 5 },
    { name: "Dental Implant", price: 400, defaultDays: 7 },
    { name: "All-on-4 Dental Implants", price: 1500, defaultDays: 9 },
    { name: "Zirconia Crown", price: 250, defaultDays: 7 },
    { name: "Veneers", price: 250, defaultDays: 7 },
    { name: "Cleaning & Whitening", price: 220, defaultDays: 4 },
    { name: "Full Mouth Restoration", price: 4500, defaultDays: 9 },
    { name: "Other" },
  ],
  "eye-diseases": [
    { name: "ILASIK", price: 1590, defaultDays: 4 },
    { name: "RELEX SMILE", price: 2490, defaultDays: 4 },
    { name: "PRK Wavefront", price: 1590, defaultDays: 4 },
    { name: "Lasek Wavefront", price: 1590, defaultDays: 4 },
    { name: "Cataract Surgery (IOL)", price: 5500, defaultDays: 4 },
    { name: "Strabismus Surgery", price: 3000, defaultDays: 6 },
    { name: "Other" },
  ],
  "gastroenterology": [
    { name: "Endoscopy", price: 400, defaultDays: 3 },
    { name: "Colonoscopy", price: 500, defaultDays: 3 },
    { name: "Bariatric (Weight Loss) Surgery", price: 3200, defaultDays: 9 },
    { name: "Other" },
  ],
  "general-surgery": [
    { name: "Hernia Repair", price: 2200, defaultDays: 6 },
    { name: "Gallbladder Surgery", price: 2500, defaultDays: 6 },
    { name: "Appendectomy", price: 2000, defaultDays: 6 },
    { name: "Other" },
  ],
  "gynecomastia": [
    { name: "Liposuction Technique", price: 2090, defaultDays: 6 },
    { name: "Gland Excision", price: 2090, defaultDays: 6 },
    { name: "Combined (Vaser Liposuction) Technique", price: 2408, defaultDays: 6 },
    { name: "Other" },
  ],
  "hair-transplant": [
    { name: "FUE Sapphire", price: 1400, defaultDays: 2 },
    { name: "FUE Sedation (Pain-Free)", price: 1550, defaultDays: 2 },
    { name: "DHI", price: 1550, defaultDays: 2 },
    { name: "DHI Sedation", price: 1700, defaultDays: 2 },
    { name: "Beard Transplant", price: 1400, defaultDays: 2 },
    { name: "Eyebrow Transplant", price: 1400, defaultDays: 2 },
    { name: "Other" },
  ],
  "ivf": [
    { name: "IVF (Standard)", price: 3000, defaultDays: 14 },
    { name: "ICSI", price: 3300, defaultDays: 14 },
    { name: "Egg Donation", price: 6500, defaultDays: 16 },
    { name: "Embryo Screening (PGT)", price: 4000, defaultDays: 14 },
    { name: "Other" },
  ],
  "liposuction": [
    { name: "Standard Liposuction (1 Area)", price: 1859, defaultDays: 4 },
    { name: "Standard Liposuction (2 Areas)", price: 2051, defaultDays: 4 },
    { name: "Standard Liposuction (3 Areas)", price: 2436, defaultDays: 4 },
    { name: "Laser Liposuction (1 Area)", price: 1985, defaultDays: 4 },
    { name: "Laser Liposuction (2 Areas)", price: 2190, defaultDays: 4 },
    { name: "Laser Liposuction (3 Areas)", price: 2614, defaultDays: 4 },
    { name: "Vaser Liposuction (1 Area)", price: 2175, defaultDays: 4 },
    { name: "Vaser Liposuction (2 Areas)", price: 2337, defaultDays: 4 },
    { name: "Vaser Liposuction (3 Areas)", price: 2761, defaultDays: 4 },
    { name: "Vibrosat Pro Liposuction (1 Area)", price: 2175, defaultDays: 4 },
    { name: "Vibrosat Pro Liposuction (2 Areas)", price: 2336, defaultDays: 4 },
    { name: "Vibrosat Pro Liposuction (3 Areas)", price: 2777, defaultDays: 4 },
    { name: "Other" },
  ],
  "medical-checkup": [
    { name: "Standard Check-up (Men)", price: 695, defaultDays: 3 },
    { name: "Standard Check-up (Women 40+)", price: 695, defaultDays: 3 },
    { name: "Standard Check-up (Women Under 40)", price: 730, defaultDays: 3 },
    { name: "Plus Check-up (Men)", price: 1110, defaultDays: 3 },
    { name: "Plus Check-up (Women)", price: 1110, defaultDays: 3 },
    { name: "VIP Check-up (Men)", price: 2500, defaultDays: 4 },
    { name: "VIP Check-up (Women)", price: 2500, defaultDays: 4 },
    { name: "Pediatric Check-up", price: 510, defaultDays: 3 },
    { name: "Other" },
  ],
  "neurochirurgia": [
    { name: "Brain Tumor Surgery", price: 18000, defaultDays: 16 },
    { name: "Spinal Surgery", price: 8000, defaultDays: 12 },
    { name: "Disc Herniation Surgery", price: 5500, defaultDays: 9 },
    { name: "Other" },
  ],
  "orthopedics": [
    { name: "Knee Replacement", price: 7500, defaultDays: 12 },
    { name: "Hip Replacement", price: 8500, defaultDays: 12 },
    { name: "Sports Injury Surgery", price: 3000, defaultDays: 7 },
    { name: "Other" },
  ],
  "otolaryngology": [
    { name: "Tonsillectomy", price: 1369, defaultDays: 6 },
    { name: "Sinus Surgery (Full FES)", price: 2240, defaultDays: 6 },
    { name: "Ear Surgery (Otoplasty)", price: 1954, defaultDays: 7 },
    { name: "Other" },
  ],
  "plastic-surgery": [
    { name: "Tummy Tuck (Full Abdominoplasty)", price: 3900, defaultDays: 6 },
    { name: "Facelift (Full Face)", price: 5257, defaultDays: 6 },
    { name: "Body Lift (Hip Lift)", price: 3205, defaultDays: 6 },
    { name: "Arm Lift", price: 2632, defaultDays: 6 },
    { name: "Other" },
  ],
  "radiation-oncology": [
    { name: "External Radiotherapy", price: 7000, defaultDays: 16 },
    { name: "Chemotherapy", price: 6000, defaultDays: 16 },
    { name: "Combined Treatment", price: 12000, defaultDays: 23 },
    { name: "Other" },
  ],
  "rhinoplasty": [
    { name: "Primary Rhinoplasty", price: 2443, defaultDays: 6 },
    { name: "Tip Rhinoplasty (Tipplasty)", price: 1470, defaultDays: 6 },
    { name: "Revision Rhinoplasty (Complex)", price: 3261, defaultDays: 6 },
    { name: "Non-Surgical (Filler)", defaultDays: 6 },
    { name: "Ethnic Rhinoplasty", defaultDays: 6 },
    { name: "Other" },
  ],
  "transplantation": [
    { name: "Kidney Transplant", price: 20000, defaultDays: 23 },
    { name: "Liver Transplant", price: 35000, defaultDays: 30 },
    { name: "Bone Marrow Transplant", price: 45000, defaultDays: 32 },
    { name: "Other" },
  ],
  "urology": [
    { name: "Kidney Stone Treatment", price: 2500, defaultDays: 5 },
    { name: "Prostate Surgery", price: 5500, defaultDays: 7 },
    { name: "Urinary Incontinence Surgery", price: 3500, defaultDays: 6 },
    { name: "Other" },
  ],
  "womens-diseases": [
    { name: "Hysterectomy", price: 4500, defaultDays: 9 },
    { name: "Myoma Surgery", price: 3800, defaultDays: 7 },
    { name: "Ovarian Cyst Surgery", price: 3200, defaultDays: 6 },
    { name: "Other" },
  ],
};

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso",
  "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Republic of the)",
  "Congo (Democratic Republic of the)", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece",
  "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
  "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
  "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
  "Tunisia", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Other",
];

// NOT: Fiyat rakamları (transport/konaklama/yemek/İstanbul turu) bilinçli
// olarak bu component içinde artık HESAPLANMIYOR/GÖSTERİLMİYOR — "Estimated
// Cost" bölümü sadece kullanıcının seçimlerinin özeti. Kesin fiyat MCT
// tarafından WhatsApp/danışmanlık sonrası iletiliyor.

// Lojistik masraf fiyatları (€) — sağlık hizmeti DEĞİL, toplamda gösterilmesi
// serbest. NOT: tedavi ücreti hâlâ hiçbir hesaplamaya dahil edilmiyor.
const TRANSPORT_PRICE = { "one-way": 75, "two-way": 150 } as const;
const ACCOMMODATION_PRICE_PER_NIGHT = { "4star": 70, "5star": 100 } as const;
const MEAL_PRICE_PER_DAY = { breakfast: 0, lunch: 10, dinner: 15 } as const;
const ISTANBUL_TOUR_PRICE = 250;

function formatEUR(n: number) {
  return `€${Math.round(n).toLocaleString("en-US")}`;
}

export default function CostCalculator() {
  const [country, setCountry] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const category = TREATMENT_CATEGORIES.find((c) => c.id === categoryId);
  const subServiceOptions = categoryId ? SUB_SERVICES[categoryId] : undefined;

  const [subService, setSubService] = useState("");

  const [days, setDays] = useState(0);
  const [travellers, setTravellers] = useState(1);

  const [transportOption, setTransportOption] = useState<"none" | "one-way" | "two-way">("none");
  const [accommodationTier, setAccommodationTier] = useState<"none" | "4star" | "5star">("none");
  const [meals, setMeals] = useState({ breakfast: false, lunch: false, dinner: false });
  const [istanbulTour, setIstanbulTour] = useState(false);

  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState<"whatsapp" | "email">("whatsapp");
  const [contactValue, setContactValue] = useState("");

  function handleCategoryChange(id: string) {
    const next = TREATMENT_CATEGORIES.find((c) => c.id === id)!;
    setCategoryId(id);
    setDays(next.defaultDays); // kullanıcı isterse elle değiştirebilir
    setSubService(""); // kategori değişince alt hizmet seçimi sıfırlanır
  }

  function handleSubServiceChange(selectedName: string) {
    setSubService(selectedName);
    const picked = subServiceOptions?.find((s) => s.name === selectedName);
    if (picked?.defaultDays) {
      setDays(picked.defaultDays); // spesifik hizmetin gerçek süresi varsa, kategori varsayılanının üzerine yazar
    }
  }

  // Sadece TOPLAM için — tek tek kalem fiyatları gösterilmiyor, tedavi ücreti dahil değil.
  const totalCost = useMemo(() => {
    const safeDays = Math.max(days, 0);
    const safeTravellers = Math.max(travellers, 1);

    const transport = transportOption === "none" ? 0 : TRANSPORT_PRICE[transportOption];

    // İki kişi aynı odada (double oda) kalabiliyor — kişi başı değil, oda başına ücretlendiriyoruz.
    const rooms = Math.ceil(safeTravellers / 2);
    const accommodation =
      accommodationTier === "none"
        ? 0
        : ACCOMMODATION_PRICE_PER_NIGHT[accommodationTier] * safeDays * rooms;

    const mealPerDay =
      (meals.breakfast ? MEAL_PRICE_PER_DAY.breakfast : 0) +
      (meals.lunch ? MEAL_PRICE_PER_DAY.lunch : 0) +
      (meals.dinner ? MEAL_PRICE_PER_DAY.dinner : 0);
    const food = mealPerDay * safeDays * safeTravellers;

    const tour = istanbulTour ? ISTANBUL_TOUR_PRICE : 0;

    const selectedSubService = subServiceOptions?.find((s) => s.name === subService);
    const treatmentPrice = selectedSubService?.price || 0;

    return transport + accommodation + food + tour + treatmentPrice;
  }, [days, travellers, transportOption, accommodationTier, meals, istanbulTour, subServiceOptions, subService]);

  function summaryText() {
    const transportLabel =
      transportOption === "none" ? "None" : transportOption === "one-way" ? "One Way" : "Two Way";
    const accommodationLabel =
      accommodationTier === "none" ? "None" : accommodationTier === "4star" ? "4 Star Hotel" : "5 Star Hotel";
    const foodLabel =
      [meals.breakfast && "Breakfast", meals.lunch && "Lunch", meals.dinner && "Dinner"]
        .filter(Boolean)
        .join(", ") || "None";

    const selectedSubService = subServiceOptions?.find((s) => s.name === subService);
    const subServiceSuffix = selectedSubService
      ? ` — ${selectedSubService.name}${selectedSubService.price ? ` (ref. price: ${formatEUR(selectedSubService.price)})` : ""}`
      : "";

    return (
      `Hello, I'm ${name || "(name)"} from ${country || "(country not selected)"}.\n\n` +
      `Treatment: ${category?.name || "(not selected)"}${subServiceSuffix}\n` +
      `Duration: ${days} day${days === 1 ? "" : "s"}\n` +
      `Travellers: ${travellers}\n` +
      `Transport: ${transportLabel}\n` +
      `Accommodation: ${accommodationLabel}\n` +
      `Food: ${foodLabel}\n` +
      `Istanbul Tour: ${istanbulTour ? "Added" : "Not added"}\n` +
      `Estimated Total Cost seen: ${formatEUR(totalCost)}\n\n` +
      `I'd like a personalized quote.`
    );
  }

  function whatsappHref() {
    const msg = `${summaryText()}\n\nMy WhatsApp/phone: ${contactValue}`;
    return `https://wa.me/908508888911?text=${encodeURIComponent(msg)}`;
  }

  function mailtoHref() {
    const subject = `Personalized Quote Request — ${category?.name || "Treatment"}`;
    const body = `${summaryText()}\n\nMy email: ${contactValue}`;
    return `mailto:hello@medicalcenterturkey.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 space-y-5 bg-white">
        {/* Country */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: BRAND_BLUE }}>
            Select Your Country
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2"
            style={{ ["--tw-ring-color" as any]: BRAND_BLUE }}
          >
            <option value="" disabled hidden>Which country's passport do you hold?</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Service type */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: BRAND_BLUE }}>
            Service Type Selection
          </label>
          <select
            value={categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2"
            style={{ ["--tw-ring-color" as any]: BRAND_BLUE }}
          >
            <option value="" disabled hidden>Which treatment would you like an approximate price for?</option>
            {TREATMENT_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Sub-service — only shown once a category with defined sub-services is selected */}
        {subServiceOptions && (
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: BRAND_BLUE }}>
              Which specific service?
            </label>
            <select
              value={subService}
              onChange={(e) => handleSubServiceChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as any]: BRAND_BLUE }}
            >
              <option value="" disabled hidden>Select a specific service</option>
              {subServiceOptions.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
        )}

        {/* Duration + travellers — drag-to-right sliders */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label className="text-sm font-medium" style={{ color: BRAND_BLUE }}>Duration of Treatment</label>
              <span className="text-sm font-semibold" style={{ color: BRAND_BLUE }}>
                {days} day{days === 1 ? "" : "s"}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: BRAND_BLUE }}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0</span>
              <span>30</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label className="text-sm font-medium" style={{ color: BRAND_BLUE }}>Number of Travellers</label>
              <span className="text-sm font-semibold" style={{ color: BRAND_BLUE }}>
                {travellers}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={travellers}
              onChange={(e) => setTravellers(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: BRAND_BLUE }}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        </div>

        {/* Transport */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: BRAND_BLUE }}>Transport</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "none" as const, label: "None" },
              { id: "one-way" as const, label: "One Way" },
              { id: "two-way" as const, label: "Two Way" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTransportOption(opt.id)}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                  transportOption === opt.id
                    ? "text-white border-transparent"
                    : "text-slate-500 border-slate-300 hover:border-slate-400"
                }`}
                style={transportOption === opt.id ? { background: BRAND_TEAL } : undefined}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accommodation */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: BRAND_BLUE }}>Accommodation</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "none" as const, label: "None" },
              { id: "4star" as const, label: "4 Star Hotel" },
              { id: "5star" as const, label: "5 Star Hotel" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAccommodationTier(opt.id)}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                  accommodationTier === opt.id
                    ? "text-white border-transparent"
                    : "text-slate-500 border-slate-300 hover:border-slate-400"
                }`}
                style={accommodationTier === opt.id ? { background: BRAND_TEAL } : undefined}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Food */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: BRAND_BLUE }}>Food</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "breakfast" as const, label: "Breakfast" },
              { id: "lunch" as const, label: "Lunch" },
              { id: "dinner" as const, label: "Dinner" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setMeals((m) => ({ ...m, [opt.id]: !m[opt.id] }))}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                  meals[opt.id]
                    ? "text-white border-transparent"
                    : "text-slate-500 border-slate-300 hover:border-slate-400"
                }`}
                style={meals[opt.id] ? { background: BRAND_TEAL } : undefined}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Istanbul Tour */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: BRAND_BLUE }}>Istanbul Tour</label>
          <button
            type="button"
            onClick={() => setIstanbulTour((v) => !v)}
            className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
              istanbulTour
                ? "text-white border-transparent"
                : "text-slate-500 border-slate-300 hover:border-slate-400"
            }`}
            style={istanbulTour ? { background: BRAND_TEAL } : undefined}
          >
            {istanbulTour ? "Added" : "Add Istanbul Tour"}
          </button>
        </div>

        {/* Estimated Cost — sadece toplam, kalem listesi yok */}
        <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
          <h4 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: BRAND_BLUE }}>
            Estimated Treatment Journey Cost
          </h4>
          <div className="flex justify-between items-center">
            <span className="font-semibold" style={{ color: BRAND_BLUE }}>Estimated Total Cost</span>
            <span className="text-lg font-bold" style={{ color: BRAND_BLUE }}>
              {formatEUR(totalCost)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Prices shown are for informational purposes only and are not final — they may vary
            from person to person. Please contact us for an exact quote.
          </p>
        </div>

        {/* Lead capture — terms, then contact details with a channel choice */}
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-700 mb-3">
            Like our price? Leave your details below and we'll contact you.
          </p>

          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              I agree to Medical Center Turkey's Terms and Conditions, I have read the Privacy
              Policy and I agree that my given details including health data may be processed
              by Medical Center Turkey for the purpose of obtaining quotes.
            </span>
          </label>

          {agreed && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: BRAND_BLUE }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as any]: BRAND_BLUE }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: BRAND_BLUE }}>
                  How should we contact you?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "whatsapp" as const, label: "WhatsApp" },
                    { id: "email" as const, label: "Email" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => { setContactMethod(opt.id); setContactValue(""); }}
                      className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                        contactMethod === opt.id
                          ? "text-white border-transparent"
                          : "text-slate-500 border-slate-300 hover:border-slate-400"
                      }`}
                      style={contactMethod === opt.id ? { background: BRAND_TEAL } : undefined}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: BRAND_BLUE }}>
                  {contactMethod === "whatsapp" ? "Your WhatsApp / Phone Number" : "Your Email Address"}
                </label>
                <input
                  type={contactMethod === "whatsapp" ? "tel" : "email"}
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder={contactMethod === "whatsapp" ? "+44 7XXX XXXXXX" : "you@example.com"}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as any]: BRAND_BLUE }}
                />
              </div>

              <a
                href={name && contactValue ? (contactMethod === "whatsapp" ? whatsappHref() : mailtoHref()) : undefined}
                target={contactMethod === "whatsapp" ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-disabled={!(name && contactValue)}
                onClick={(e) => { if (!(name && contactValue)) e.preventDefault(); }}
                className={`inline-flex w-full justify-center rounded-lg py-2.5 text-white font-medium ${
                  name && contactValue ? "" : "opacity-50 cursor-not-allowed"
                }`}
                style={{ background: BRAND_TEAL }}
              >
                {contactMethod === "whatsapp" ? "Send via WhatsApp" : "Send via Email"}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
