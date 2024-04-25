import capitalize from "@/helpers/capitalize";
import { Metadata } from "next";
import { fetchData } from "@/utils/payloadFetch";
import { toSentence } from "../../../../helpers/toSentence";
import { notFound } from "next/navigation";
import ClientPage from "@/app/(site)/user/[user]/ClientPage";
import { Badge, Media, User as UserType } from "@/payload/payload-types";

type Props = {
  params: { user: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = `
  {
    Users(where: { seo__slug: { equals: "${params.user}" } }) {
      docs {
        userName
        displayName
        id
        seo {
          slug
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
          links{
            linkOne
            linkTwo
            linkThree
            linkFour
            linkFive
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
        userInterviews{
          interview{
            name
            seo{slug excerpt image{url filename}}
        badge{pluralName singularName seo{slug}}
        questions{question{shortQuestion}}
          }
          badge{
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
  }
  `;

  const data: { data: { Users: { docs: UserType[] } } } | null =
    await fetchData({
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
    return (item.badge as Badge).singularName;
  });

  const badgesSingularNames = toSentence(badgesSingularNamesArray);
  const userName = user.userName;
  const userImage = (user.seo.image as Media)?.url;

  const metaTitle = capitalize(
    seoTitle
      ? seoTitle
      : `${user.displayName || userName} | ${badgesSingularNames}`
  );

  const metaDescription = seoDescription
    ? seoDescription
    : user.seo.excerpt
    ? user.seo.excerpt
    : `${
        user.displayName || userName
      } is a ${badgesSingularNames}. Click here to see their interviews.`;

  const ogImage = `${
    process.env.SITE_URL
  }/api/og?img=${userImage}&preTitle=Weasker.com&title=${
    user.displayName || userName
  }`;

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
        displayName
        id
        seo {
          slug
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
          links{
            linkOne
            linkTwo
            linkThree
            linkFour
            linkFive
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
        userInterviews{
          interview{
            name
            seo{slug excerpt image{url filename}}
        badge{pluralName singularName seo{slug}}
        questions{question{shortQuestion}}
          }
          badge{
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
  }
  `;

  const data: { data: { Users: { docs: UserType[] } } } | null =
    await fetchData({
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

  return <ClientPage data={data} params={params} />;
}
