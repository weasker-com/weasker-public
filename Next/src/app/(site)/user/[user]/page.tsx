import capitalize from "@/helpers/capitalize";
import { Metadata } from "next";
import { ProfilePage, WithContext } from "schema-dts";
import { InternalLink } from "@/components/links/InternalLink";
import { userPageRes, userSeoRes } from "../../../../../types/Responses";
import { fetchData } from "@/utils/payloadFetch";
import { toSentence } from "../../../../helpers/toSentence";
import { defaultImages } from "@/utils/defaultImages";
import Hero from "@/components/Hero";
import SubMenu from "@/components/SubMenu";
import ListItem from "@/components/ListItem";
import { TbMessageShare } from "react-icons/tb";
import SidebarBox from "@/components/SidebarBox";
import { IoLinkOutline } from "react-icons/io5";
import { PiShareFatThin } from "react-icons/pi";
import SocialShareButtons from "@/components/SocialShareButtons";

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
  const userExcerpt = user.seo.excerpt;
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
  const pfp = user.seo.image?.filename;

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

  const subMenuArray = [
    {
      name: "Badges",
      slug: "badges",
      tab: (
        <>
          <div className="lg:w-[70%] flex flex-col">
            {badges.map((item) => {
              return (
                <ListItem
                  location={"user"}
                  name={item.badge.singularName}
                  preTitle={"Badge"}
                  slugs={`/badge/${item.badge.seo.slug}`}
                  image={
                    item.badge.seo.image?.filename ||
                    defaultImages.defaultBadgeImage
                  }
                  excerpt={item.badge.seo.excerpt || item.bio}
                  links={[
                    <InternalLink
                      element={
                        <div className="flex flex-row gap-1 items-center">
                          <TbMessageShare /> <>View badge</>
                        </div>
                      }
                      style={"blue"}
                      href={`/badge/${item.badge.seo.slug}`}
                      eventName={"ClickBadgeName"}
                      target={item.badge.pluralName}
                      locationOnPage={"list item"}
                    />,
                  ]}
                />
              );
            })}
          </div>
          <div className="lg:block hidden w-[30%] text-sm">
            <SidebarBox
              title={user.userName}
              element={<>{userExcerpt || badges[0].bio}</>}
            />
            <SidebarBox
              title={`Contact ${userName}`}
              linkStyle="blue"
              array={badges[0].services.map((item) => {
                return {
                  name: item.name,
                  url: item.url,
                  icon: <IoLinkOutline size={20} />,
                  eventName: "ClickQuestionPage",
                };
              })}
            />
          </div>
        </>
      ),
    },
    {
      name: "Interviews",
      slug: "interviews",
      tab: (
        <>
          <div className="lg:w-[70%] flex flex-col">
            {interviews.map((item) => {
              const threeShortQuestions = item.questions
                .slice(0, 3)
                .map((question) => {
                  return ` ${question.question.shortQuestion}`;
                });
              return (
                <ListItem
                  location={"user"}
                  name={item.name}
                  preTitle={userName}
                  slugs={`/interview/${item.badge.seo.slug}/${params.user}/${item.seo.slug}`}
                  image={
                    item.seo.image?.filename ||
                    defaultImages.defaultInterviewImage
                  }
                  excerpt={
                    item.seo.excerpt ||
                    `In this interview we asked ${item.badge.pluralName} ${item.questions.length} questions ${item.name}. For example: ${threeShortQuestions}`
                  }
                  links={[
                    <InternalLink
                      element={
                        <div className="flex flex-row gap-1 items-center">
                          <TbMessageShare /> <>Full interview</>
                        </div>
                      }
                      style={"blue"}
                      href={`/interview/${item.badge.seo.slug}/${params.user}/${item.seo.slug}`}
                      eventName={"ClickInterviewPage"}
                      target={item.name}
                      locationOnPage={"list item"}
                    />,
                  ]}
                />
              );
            })}
          </div>
          <div className="lg:block hidden w-[30%] text-sm">
            <SidebarBox
              title={user.userName}
              element={<>{userExcerpt || badges[0].bio}</>}
            />
            <SidebarBox
              title={`Contact ${userName}`}
              linkStyle="blue"
              array={badges[0].services.map((item) => {
                return {
                  name: item.name,
                  url: item.url,
                  icon: <IoLinkOutline size={20} />,
                  eventName: "ClickQuestionPage",
                };
              })}
            />
          </div>
        </>
      ),
    },
    {
      name: "Bio",
      slug: "bio",
      modal: (
        <SidebarBox
          title={user.userName}
          element={<>{userExcerpt || badges[0].bio}</>}
        />
      ),
    },
    {
      name: "Contact",
      slug: "contact",
      modal: (
        <SidebarBox
          title={`Contact ${userName}`}
          linkStyle="blue"
          array={badges[0].services.map((item) => {
            return {
              name: item.name,
              url: item.url,
              icon: <IoLinkOutline size={20} />,
              eventName: "ClickQuestionPage",
            };
          })}
        />
      ),
    },
    {
      name: (
        <>
          <PiShareFatThin /> Share
        </>
      ),
      slug: "share",

      modal: <SidebarBox title={"Share"} element={<SocialShareButtons />} />,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        title={userName}
        preTitle={"Badger"}
        image={pfp || defaultImages.defaultUserImage}
        location={"user"}
      />
      <SubMenu location={"user"} menu={subMenuArray} />
    </>
  );
}
