import { MessageCircle, Calculator } from "lucide-react";

const items = [
  {
    id: "whatsapp",
    href: "https://wa.me/908508888911",
    label: "Whatsapp – PBX Number",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.18 1.6 6L0 24l6.18-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.22-3.48-8.52z" fill="#1b5fa8" />
        <path d="M17.47 14.38c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.63.14-.19.28-.72.91-.88 1.1-.16.19-.33.21-.6.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.38-1.64-1.54-1.91-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.47.14-.16.19-.28.28-.47.1-.19.05-.35-.02-.49-.07-.14-.63-1.52-.87-2.08-.23-.55-.46-.47-.63-.48h-.54c-.19 0-.49.07-.75.35-.26.28-1 1-.97 2.43.03 1.43 1.04 2.81 1.18 3 .14.19 2.04 3.11 4.94 4.36.69.3 1.23.47 1.65.6.69.22 1.32.19 1.82.12.55-.08 1.7-.7 1.94-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.54-.33z" fill="white" />
      </svg>
    ),
    iconBg: "bg-blue-50",
    content: (
      <p className="text-sm sm:text-base font-semibold text-[#1b5fa8] leading-tight">
        +90 850 8888{" "}
        <span className="font-bold">911</span>
      </p>
    ),
  },
  {
    id: "trustpilot",
    href: "https://www.trustpilot.com/review/medicalcenterturkey.com",
    label: "Real Patient Experiences",
    icon: <MessageCircle size={22} className="text-[#1b5fa8]" />,
    iconBg: "bg-blue-50",
    content: (
      <p className="text-sm sm:text-base font-semibold text-[#1b5fa8] leading-tight">
        See reviews
      </p>
    ),
  },
  {
    id: "quote",
    href: "#consultation",
    label: "Get Your Personalized Quote",
    icon: <Calculator size={22} className="text-[#1b5fa8]" />,
    iconBg: "bg-blue-50",
    content: (
      <p className="text-sm sm:text-base font-semibold text-[#1b5fa8] leading-tight">
        in 2 minutes
      </p>
    ),
  },
];

export function ContactBar() {
  return (
    <div className="w-full bg-gray-50 border-y border-gray-200">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4">

        {/* First 3 items */}
        {items.map((item, i) => {
          const Wrapper = item.href.startsWith("#") ? "a" : "a";
          return (
            <a
              key={item.id}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`flex items-center gap-3 px-4 py-4 sm:px-6 sm:py-5 hover:bg-gray-100 transition-colors
                ${i === 0 ? "border-b sm:border-b-0 border-r border-gray-200" : ""}
                ${i === 1 ? "border-b sm:border-b-0 sm:border-r border-gray-200" : ""}
                ${i === 2 ? "border-r border-gray-200" : ""}
              `}
            >
              <div className={`shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full ${item.iconBg} flex items-center justify-center`}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5 truncate">
                  {item.label}
                </p>
                {item.content}
              </div>
            </a>
          );
        })}

        {/* Social Media */}
        <div className="flex items-center gap-3 px-4 py-4 sm:px-6 sm:py-5">
          <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b5fa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Follow Us</p>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/medicalcenterturkey/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#1b5fa8] hover:opacity-60 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/medicalcenterturkeycom" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#1b5fa8] hover:opacity-60 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://tr.linkedin.com/company/medical-center-turkey" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#1b5fa8] hover:opacity-60 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
