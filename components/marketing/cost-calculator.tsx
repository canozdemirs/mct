"use client";

import { useMemo, useState } from "react";

const BRAND_BLUE = "#1b5fa8";
const BRAND_TEAL = "#1ab3c8";

type TreatmentCategory = {
  id: string;
  name: string;
  defaultDays: number;
};

const TREATMENT_CATEGORIES: TreatmentCategory[] = [
  { id: "breast-augmentation", name: "Breast Augmentation", defaultDays: 5 },
  { id: "cardiology", name: "Cardiology Surgery", defaultDays: 7 },
  { id: "cardiovascular", name: "Cardiovascular Surgery", defaultDays: 10 },
  { id: "dental", name: "Dental Treatment", defaultDays: 7 },
  { id: "eye-diseases", name: "Eye Diseases Surgery", defaultDays: 3 },
  { id: "gastroenterology", name: "Gastroenterology Surgery", defaultDays: 5 },
  { id: "general-surgery", name: "General Surgery", defaultDays: 5 },
  { id: "gynecomastia", name: "Gynecomastia Surgery", defaultDays: 4 },
  { id: "hair-transplant", name: "Hair Transplant Surgery", defaultDays: 3 },
  { id: "ivf", name: "IVF Treatment", defaultDays: 10 },
  { id: "liposuction", name: "Liposuction Surgery", defaultDays: 5 },
  { id: "medical-checkup", name: "Medical Check Up", defaultDays: 1 },
  { id: "neurochirurgia", name: "Neurochirurgia Surgery", defaultDays: 10 },
  { id: "orthopedics", name: "Orthopedics Surgery", defaultDays: 7 },
  { id: "otolaryngology", name: "Otolaryngology Surgery", defaultDays: 4 },
  { id: "plastic-surgery", name: "Plastic Surgery", defaultDays: 7 },
  { id: "radiation-oncology", name: "Radiation Oncology Surgery", defaultDays: 14 },
  { id: "rhinoplasty", name: "Rhinoplasty Surgery", defaultDays: 7 },
  { id: "transplantation", name: "Transplantation Surgery", defaultDays: 21 },
  { id: "urology", name: "Urology Surgery", defaultDays: 5 },
  { id: "womens-diseases", name: "Women's Diseases Surgery", defaultDays: 5 },
  { id: "other", name: "Other", defaultDays: 5 },
];

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

// Lojistik masraf fiyatları (€) — tedavi ücreti dahil değil, toplamda gösterilir.
const TRANSPORT_PRICE = { "one-way": 75, "two-way": 150 } as const;
const ACCOMMODATION_PRICE_PER_NIGHT = { "4star": 70, "5star": 100 } as const;
const MEAL_PRICE_PER_DAY = { breakfast: 0, lunch: 10, dinner: 15 } as const;
const ISTANBUL_TOUR_PRICE = 250;

function formatEUR(n: number) {
  return `€${Math.round(n).toLocaleString("en-US")}`;
}

