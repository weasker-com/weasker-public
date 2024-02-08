import capitalize from "@/helpers/capitalize";
import { Metadata } from "next";
import { userPageRes, userSeoRes } from "../../../../../types/Responses";
import { fetchData } from "@/utils/payloadFetch";
import { toSentence } from "../../../../helpers/toSentence";
import { notFound } from "next/navigation";
import UserPage from "@/app/(site)/user/[user]/UserPage";

type Props = {
  params: { user: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = `
  {
    Users(where: { seo__slug: { equals: "${params.user}" } }) {
      docs {
        userName
        seo {
          title
          description
          excerpt
          image {
            url
            filename
          }
        }
        userBadges {
          bio
          services{name url}
          badge {
            pluralName
            singularName
            seo {
              slug
              image{url filename}
            }
          }
        }
      }
    }
  }
  `;

  const data: userSeoRes | null = await fetchData({
    query,
    method: "POST",
    collection: "Users",
    mustHave: ["Users"],
  });

  if (!data) {
    return {};
  }

  const user = data.data.Users.docs[0];

  const seoTitle = user.seo.title;
  const seoDescription = user.seo.description;
  const badgesSingularNamesArray = user.userBadges.map((item) => {
    return item.badge.singularName;
  });

  const badgesSingularNames = toSentence(badgesSingularNamesArray);
  const userName = user.userName;
  const userImage = user.seo.image?.url;

  const metaTitle = capitalize(
    seoTitle ? seoTitle : `${userName} - Weasker page`
  );

  const metaDescription = seoDescription
    ? seoDescription
    : `${userName} is a ${badgesSingularNames}. Visit their user-page on ${process.env.SITE_NAME}`;

  const ogImage = `${process.env.SITE_URL}/api/og?img=${userImage}&preTitle=Weasker.com&title=${userName} expert page`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      images: [ogImage],
      type: "website",
      url: `https://www.weasker.com/user/${params.user}`,
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

async function getData(userParam: string) {
  const query = `
  {
    Users(where: { seo__slug: { equals: "${userParam}" } }) {
      docs {
        userName
        id
        seo {
          title
          description
          excerpt
          image {
            url
            filename
          }
        }
        userBadges {
          bio
          services {
            name
            url
          }
          badge {
            pluralName
            singularName
            seo {
              excerpt
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
    UserInterviews( slug: "${userParam}"){
      docs{
        name
        seo{slug excerpt image{url filename}}
        badge{pluralName singularName seo{slug}}
        questions{question{shortQuestion}}
    }
    }
  }
  `;

  const data: userPageRes | null = await fetchData({
    query,
    method: "POST",
    collection: "Users",
    mustHave: ["Users"],
  });

  if (!data) {
    return null;
  }

  return data;
}

export default async function User({ params }: Props) {
  const userParam = params.user;
  const data = await getData(userParam);

  if (!data) {
    notFound();
  }

  return <UserPage data={data} params={params} />;
}
