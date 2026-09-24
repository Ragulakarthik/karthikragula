// Public origin of the site, used for canonical URLs, the sitemap and share previews.
// Set SITE_URL to override; on Vercel, VERCEL_PROJECT_PRODUCTION_URL tracks the production
// domain (including a custom one, once added).
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : null;

export const SITE_URL = (
  process.env.SITE_URL ||
  vercelProductionUrl ||
  "https://karthikragula.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Karthik Ragula";