export function CostCalculator() {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [categoryId, setCategoryId] = useState(TREATMENT_CATEGORIES[0].id);
  const category = TREATMENT_CATEGORIES.find((c) => c.id === categoryId)!;

  const [days, setDays] = useState(category.defaultDays);
  const [travellers, setTravellers] = useState(1);

  const [transportOption, setTransportOption] = useState<"none" | "one-way" | "two-way">("two-way");
  const [accommodationTier, setAccommodationTier] = useState<"none" | "4star" | "5star">("4star");
  const [meals, setMeals] = useState({ breakfast: true, lunch: false, dinner: false });
  const [istanbulTour, setIstanbulTour] = useState(false);

  const [agreed, setAgreed] = useState(false);

  function handleCategoryChange(id: string) {
    const next = TREATMENT_CATEGORIES.find((c) => c.id === id)!;
    setCategoryId(id);
    setDays(next.defaultDays);
  }

  const totalCost = useMemo(() => {
    const safeDays = Math.max(days, 0);
    const safeTravellers = Math.max(travellers, 1);

    const transport = transportOption === "none" ? 0 : TRANSPORT_PRICE[transportOption];

    const accommodation =
      accommodationTier === "none"
        ? 0
        : ACCOMMODATION_PRICE_PER_NIGHT[accommodationTier] * safeDays * safeTravellers;

    const mealPerDay =
      (meals.breakfast ? MEAL_PRICE_PER_DAY.breakfast : 0) +
      (meals.lunch ? MEAL_PRICE_PER_DAY.lunch : 0) +
      (meals.dinner ? MEAL_PRICE_PER_DAY.dinner : 0);
    const food = mealPerDay * safeDays * safeTravellers;

    const tour = istanbulTour ? ISTANBUL_TOUR_PRICE : 0;

    return transport + accommodation + food + tour;
  }, [days, travellers, transportOption, accommodationTier, meals, istanbulTour]);

  function whatsappHref() {
    const msg =
      `Hello, I'm from ${country}. For ${category.name} (${days} days, ${travellers} traveller(s)), ` +
      `I saw a total estimated cost of ${formatEUR(totalCost)}, I'd like a personalized quote.`;
    return `https://wa.me/908508888911?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div
        className="px-6 py-5"
        style={{ background: `linear-gradient(135deg, ${BRAND_BLUE}, ${BRAND_TEAL})` }}
      >
        <h3 className="text-white text-xl font-semibold">Calculate Your Treatment Cost in Turkey</h3>
        <p className="text-white/80 text-sm mt-1">
          Get an estimate of your travel and accommodation costs for your treatment journey.
        </p>
      </div>

      <div className="p-6 space-y-5 bg-white">
        {/* Country */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: BRAND_BLUE }}>
            Select Your Country
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1b5fa8]"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
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
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1b5fa8]"
          >
            {TREATMENT_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Duration + travellers */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label className="text-sm font-medium" style={{ color: BRAND_BLUE }}>
                Duration of Treatment
              </label>
              <span className="text-sm font-semibold" style={{ color: BRAND_BLUE }}>
                {days} day{days === 1 ? "" : "s"}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full accent-[#1b5fa8]"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1</span><span>30</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label className="text-sm font-medium" style={{ color: BRAND_BLUE }}>
                Number of Travellers
              </label>
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
              className="w-full accent-[#1b5fa8]"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1</span><span>10</span>
            </div>
          </div>
        </div>

        {/* Transport */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: BRAND_BLUE }}>Transport</label>
          <div className="grid grid-cols-3 gap-2">
            {(["none", "one-way", "two-way"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setTransportOption(opt)}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                  transportOption === opt
                    ? "text-white border-transparent"
                    : "text-slate-500 border-slate-300 hover:border-slate-400"
                }`}
                style={transportOption === opt ? { background: BRAND_TEAL } : undefined}
              >
                {opt === "none" ? "None" : opt === "one-way" ? "One Way" : "Two Way"}
              </button>
            ))}
          </div>
        </div>

        {/* Accommodation */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: BRAND_BLUE }}>Accommodation</label>
          <div className="grid grid-cols-3 gap-2">
            {(["none", "4star", "5star"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAccommodationTier(opt)}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                  accommodationTier === opt
                    ? "text-white border-transparent"
                    : "text-slate-500 border-slate-300 hover:border-slate-400"
                }`}
                style={accommodationTier === opt ? { background: BRAND_TEAL } : undefined}
              >
                {opt === "none" ? "None" : opt === "4star" ? "4 Star Hotel" : "5 Star Hotel"}
              </button>
            ))}
          </div>
        </div>

        {/* Food */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: BRAND_BLUE }}>Food</label>
          <div className="grid grid-cols-3 gap-2">
            {(["breakfast", "lunch", "dinner"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setMeals((m) => ({ ...m, [opt]: !m[opt] }))}
                className={`rounded-lg border px-3 py-2 text-sm capitalize transition-colors ${
                  meals[opt]
                    ? "text-white border-transparent"
                    : "text-slate-500 border-slate-300 hover:border-slate-400"
                }`}
                style={meals[opt] ? { background: BRAND_TEAL } : undefined}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
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

        {/* Estimated Cost */}
        <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
          <h4 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: BRAND_BLUE }}>
            Estimated Treatment Journey Cost
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-slate-600">Treatment</span>
              <span className="font-medium text-slate-800">{category.name}</span>
            </li>
            {transportOption !== "none" && (
              <li className="flex justify-between">
                <span className="text-slate-600">Transport</span>
                <span className="font-medium text-slate-800">
                  {transportOption === "one-way" ? "One Way" : "Two Way"}
                </span>
              </li>
            )}
            {accommodationTier !== "none" && (
              <li className="flex justify-between">
                <span className="text-slate-600">Accommodation</span>
                <span className="font-medium text-slate-800">
                  {accommodationTier === "4star" ? "4 Star Hotel" : "5 Star Hotel"}
                </span>
              </li>
            )}
            {(meals.breakfast || meals.lunch || meals.dinner) && (
              <li className="flex justify-between">
                <span className="text-slate-600">Food</span>
                <span className="font-medium text-slate-800">
                  {(["breakfast", "lunch", "dinner"] as const)
                    .filter((k) => meals[k])
                    .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
                    .join(", ")}
                </span>
              </li>
            )}
            {istanbulTour && (
              <li className="flex justify-between">
                <span className="text-slate-600">Istanbul Tour</span>
                <span className="font-medium text-slate-800">Added</span>
              </li>
            )}
          </ul>
          <div className="mt-3 pt-3 border-t border-slate-300 flex justify-between items-center">
            <span className="font-semibold" style={{ color: BRAND_BLUE }}>Total Cost</span>
            <span className="text-lg font-bold" style={{ color: BRAND_BLUE }}>{formatEUR(totalCost)}</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Prices shown are for informational purposes only and are not final — they may vary
            from person to person. Please contact us for an exact quote.
          </p>
        </div>

        {/* Lead capture */}
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-700 mb-3">
            Like our price? Leave your details below and we&apos;ll contact you.
          </p>
          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              I agree to Medical Center Turkey&apos;s Terms and Conditions, I have read the Privacy
              Policy and I agree that my given details including health data may be processed
              by Medical Center Turkey for the purpose of obtaining quotes.
            </span>
          </label>
          <a
            href={agreed ? whatsappHref() : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!agreed}
            onClick={(e) => { if (!agreed) e.preventDefault(); }}
            className={`mt-3 flex w-full justify-center items-center rounded-lg py-2.5 text-white font-medium text-sm transition-opacity ${
              agreed ? "opacity-100" : "opacity-50 cursor-not-allowed"
            }`}
            style={{ background: BRAND_TEAL }}
          >
            Leave Your Details — We&apos;ll Contact You
          </a>
        </div>
      </div>
    </div>
  );
}
