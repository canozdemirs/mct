export function FieldError({ message, variant = "light" }: { message?: string; variant?: "light" | "dark" }) {
  if (!message) return null;

  if (variant === "dark") {
    return <p style={{ fontSize: 12, color: "#fca5a5", marginTop: 4 }}>{message}</p>;
  }

  return <p className="text-xs text-red-600 mt-1">{message}</p>;
}
