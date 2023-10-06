import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/og/*"],
      disallow: "/studio",
    },
    sitemap:
      `${process.env.SITE_URL}/sitemap.xml` ||
      "https://www.weasker.com/sitemap.xml",
  };
}
