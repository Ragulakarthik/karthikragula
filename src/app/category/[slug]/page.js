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
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
          <span>{category.emoji}</span>
          {category.label}
        </h1>
        <p className="mt-1 text-black/60 dark:text-white/60">{category.description}</p>
      </div>
      <CategoryClient category={category} videos={videos} />
    </div>
  );
}
