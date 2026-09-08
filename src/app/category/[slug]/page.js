import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/data/categories";
import { getVideosByCategory } from "@/lib/videos";
import CategoryClient from "@/components/CategoryClient";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.label} — Karthik Ragula`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const videos = getVideosByCategory(category.id);

  return (
    <div className="w-full px-4 py-10 sm:px-6 lg:pl-10 lg:pr-0 2xl:pl-16">
      <div className="mb-8 flex items-center gap-4">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[var(--line)] text-2xl"
          style={{ backgroundColor: category.color }}
        >
          {category.emoji}
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {category.label}
          </h1>
          <p className="mt-1 font-medium text-[var(--muted)]">{category.description}</p>
        </div>
      </div>
      <CategoryClient category={category} videos={videos} />
    </div>
  );
}
