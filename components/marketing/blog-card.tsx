import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";

export interface BlogCardData {
  slug: string;
  title: string;
  date: string;
  seoDescription: string;
  // Card-only summary text, independent of seoDescription (which stays the
  // SEO meta/JSON-LD description). Falls back to seoDescription when unset.
  listingExcerpt?: string;
  featuredImage: string | null;
  categories: string[];
}

function formatDate(date: string) {
  const d = new Date(date.replace(" ", "T") + "Z");
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
}

export function BlogCard({ post, priority = false }: { post: BlogCardData; priority?: boolean }) {
  return (
    <Link
      href={`/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all"
    >
      <div className="relative w-full aspect-[16/10] bg-gray-100">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <ImageOff className="text-gray-300" size={32} />
          </div>
        )}
        {/* Category badge over the thumbnail removed per request -- the
            underlying post.categories data (SEO relationships, category
            filter) is untouched, only the visible overlay is gone. */}
      </div>
      <div className="flex flex-col flex-1 p-5">
        <p className="text-xs text-gray-400 mb-2">{formatDate(post.date)}</p>
        <h3 className="text-base font-bold text-brand leading-snug mb-2 group-hover:text-teal transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{post.listingExcerpt ?? post.seoDescription}</p>
      </div>
    </Link>
  );
}
