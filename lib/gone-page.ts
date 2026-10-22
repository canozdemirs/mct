// Search Console follow-up (2026-10-22): the branded HTTP 410 response
// body, replacing the old plain-text "Gone" response. Built as a static
// HTML string (not a React page) because middleware can't invoke Next's
// React render tree, and because a page.tsx has no App Router convention
// for returning a 410 status (notFound()/redirect() cover 404/307-308
// only) -- proxy.ts returns this directly as the NextResponse body, which
// keeps the actual HTTP status code at 410.
//
// Mirrors the real site chrome (components/marketing/nav.tsx and
// footer.tsx) closely enough to not feel like a dead end -- same logo,
// brand colors, and WhatsApp number -- but hand-written and static:
// the real Nav/Footer are client components with a consultation-modal
// hook that has nothing to attach to here, so "Get Quote" is a plain
// link to /#consultation (the homepage's own consultation section)
// instead of opening that modal. Font is a system stack rather than the
// site's self-hosted Geist font -- not worth pulling in a font pipeline
// for a single static error page.
const BRAND = "#1b5fa8";
const TEAL = "#1ab3c8";
const BRAND_DARK = "#0d2d52";
const WHATSAPP_GREEN = "#25D366";
const WHATSAPP_URL = "https://wa.me/908508888911";

export const GONE_PAGE_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Page No Longer Available – Medical Center Turkey</title>
<style>
  :root { --brand: ${BRAND}; --teal: ${TEAL}; --brand-dark: ${BRAND_DARK}; --whatsapp: ${WHATSAPP_GREEN}; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1f2937;
    background: #ffffff;
  }
  a { text-decoration: none; }
  header {
    border-bottom: 1px solid #f3f4f6;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }
  .header-inner {
    max-width: 80rem;
    margin: 0 auto;
    padding: 0 1rem;
    height: 4.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .logo img { height: 36px; width: auto; display: block; }
  nav.main-nav { display: none; align-items: center; gap: 2rem; }
  nav.main-nav a { font-size: 0.875rem; font-weight: 600; color: var(--brand); }
  nav.main-nav a:hover { color: var(--teal); }
  @media (min-width: 1024px) {
    nav.main-nav { display: flex; }
  }
  main {
    max-width: 42rem;
    margin: 0 auto;
    padding: 5rem 1.5rem 4rem;
    text-align: center;
  }
  .code-badge {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--brand);
    background: #eef4fb;
    border-radius: 999px;
    padding: 0.35rem 0.9rem;
    margin-bottom: 1.5rem;
  }
  h1 {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--brand-dark);
    margin: 0 0 0.75rem;
  }
  main p.sub {
    font-size: 1rem;
    color: #4b5563;
    line-height: 1.6;
    margin: 0 0 2.25rem;
  }
  .links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.7rem 1.4rem;
    border-radius: 999px;
    font-size: 0.9rem;
    font-weight: 700;
  }
  .btn-primary { background: var(--brand); color: #fff; }
  .btn-outline { background: #fff; color: var(--brand); border: 1px solid var(--brand); }
  .btn-whatsapp { background: var(--whatsapp); color: #fff; }
  footer {
    background: var(--brand-dark);
    color: rgba(255,255,255,0.7);
    padding: 2.5rem 1.5rem;
    text-align: center;
  }
  footer .footer-brand { color: #fff; font-weight: 700; margin-bottom: 0.4rem; }
  footer .footer-links {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1.25rem;
    margin: 1rem 0;
    font-size: 0.85rem;
  }
  footer .footer-links a { color: rgba(255,255,255,0.75); }
  footer .footer-links a:hover { color: #fff; }
  footer .copyright { font-size: 0.75rem; color: rgba(255,255,255,0.45); margin-top: 0.75rem; }
</style>
</head>
<body>
  <header>
    <div class="header-inner">
      <a class="logo" href="/"><img src="/mct_logo.png" alt="Medical Center Turkey" width="160" height="44" /></a>
      <nav class="main-nav">
        <a href="/">Home</a>
        <a href="/hospitals-in-turkey">Hospitals</a>
        <a href="/treatment-prices-in-turkey">Cost Calculator</a>
        <a href="/blog">Blog</a>
        <a href="/#consultation">Get Quote</a>
      </nav>
    </div>
  </header>

  <main>
    <span class="code-badge">410 · PAGE REMOVED</span>
    <h1>This page is no longer available</h1>
    <p class="sub">
      The page you're looking for has been removed or replaced. It isn't
      coming back at this address, but our team and the rest of the site
      are still here to help with your treatment journey.
    </p>
    <div class="links">
      <a class="btn btn-primary" href="/">Go to Homepage</a>
      <a class="btn btn-outline" href="/hospitals-in-turkey">Hospitals in Turkey</a>
      <a class="btn btn-outline" href="/treatment-prices-in-turkey">Treatment Prices</a>
    </div>
    <div class="links">
      <a class="btn btn-whatsapp" href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer">Chat with us on WhatsApp</a>
    </div>
  </main>

  <footer>
    <div class="footer-brand">Medical Center Turkey</div>
    <div class="footer-links">
      <a href="/">Home</a>
      <a href="/hospitals-in-turkey">Hospitals</a>
      <a href="/treatment-prices-in-turkey">Cost Calculator</a>
      <a href="/blog">Blog</a>
    </div>
    <div class="copyright">© Medical Center Turkey. Your International Patient Center.</div>
  </footer>
</body>
</html>
`;
