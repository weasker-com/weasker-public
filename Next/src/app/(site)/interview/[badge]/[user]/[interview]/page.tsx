import capitalize from "@/helpers/capitalize";
import { Metadata } from "next";
import { fetchData } from "@/utils/payloadFetch";
import {
  interviewPageRes,
  interviewSeoRes,
} from "../../../../../../../types/Responses";
import { defaultImages } from "@/utils/defaultImages";
import { notFound } from "next/navigation";
import InterviewPage from "@/components/pages/InterviewPage";
import InterviewAllPage from "@/components/pages/InterviewAllPage";

type Props = {
  params: { badge: string; user: string; interview: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = `
  {
    BadgeInterview(badgeSlug:"${params.badge}" interviewSlug:"${params.interview}") {
      docs {
        name
        badge {singularName pluralName seo{image{url filename}}}
        seo {title description image{url filename}}
      }
    }
    InterviewUser(slug:"${params.user}") {
      docs {
        userName
        seo{image{url filename}}
      }
    }
    }
  `;

  const data: interviewSeoRes | null = await fetchData({
    query,
    method: "POST",
    collection: "Interviews",
    mustHave: ["BadgeInterview", "InterviewUser"],
  });

  if (!data) {
    return {};
  }

  const interview = data.data.BadgeInterview.docs[0];
  const user = data.data.InterviewUser.docs[0];
  const seoTitle = interview.seo.title;
  const seoDescription = interview.seo.description;
  const userName = user.userName;
  const pfp = user.seo.image?.url || defaultImages.weaskerLogoUrl;
  const interviewName = interview.name;
  const badgeSingularName = interview.badge.singularName;
  const badgePluralName = interview.badge.pluralName;
  const interviewImage =
    interview.seo.image?.url || defaultImages.weaskerLogoUrl;

  const metaTitle = capitalize(
    seoTitle ? seoTitle : `${userName} ${interviewName}`
  );

  const metaDescription = seoDescription
    ? seoDescription
    : `${badgeSingularName} ${userName} took the interview ${interviewName} for ${badgePluralName}`;

  const ogImage = `${process.env.SITE_URL}/api/og?img=${interviewImage}&smallImg=${pfp}&preTitle=${userName} interview&title=${interviewName}`;
  const slugA = params.badge;
  const slugB = params.user;
  const slugC = params.interview;

  const author = {
    name: userName,
    url: `https://www.weasker.com/user/${slugB}`,
  };

  return {
    title: metaTitle,
    description: metaDescription,
    authors: author,
    alternates: {
      canonical: `https://www.weasker.com/interview/${slugA}/all/${slugC}/`,
    },
    openGraph: {
      images: [ogImage],
      type: "website",
      url: `https://www.weasker.com/interview/${slugA}/${slugB}/${slugC}/`,
      title: metaTitle,
      description: metaDescription,
      siteName: process.env.SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      siteId: "1743914690978164736",
      creator: process.env.SITE_NAME,
      creatorId: "1743914690978164736",
      images: [ogImage],
    },
  };
}

async function getData(
  userParam: string,
  interviewParam: string,
  badgeParam: string
) {
  const query = `{
    BadgeInterview(
      badgeSlug: "${badgeParam}"
      interviewSlug: "${interviewParam}"
    ) {
      docs {
        name
        badge {
          singularName
          pluralName
          seo {
            image {
              filename
              url
            }
          }
        }
        seo {
          slug
          image {
            filename
            url
          }
        }
        questions {
          question {
            shortQuestion
            mediumQuestion
            longQuestion
            seo{slug image{url filename}}
            answers {
              user {
                userName
                seo {
                  slug
                  image {
                    url
                    filename
                  }
                }
                userBadges {
                  services {
                    name
                    url
                  }
                  bio
                  badge {
                    singularName
                    seo {
                      slug
                      image {
                        url
                        filename
                      }
                    }
                  }
                }
              }
              answer {
                updatedAt
                richText_html
                images {image{url filename}}
                video{url filename}
              }
            }
            seo {
              slug
            }
          }
        }
      }
    }
    ${
      userParam &&
      `
      InterviewUser(slug: "${userParam}") {
      docs {
        userName
        seo {
          slug
          image {
            filename
            url
          }
        }
        userBadges {
          services {
            name
            url
          }
          bio
          badge {
            singularName
            seo{
              slug
            }
          }
        }
      }
    }
    `
    }
  }`;

  const data: interviewPageRes | null = await fetchData({
    query: query,
    method: "POST",
    collection: "Interviews",
    mustHave:
      userParam == "all"
        ? ["BadgeInterview"]
        : ["InterviewUser", "BadgeInterview"],
  });

  if (!data) {
    return null;
  }

  return data;
}

export default async function Interview({ params }: Props) {
  const data = await getData(params.user, params.interview, params.badge);

  if (!data) {
    notFound();
  }

  if (params.user == "all")
    return <InterviewAllPage data={data} params={params} />;
  else return <InterviewPage data={data} params={params} />;
}
