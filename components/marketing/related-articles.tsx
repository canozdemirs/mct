import Link from "next/link";
import { getRelatedArticles } from "@/lib/related-articles";

// 2026-10-23 internal-link project, item 3. Renders nothing if the landing
// page has no matching posts (keeps this safe to add to every landing
// page uniformly, even one with zero matches today).
export function RelatedArticles({ landingSlug }: { landingSlug: string }) {
  const articles = getRelatedArticles(landingSlug);
  if (articles.length === 0) return null;

  return (
    <section className="bg-slate-50 border-t border-slate-100 py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-teal">Related Articles</span>
          <h2 className="text-2xl font-bold text-brand mt-2">Learn More</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/${a.slug}`}
              className="block rounded-xl border border-white bg-white p-5 hover:border-teal hover:shadow-md transition-all"
            >
              <h3 className="text-sm font-bold text-brand">{a.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
