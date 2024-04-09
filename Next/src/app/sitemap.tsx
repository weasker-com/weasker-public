import { MetadataRoute } from "next";
import { fetchData } from "@/utils/payloadFetch";
import {
  Badge,
  Interview,
  Page,
  User,
  UsersInterview,
} from "@/payload/payload-types";

const WEBSITE_HOST_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.weasker.com";

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
    UsersInterviews(where: { badgeSlug: { not_equals: "qa" } },limit: 1000000) {
      docs {
        userSlug
        interviewSlug
        badgeSlug
        answersAmount
        updatedAt
        answers {
          answer {
            questionSlug
          }
        }
      }
    }
    Interviews(where: { id: { not_equals: "65f6cf1f935129013b4e4c7f" } }, limit: 1000000) {
      docs {
        seo {
          slug
        }
        userInterviews {
          id
        }
        updatedAt
        badge {
          seo {
            slug
          }
        }
        questions {
          question {
            seo {
              slug
            }
          }
        }
      }
    }
    Users(where: { roles: { equals: endUser } },limit: 1000000) {
      docs {
        seo {
          slug
        }
        updatedAt
      }
    }
    Badges(where: { id: { not_equals: "65f6cb63935129013b4e491a" } },limit: 1000000) {
      docs {
        seo {
          slug
        }
        updatedAt
      }
    }
    Pages(limit: 1000000) {
      docs {
        category
        seo {
          slug
        }
        updatedAt
      }
    }
  }
    `;

  const data: {
    data: {
      UsersInterviews: { docs: UsersInterview[] };
      Interviews: { docs: Interview[] };
      Users: { docs: User[] };
      Badges: { docs: Badge[] };
      Pages: { docs: Page[] };
    };
  } | null = await fetchData({
    query,
    method: "POST",
    collection: "Interviews",
  });

  if (!data) {
    return null;
  }
  return data;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getData();

  if (!data) {
    return [
      {
        url: WEBSITE_HOST_URL,
        lastModified: new Date(),
        changeFrequency: "daily" as changeFrequency,
      },
    ];
  }

  const userInterviews = data.data.UsersInterviews.docs
    .filter((item) => {
      return item.answersAmount > 0;
    })
    .map((userInterview) => {
      return {
        url: `${WEBSITE_HOST_URL}/interview/${userInterview.badgeSlug}/${userInterview.userSlug}/${userInterview.interviewSlug}`,
        lastModified: userInterview.updatedAt,
        changeFrequency: "daily" as changeFrequency,
      };
    });

  const allInterviews = data.data.Interviews.docs
    .filter((item) => {
      return item.userInterviews.length > 0;
    })
    .map((interview) => {
      return {
        url: `${WEBSITE_HOST_URL}/interview/${
          (interview.badge as Badge).seo.slug
        }/all/${interview.seo.slug}`,
        lastModified: interview.updatedAt,
        changeFrequency: "daily" as changeFrequency,
      };
    });

  const questions = data.data.Interviews.docs
    .filter((interview) => {
      return interview.userInterviews.length > 0;
    })
    .flatMap((interview) => {
      return interview.questions.map((question) => {
        const badgeSlug = (interview.badge as Badge).seo.slug;
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

  const users = data.data.Users.docs.map((user) => {
    const slug = user.seo.slug;
    const lastModified = user.updatedAt;
    return {
      url: `${WEBSITE_HOST_URL}/user/${slug}`,
      lastModified,
      changeFrequency: "weekly" as changeFrequency,
    };
  });

  const badges = data.data.Badges.docs.map((badge) => {
    const slug = badge.seo.slug;
    const lastModified = badge.updatedAt;
    return {
      url: `${WEBSITE_HOST_URL}/badge/${slug}`,
      lastModified,
      changeFrequency: "weekly" as changeFrequency,
    };
  });

  const pages = data.data.Pages.docs.map((page) => {
    const slug = page.seo.slug;
    const lastModified = page.updatedAt;

    if (page.category && page.category !== "noCategory") {
      return {
        url: `${WEBSITE_HOST_URL}/${page.category}/${slug}`,
        lastModified,
        changeFrequency: "weekly" as changeFrequency,
      };
    }
    return {
      url: slug == "/" ? `${WEBSITE_HOST_URL}` : `${WEBSITE_HOST_URL}/${slug}`,
      lastModified,
      changeFrequency: "weekly" as changeFrequency,
    };
  });

  return [
    ...pages,
    ...badges,
    ...users,
    ...allInterviews,
    ...userInterviews,
    ...questions,
  ];
}
