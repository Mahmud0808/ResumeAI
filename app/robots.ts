import type { MetadataRoute } from "next";

const BASE_URL = "https://resume-ai-app.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep auth-gated and user-generated resume pages out of search results.
      disallow: ["/dashboard", "/my-resume/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
