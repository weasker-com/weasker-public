import { MetadataRoute } from "next";
import { fetchData } from "@/utils/payloadFetch";
import { Community, Page, Question, User } from "@/payload/payload-types";

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
  const query = `{
  Questions(
    where: { communities: { not_in: ["668815e56280ae52d4d4a79c"] } }
    limit: 1000000
  ) {
    docs {
      answersSum
      path
      updatedAt
    }
  }
  Communities(
    where: { id: { not_equals: "668815e56280ae52d4d4a79c" } }
    limit: 1000000
  ) {
    docs {
      path
      updatedAt
    }
  }
  Users(where: { roles: { equals: endUser } }, limit: 1000000) {
    docs {
      path
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
      Questions: { docs: Question[] };
      Communities: { docs: Community[] };
      Users: { docs: User[] };
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

  const questions = data.data.Questions.docs
    .filter((item) => {
      return item.answersSum > 0;
    })
    .map((item) => {
      return {
        url: `${WEBSITE_HOST_URL}/question/${item.path}`,
        lastModified: item.updatedAt,
        changeFrequency: "daily" as changeFrequency,
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

  const users = data.data.Users.docs.map((user) => {
    const lastModified = user.updatedAt;
    return {
      url: `${WEBSITE_HOST_URL}/user/${user.path}`,
      lastModified,
      changeFrequency: "weekly" as changeFrequency,
    };
  });

  const communities = data.data.Communities.docs.map((community) => {
    return {
      url: `${WEBSITE_HOST_URL}/community/${community.path}`,
      lastModified: community.updatedAt,
      changeFrequency: "weekly" as changeFrequency,
    };
  });

  return [...pages, ...communities, ...users, ...questions];
}
