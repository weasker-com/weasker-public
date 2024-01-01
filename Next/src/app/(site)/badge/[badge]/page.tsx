import { Metadata } from "next";
import capitalize from "@/helpers/capitalize";
import { fetchData } from "@/utils/payloadFetch";
import { badgePageRes, badgeSeoRes } from "../../../../../types/Responses";
import { defaultImages } from "@/utils/defaultImages";
import Hero from "@/components/Hero";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import SidebarBox from "@/components/SidebarBox";
import { PiUsersThreeLight } from "react-icons/pi";
import SubMenu from "@/components/SubMenu";
import ListItem from "@/components/ListItem";
import { InternalLink } from "@/components/links/InternalLink";
import { LiaUserCheckSolid } from "react-icons/lia";
import ExternalLink from "@/components/links/ExternalLink";
import { HiOutlineExternalLink } from "react-icons/hi";
import SocialShareButtons from "@/components/SocialShareButtons";
import { PiShareFatThin } from "react-icons/pi";
import { TbMessages } from "react-icons/tb";

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

  const data: badgeSeoRes | null = await fetchData(query, "POST", "Badges");

  if (!data) {
    return {};
  }

  const seoMeta = data.data.Badges.docs[0];
  const singularName = seoMeta.singularName;
  const pluralName = seoMeta.pluralName;
  const usersAmount = data.data.BadgeUsers.docs.length;
  const image = seoMeta.seo.image;
  const seoTitle = seoMeta.seo.title;
  const seoDescription = seoMeta.seo.description;

  const metaTitle = capitalize(
    seoTitle ? seoTitle : `We interviewed the ${usersAmount} best ${pluralName}`
  );

  const metaDescription = seoDescription
    ? seoDescription
    : `We interviewed ${usersAmount} of the best ${pluralName}, read what each ${singularName} had to say.`;

  const ogImage = defaultImages.defaultOgImage;
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
        seo{slug}
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

  const data: badgePageRes | null = await fetchData(query, "POST", "Badges");

  if (!data) {
    return null;
  }

  return data;
}

export default async function Badge({ params }: Props) {
  const data = await getData(params.badge);

  if (!data) {
    return "no data";
  }

  const badge = data.data.Badges.docs[0];
  const users = data.data.BadgeUsers.docs;
  const questions = data.data.BadgeQuestions.docs[0]?.questions;
  const interviewSlug = data.data.BadgeQuestions.docs[0]?.seo.slug;
  const singularName = badge.singularName;
  const pluralName = badge.pluralName;
  const excerpt = badge.seo.excerpt;
  const badgeImage = badge.seo.image?.url || null;

  const subMenuArray = [
    {
      name: (
        <>
          <MdOutlineFormatListBulleted /> Questions
        </>
      ),
      slug: "questions",
      tab: (
        <>
          <div className="lg:w-[70%] flex flex-col">
            {questions.map((question) => {
              return (
                <ListItem
                  location={"badge"}
                  name={question.question.shortQuestion}
                  preTitle={"Question"}
                  slugs={`/question/${params.badge}/${interviewSlug}/${question.question.seo.slug}`}
                  image={
                    question.question.seo.image?.filename ||
                    defaultImages.defaultQuestionImage
                  }
                  excerpt={question.question.longQuestion}
                  links={[
                    <InternalLink
                      element={
                        <div className="flex flex-row gap-1 items-center">
                          <TbMessages />
                          <>{`${question.question.answers.length} answers`}</>
                        </div>
                      }
                      style={"blue"}
                      href={`/question/${params.badge}/${interviewSlug}/${question.question.seo.slug}`}
                      eventName={"ClickUserName"}
                      target={question.question.shortQuestion}
                      locationOnPage={"list item"}
                    />,
                  ]}
                />
              );
            })}
          </div>
          <div className="lg:block hidden w-[30%] text-sm">
            <SidebarBox
              title={"Badge terms"}
              element={<>{badge.seo.excerpt}</>}
            />
            <SidebarBox
              title={`Top ${pluralName}`}
              array={users.map((item) => {
                return {
                  name: item.userName,
                  url: `/user/${item.seo.slug}`,
                  image:
                    item.seo.image?.filename || defaultImages.defaultUserImage,
                  eventName: "ClickUserName",
                };
              })}
              itemsAmount={8}
            />
          </div>
        </>
      ),
    },
    {
      name: (
        <>
          <PiUsersThreeLight /> Users
        </>
      ),

      slug: "users",
      tab: (
        <>
          <div className="lg:w-[70%] flex flex-col">
            {users.map((item) => {
              const relevantBadge = item.userBadges.filter(
                (item) => item.badge.seo.slug == params.badge
              )[0];
              return (
                <ListItem
                  location={"badge"}
                  name={item.userName}
                  preTitle={"User"}
                  slugs={`/user/${item.seo.slug}`}
                  image={
                    item.seo.image?.filename || defaultImages.defaultUserImage
                  }
                  excerpt={relevantBadge.bio}
                  links={[
                    <InternalLink
                      element={
                        <div className="flex flex-row gap-1 items-center">
                          <LiaUserCheckSolid /> <>Badger page</>
                        </div>
                      }
                      style={"blue"}
                      href={`/user/${item.seo.slug}`}
                      eventName={"ClickUserName"}
                      target={item.userName}
                      locationOnPage={"list item"}
                    />,
                  ].concat(
                    relevantBadge.services.map((item) => {
                      return (
                        <ExternalLink
                          element={
                            <div className="flex flex-row gap-1 items-center">
                              <HiOutlineExternalLink /> <>{item.name}</>
                            </div>
                          }
                          style={"blue"}
                          href={item.url}
                          eventName={"ClickUserService"}
                          target={item.name}
                          locationOnPage={"list item"}
                        />
                      );
                    })
                  )}
                />
              );
            })}
          </div>
          <div className="lg:block hidden w-[30%] text-sm">
            <SidebarBox
              title={"Badge terms"}
              element={<>{badge.seo.excerpt}</>}
            />
            <SidebarBox
              title={`Questions for ${badge.pluralName}`}
              array={questions.map((item) => {
                return {
                  name: item.question.shortQuestion,
                  url: `/question/${params.badge}/${interviewSlug}/${item.question.seo.slug}`,
                  image:
                    item.question.seo.image?.filename ||
                    defaultImages.defaultUserImage,
                  eventName: "ClickUserName",
                };
              })}
              itemsAmount={8}
            />
          </div>
        </>
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
      <div className="flex flex-col w-full">
        <Hero
          title={singularName}
          preTitle={"Badge"}
          image={badgeImage}
          location={"badge"}
        />
        <SubMenu menu={subMenuArray} location={"badge"} />
      </div>
    </>
  );
}
