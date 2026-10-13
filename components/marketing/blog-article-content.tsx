"use client";

import { useConsultationModal } from "./consultation-modal";

// Blog article bodies are static, pre-sanitized HTML strings (produced by
// scripts/import-blog-posts.mjs), rendered via dangerouslySetInnerHTML — so
// none of the anchors inside them are real React elements and none can call
// useConsultationModal() directly. Any CTA that was rewritten to open the
// Get Quote modal (see convertConsultationLinks() in the import script) is
// marked with `data-cta="consultation"` and a safe `href="#"` fallback.
// This wrapper uses event delegation to catch clicks/keyboard-Enter on those
// specific anchors (a native <a> is already keyboard-focusable and fires
// `click` on Enter, so no extra key handling is needed) and opens the same
// modal every other "Get Quote" button on the site uses, without altering
// any visible link text.
export function BlogArticleContent({ html, className }: { html: string; className?: string }) {
  const { openConsultation } = useConsultationModal();

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = (e.target as HTMLElement).closest('[data-cta="consultation"]');
    if (target) {
      e.preventDefault();
      openConsultation();
    }
  }

  return <div className={className} onClick={handleClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
