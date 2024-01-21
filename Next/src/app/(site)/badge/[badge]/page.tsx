import { Metadata } from "next";
import capitalize from "@/helpers/capitalize";
import { fetchData } from "@/utils/payloadFetch";
import { badgePageRes, badgeSeoRes } from "../../../../../types/Responses";
import { defaultImages } from "@/utils/defaultImages";
import { notFound } from "next/navigation";
import BadgePage from "@/components/pages/BadgePage";

type Props = {
  params: { badge: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = ` {
    Badges(where: { seo__slug: { equals: "${params.badge}"} }) {
      docs {
        singularName
        pluralName
        seo {
          title
          description
          image {
            url
            filename
          }
          keywords {
            keyword
          }
        }
      }
    }
    BadgeUsers(slug: "${params.badge}") {
      docs {
        id
      }
    }
  }
  
  `;

  const data: badgeSeoRes | null = await fetchData({
    query,
    method: "POST",
    collection: "Badges",
    mustHave: ["Badges"],
  });

  if (!data) {
    return {};
  }

  const seoMeta = data.data.Badges.docs[0];
  const singularName = seoMeta.singularName;
  const pluralName = seoMeta.pluralName;
  const usersAmount = data.data.BadgeUsers.docs.length;
  const image = seoMeta.seo.image?.url || defaultImages.weaskerLogoUrl;
  const seoTitle = seoMeta.seo.title;
  const seoDescription = seoMeta.seo.description;

  const metaTitle = capitalize(
    seoTitle ? seoTitle : `We interviewed the ${usersAmount} best ${pluralName}`
  );

  const metaDescription = seoDescription
    ? seoDescription
    : `We interviewed ${usersAmount} of the best ${pluralName}, read what each ${singularName} had to say.`;

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
        singularName
        pluralName
        seo {
          excerpt
          image {
            url
            filename
          }
        }
      }
    }
    BadgeUsers(slug: "${badgeParam}") {
      docs {
        userName
        userBadges{
          bio
          services{name url}
          badge{seo{slug}}
        }
        seo {
          slug
          image {
            url
            filename
          }
        }
      }
    }
    BadgeQuestions(slug: "${badgeParam}"){
      docs{
        name
        seo{slug image{url filename}}
        questions{
          question{
            answers{user{userName}}
            shortQuestion
            mediumQuestion
            longQuestion
            index
            seo{slug image{url filename}}
          }
        }
      }
    }
  }
  `;

  const data: badgePageRes | null = await fetchData({
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

  return <BadgePage data={data} params={params} />;
}
