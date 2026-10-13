"use client";

import { CheckCircle, MessageCircle } from "lucide-react";
import { openWhatsAppTransition, WHATSAPP_GENERIC_MESSAGE } from "@/lib/attribution";

const WHATSAPP_LINK = "https://wa.me/908508888911";

function handleWhatsAppClick(e: React.MouseEvent) {
  e.preventDefault();
  openWhatsAppTransition(WHATSAPP_GENERIC_MESSAGE);
}

export function FormSuccessMessage({
  name,
  email,
  onClose,
  variant = "light",
  locale = "en",
}: {
  name: string;
  email: string;
  onClose?: () => void;
  variant?: "light" | "dark";
  locale?: "en" | "tr";
}) {
  const t = locale === "tr"
    ? {
        thanks: `Teşekkürler, ${name}!`,
        body: "Talebinizi aldık. Hasta koordinatörlerimizden biri 48 saat içinde sizinle iletişime geçecek.",
        confirmation: (e: string) => `Onay e-postası ${e} adresine gönderildi.`,
        whatsapp: "WhatsApp'tan yazın",
        close: "Kapat",
      }
    : {
        thanks: `Thank you, ${name}!`,
        body: "We've received your request. One of our patient coordinators will get back to you within 48 hours.",
        confirmation: (e: string) => `A confirmation has been sent to ${e}.`,
        whatsapp: "Message us on WhatsApp",
        close: "Close",
      };

  if (variant === "dark") {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <CheckCircle size={48} style={{ color: "#A3C6CF", margin: "0 auto 16px" }} />
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{t.thanks}</div>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
          {t.body}
        </p>
        {email && (
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>
            {t.confirmation(email)}
          </p>
        )}
        <a
          href={WHATSAPP_LINK}
          onClick={handleWhatsAppClick}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#25D366", fontSize: 13, fontWeight: 700, textDecoration: "none" }}
        >
          <MessageCircle size={14} /> {t.whatsapp}
        </a>
        {onClose && (
          <div style={{ marginTop: 24 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", borderRadius: 999, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              {t.close}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
      <CheckCircle size={48} className="text-teal" />
      <h3 className="text-lg font-bold text-brand">{t.thanks}</h3>
      <p className="text-sm text-gray-500 max-w-xs">
        {t.body}
      </p>
      {email && (
        <p className="text-xs text-gray-400 max-w-xs">{t.confirmation(email)}</p>
      )}
      <a
        href={WHATSAPP_LINK}
        onClick={handleWhatsAppClick}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[#1ebe5a] text-sm font-semibold hover:underline"
      >
        <MessageCircle size={15} /> {t.whatsapp}
      </a>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="mt-3 px-5 py-2 rounded-full border border-gray-200 text-gray-500 text-sm font-semibold hover:border-gray-300 transition-colors"
        >
          {t.close}
        </button>
      )}
    </div>
  );
}
