import { COUNTRIES } from "@/lib/constants";

const lightClass =
  "w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal focus:bg-white transition-all";

const darkStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 8,
  padding: "12px 16px",
  fontSize: 14,
  color: "#fff",
  outline: "none",
};

export function CountrySelect({
  value,
  onChange,
  onBlur,
  variant = "light",
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  variant?: "light" | "dark";
}) {
  if (variant === "dark") {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        style={darkStyle}
      >
        <option value="" style={{ color: "#000" }}>
          Select your country...
        </option>
        {COUNTRIES.map((c) => (
          <option key={c} value={c} style={{ color: "#000" }}>
            {c}
          </option>
        ))}
      </select>
    );
  }

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} className={lightClass}>
      <option value="">Select your country...</option>
      {COUNTRIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
