import Image from "next/image";
import HeroUser from "@/components/Hero-user";
import { User } from "../../../../../types/user-type";
import UserServices from "@/components/UserServices";
import capitalize from "@/helpers/capitalize";
import { Metadata } from "next";
import { ProfilePage, WithContext } from "schema-dts";
import { InternalLink } from "@/components/links/InternalLink";
import { userPageRes, userSeoRes } from "../../../../../types/PageRes";
import { fetchData } from "@/utils/payloadFetch";
import { toSentence } from "../../../../helpers/toSentence";
import { defaultImages } from "@/utils/defaultImages";

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
              image{url}
            }
          }
        }
      }
    }
  }
  `;

  const data: userSeoRes | null = await fetchData(query, "POST", "Users");

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

  const ogImage = defaultImages.defaultOgImage;

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
              slug
              image {
                url
              }
            }
          }
        }
      }
    }
    UserInterviews( slug: "${userParam}"){
      docs{
        name
      seo{slug image{url}}
        badge{seo{slug}}
    }
    }
  }
  `;

  const data: userPageRes | null = await fetchData(
    query,
    "POST",
    "Users",
    "UserInterviews"
  );

  if (!data) {
    return null;
  }

  return data;
}

export default async function User({ params }: Props) {
  const userParam = params.user;
  const data = await getData(userParam);

  if (!data) {
    return "no question";
  }

  const user = data.data.Users.docs[0];
  const badges = user.userBadges;
  const interviews = data.data.UserInterviews.docs;
  const userName = user.userName;
  const services = badges.flatMap((badge) => {
    return badge.services.map((service) => {
      return {
        name: service.name,
        url: service.url,
      };
    });
  });

  const badgesSingularNamesArray = user.userBadges.map((item) => {
    return item.badge.singularName;
  });

  const badgesSingularNames = toSentence(badgesSingularNamesArray);
  const pfp = user.seo.image?.url;

  const userBadges = badges.map((item) => {
    const imageUrl = item.badge.seo.image?.url;
    const imageAlt = item.badge.singularName;
    const singularName = item.badge.singularName;
    const badgeSlug = item.badge.seo.slug;
    return (
      <InternalLink
        element={
          <>
            <Image
              alt={imageAlt}
              className="w-[25px] sm:w-[35px]"
              width={35}
              height={35}
              src={imageUrl || defaultImages.defaultBadgeImage}
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "100px",
              }}
            ></Image>
            {singularName}
          </>
        }
        href={`/badge/${badgeSlug}`}
        className="flex flex-row items-center gap-1 text-tl-dark-blue"
        eventName="ClickBadgeName"
        target={singularName}
        locationOnPage="hero"
      />
    );
  });

  const userInterviews = interviews.map((item) => (
    <InternalLink
      element={
        <>
          <Image
            className="w-[50px] h-[50px] sm:w-[65px] sm:h-[65px]"
            src={item.seo.image?.url || defaultImages.defaultInterviewImage}
            alt={item.name}
            width={65}
            height={65}
            style={{
              borderRadius: "100px",
            }}
          ></Image>
          <div className="flex flex-col">
            <span className="text-tl-dark-blue">{userName}</span>
            <p>{item.name}</p>
          </div>
        </>
      }
      href={`/interview/${item.badge.seo.slug}/${userParam}/${item.seo.slug}`}
      className="flex flex-row w-full gap-2 sm:gap-5 my-5 items-center capitalize"
      eventName="ClickInterviewPage"
      target={item.name}
      locationOnPage="Interviews list"
    />
  ));

  const jsonLd: WithContext<ProfilePage> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: userName,
      jobTitle: badgesSingularNames,
      image: pfp || defaultImages.defaultUserImage,
      url: `https://www.weasker.com/user/${params.user}`,
      award: badges.map((item) => {
        return `${item.badge.singularName} Badge`;
      }),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroUser
        h1={userName}
        badges={userBadges}
        services={<UserServices services={services} />}
        excerpt={user.seo.excerpt}
        featuredImageSrc={user.seo.image?.url || defaultImages.defaultUserImage}
        featuredImageAlt={userName}
      />
      <div className="sm:w-[70%]">
        <h2>Interviews</h2>
        {userInterviews}
      </div>
    </>
  );
}
