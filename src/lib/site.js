// Public origin of the site, used for canonical URLs, the sitemap and share previews.
// Set SITE_URL once a custom domain is live; Render provides RENDER_EXTERNAL_URL otherwise.
export const SITE_URL = (
  process.env.SITE_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  "https://karthikragula.onrender.com"
).replace(/\/$/, "");

export const SITE_NAME = "Karthik Ragula";
