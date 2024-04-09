import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["*"],
      disallow: [
        "/api/og/*",
        "/admin/*",
        "/account/*",
        "/interview/*/edit/*",
        "/badge/qa",
        "/interview/qa/*",
        "/question/qa/*",
      ],
    },
    sitemap:
      `${process.env.SITE_URL}/sitemap.xml` ||
      "https://www.weasker.com/sitemap.xml",
  };
}
