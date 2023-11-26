import { MetadataRoute } from "next";
import { getSiteMapData } from "../../../sanity/sanity-utils";

const WEBSITE_HOST_URL = process.env.SITE_URL || "https://www.weasker.com";

type changeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let data = await getSiteMapData();

  const questions = data.questions.map((item, index) => ({
    url: `${WEBSITE_HOST_URL}/question/${item.badgeSlug}/${item.questionSlug}`,
    lastModified: item.updated,
    changeFrequency: "daily" as changeFrequency,
  }));

  const interviews = data.interviews.map((item, index) => ({
    url: `${WEBSITE_HOST_URL}/interview/${item.badgeSlug}/${item.userSlug}/${item.interviewSlug}`,
    lastModified: item.updated,
    changeFrequency: "daily" as changeFrequency,
  }));

  const users = data.users.map((item, index) => ({
    url: `${WEBSITE_HOST_URL}/user/${item.userSlug}`,
    lastModified: item.updated,
    changeFrequency: "weekly" as changeFrequency,
  }));

  const badges = data.badges.map((item, index) => ({
    url: `${WEBSITE_HOST_URL}/badge/${item.badgeSlug}`,
    lastModified: item.updated,
    changeFrequency: "weekly" as changeFrequency,
  }));

  const pages = data.pages.map((item, index) => ({
    url:
      item.pageSlug == "/"
        ? `${WEBSITE_HOST_URL}`
        : `${WEBSITE_HOST_URL}/${item.pageSlug}`,
    lastModified: item.updated,
    changeFrequency: "weekly" as changeFrequency,
  }));

  return [...questions, ...interviews, ...users, ...badges, ...pages];
}
