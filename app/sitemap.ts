import type { MetadataRoute } from "next";

const BASE_URL = "https://resume-ai-app.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Only public, non-user-specific routes belong in the sitemap.
  const routes = ["", "/sign-in", "/sign-up"];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.6,
  }));
}
