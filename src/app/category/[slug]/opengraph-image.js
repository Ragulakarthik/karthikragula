import { CATEGORIES, getCategory } from "@/data/categories";
import { getVideosByCategory } from "@/lib/videos";
import { OG_SIZE, renderOgImage } from "@/lib/ogImage";

export const alt = "Karthik Ragula video sheet";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.id }));
}

export default async function Image({ params }) {
  const { slug } = await params;
  const category = getCategory(slug) ?? CATEGORIES[0];
  const count = getVideosByCategory(category.id).length;

  return renderOgImage({
    tag: `${count} video${count === 1 ? "" : "s"}`,
    title: `${category.label} Sheet`,
    subtitle: category.description,
    color: category.color,
  });
}
