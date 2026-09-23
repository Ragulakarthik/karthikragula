import { SITE_URL } from "@/lib/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The chat assistant is hidden from the UI for now; keep it out of search results too.
      disallow: ["/api/", "/chat"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
