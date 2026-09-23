import { CATEGORIES } from "@/data/categories";
import { SITE_URL } from "@/lib/site";

export default function sitemap() {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...CATEGORIES.map((c) => ({
      url: `${SITE_URL}/category/${c.id}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
