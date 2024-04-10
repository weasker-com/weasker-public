import { Metadata } from "next";
import capitalize from "@/helpers/capitalize";
import { fetchData } from "@/utils/payloadFetch";
import { defaultImages } from "@/utils/defaultImages";
import { notFound } from "next/navigation";
import ClientPage from "./ClientPage";
import { Badge as BadgeType, Media } from "@/payload/payload-types";

type Props = {
  params: { badge: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = ` {
    Badges(where: { seo__slug: { equals: "${params.badge}"} }) {
      docs {
        id
        singularName
        pluralName
        seo {
          slug
          excerpt
          image {
            url
            filename
          }
          excerpt
        }
        users {
          id
          userName
          userBadges {
            bio
            badge {
              seo {
                slug
              }
            }
            links {
              linkOne
              linkTwo
              linkThree
              linkFour
              linkFive
            }
          }
          seo {
            slug
            image {
              url
              filename
            }
          }
        }
        interviews {
          id
          name
          userInterviews{id}
          seo {
            slug
            image {
              url
              filename
            }
          }
          questions {
            question {
              shortQuestion
              mediumQuestion
              longQuestion
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
      }
    }
  }
  `;

  const data: { data: { Badges: { docs: BadgeType[] } } } | null =
    await fetchData({
      query,
      method: "POST",
      collection: "Badges",
      mustHave: ["Badges"],
    });

  if (!data) {
    return {};
  }

  const badge = data.data.Badges.docs[0];

  const singularName = badge.singularName;
  const pluralName = badge.pluralName;
  const usersAmount = badge.users.length;
  const image = (badge.seo.image as Media)?.url || defaultImages.weaskerLogoUrl;
  const seoTitle = badge.seo.title;
  const seoDescription = badge.seo.description;

  const metaTitle = capitalize(
    seoTitle ? seoTitle : `${pluralName} Badge | ${usersAmount} Experts`
  );

  const metaDescription = seoDescription
    ? seoDescription
    : `This badge is awarded to verified ${pluralName}. Click here to read our interviews with ${usersAmount} ${pluralName}`;

  const ogImage = `${process.env.SITE_URL}/api/og?img=${image}&preTitle=weasker.com&title=${singularName} badge`;

  const slug = params.badge;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      images: [ogImage],
      type: "website",
      url: `https://www.weasker.com/badge/${slug}`,
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

async function getData(badgeParam: string) {
  const query = ` {
    Badges(where: { seo__slug: { equals: "${badgeParam}"} }) {
      docs {
        id
        singularName
        pluralName
        terms
        seo {
          slug
          excerpt
          image {
            url
            filename
          }
          excerpt
        }
        users {
          id
          userName
          userBadges {
            bio
            badge {
              seo {
                slug
              }
            }
            links {
              linkOne
              linkTwo
              linkThree
              linkFour
              linkFive
            }
          }
          seo {
            slug
            image {
              url
              filename
            }
          }
        }
        interviews {
          id
          name
          userInterviews{id}
          seo {
            slug
            image {
              url
              filename
            }
          }
          questions {
            question {
              shortQuestion
              mediumQuestion
              longQuestion
         
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
      }
    }
  }
  `;

  const data: { data: { Badges: { docs: BadgeType[] } } } | null =
    await fetchData({
      query,
      method: "POST",
      collection: "Badges",
      mustHave: ["Badges"],
    });

  if (!data) {
    return null;
  }

  return data;
}

export default async function Badge({ params }: Props) {
  const data = await getData(params.badge);

  if (!data) {
    notFound();
  }

  return <ClientPage data={data} params={params} />;
}
