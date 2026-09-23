const lightClass =
  "w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-teal focus:bg-white transition-all";

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

// Shared phone field for every lead form — plain <input type="tel">, but
// centralized so the placeholder/behavior only ever needs updating once.
// Country selection pre-fills the dial code via useCountryDialCode; this
// component just renders the field.
export function PhoneInput({
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
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder="+44 7XXX XXXXXX"
        style={darkStyle}
      />
    );
  }

  return (
    <input
      type="tel"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder="+44 7XXX XXXXXX"
      className={lightClass}
    />
  );
}
