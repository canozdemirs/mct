import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/908508888911"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3.5 rounded-full shadow-xl hover:bg-[#1fb55a] transition-all hover:scale-105 font-semibold text-sm"
    >
      <MessageCircle size={22} />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
