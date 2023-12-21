import { MetadataRoute } from "next";
import { getSiteMapData } from "../../../sanity/sanity-utils";
import { fetchData } from "@/utils/payloadFetch";
import { siteMapRes } from "../../../types/PageRes";

const WEBSITE_HOST_URL = process.env.SITE_URL || "https://www.weasker.com";

type changeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

async function getData() {
  const query = `
    {
      Interviews {
        docs {
          seo {
            slug
          }
          updatedAt
          badge{seo{slug}}
          questions {
            question {
              answers {
                user {
                  seo {
                    slug
                  }
                }
              }
              seo {
                slug
              }
            }
          }
        }
      }
      Users{
        docs{
          seo{slug}
          updatedAt
        }
      }
      Badges{
        docs{
          seo{slug}
          updatedAt
        }
      }
      Pages{docs{seo{slug} updatedAt}}
    }    
    `;

  const data: siteMapRes | null = await fetchData(query, "POST", "Interviews");

  if (!data) {
    return null;
  }
  return data;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let data = await getSiteMapData();
  const newData = await getData();

  if (!newData) {
    return [
      {
        url: WEBSITE_HOST_URL,
        lastModified: new Date(),
        changeFrequency: "daily" as changeFrequency,
      },
    ];
  }

  const questions = newData.data.Interviews.docs.flatMap((interview) => {
    return interview.questions.map((question) => {
      const badgeSlug = interview.badge.seo.slug;
      const interviewUpdatedAt = interview.updatedAt;
      const interviewSlug = interview.seo.slug;
      const questionSlug = question.question.seo.slug;
      return {
        url: `${WEBSITE_HOST_URL}/question/${badgeSlug}/${interviewSlug}/${questionSlug}`,
        lastModified: interviewUpdatedAt,
        changeFrequency: "daily" as changeFrequency,
      };
    });
  });

  const uniqueUrls = new Set();
  const interviews = newData.data.Interviews.docs.flatMap((interview) => {
    const badgeSlug = interview.badge.seo.slug;
    const interviewUpdatedAt = interview.updatedAt;
    const interviewSlug = interview.seo.slug;

    return interview.questions.flatMap((question) => {
      return question.question.answers
        .filter((answer) => {
          const userSlug = answer.user.seo.slug;
          const url = `${WEBSITE_HOST_URL}/interview/${badgeSlug}/${userSlug}/${interviewSlug}`;

          if (!uniqueUrls.has(url)) {
            uniqueUrls.add(url);
            return true;
          }

          return false;
        })
        .map((answer) => {
          const userSlug = answer.user.seo.slug;
          return {
            url: `${WEBSITE_HOST_URL}/interview/${badgeSlug}/${userSlug}/${interviewSlug}`,
            lastModified: interviewUpdatedAt,
            changeFrequency: "daily" as changeFrequency,
          };
        });
    });
  });

  const users = newData.data.Users.docs.map((user) => {
    const slug = user.seo.slug;
    const lastModified = user.updatedAt;
    return {
      url: `${WEBSITE_HOST_URL}/user/${slug}`,
      lastModified,
      changeFrequency: "weekly" as changeFrequency,
    };
  });

  const badges = newData.data.Badges.docs.map((badge) => {
    const slug = badge.seo.slug;
    const lastModified = badge.updatedAt;
    return {
      url: `${WEBSITE_HOST_URL}/badge/${slug}`,
      lastModified,
      changeFrequency: "weekly" as changeFrequency,
    };
  });

  const pages = newData.data.Pages.docs.map((page) => {
    const slug = page.seo.slug;
    const lastModified = page.updatedAt;
    return {
      url: slug == "/" ? `${WEBSITE_HOST_URL}` : `${WEBSITE_HOST_URL}/${slug}`,
      lastModified,
      changeFrequency: "weekly" as changeFrequency,
    };
  });

  return [...pages, ...badges, ...users, ...interviews, ...questions];
}
