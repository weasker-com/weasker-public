import HeroBadge from "@/components/Hero-badge";
import Image from "next/image";
import { Metadata } from "next";
import capitalize from "@/helpers/capitalize";
import { InternalLink } from "@/components/links/InternalLink";
import ExternalLink from "@/components/links/ExternalLink";
import { fetchData } from "@/utils/payloadFetch";
import { badgePageRes, badgeSeoRes } from "../../../../../types/PageRes";
import { defaultImages } from "@/utils/defaultImages";

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
            alt
          }
        }
      }
    }
    BadgeUsers(slug: "${badgeParam}") {
      docs {
        userName
        userBadges{
          services{name url}
          badge{seo{slug}}
        }
        seo {
          slug
          image {
            url
            alt
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
            shortQuestion
            index
            seo{slug image{url}}
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
  const questions = data.data.BadgeQuestions.docs[0].questions;
  const interviewSlug = data.data.BadgeQuestions.docs[0].seo.slug;
  const singularName = badge.singularName;
  const pluralName = badge.pluralName;
  const excerpt = badge.seo.excerpt;
  const badgeImage = badge.seo.image?.url;
  const badgeImageAlt = badge.seo.image?.alt;

  return (
    <>
      <div className="flex flex-col gap-5 sm:gap-10 w-full">
        <HeroBadge
          h1={singularName}
          excerpt={excerpt || `This badge is awarded to ${pluralName}`}
          featuredImageSrc={badgeImage || defaultImages.defaultUserImage}
          featuredImageAlt={badgeImageAlt || `weasker badge: ${singularName}`}
        />
        {users && (
          <>
            <div className="flex flex-col gap-5 sm:w-[70%] sm:mx-auto">
              <h2 className="capitalize">{pluralName}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {users.map((item, index) => {
                  const userImage = item.seo.image?.url;
                  const userName = item.userName;
                  const slug = item.seo.slug;

                  const userBadgeServices = item.userBadges.filter(
                    (item) => item.badge.seo.slug == params.badge
                  );

                  const relevantService = userBadgeServices[0].services[0];
                  const serviceName = relevantService.name;
                  const serviceUrl = relevantService.url;

                  return (
                    <div
                      key={index}
                      className="flex flex-row gap-3 sm:gap-5 items-center"
                    >
                      <InternalLink
                        element={
                          <div className="w-[65px]">
                            <Image
                              width={65}
                              height={65}
                              src={userImage || defaultImages.defaultUserImage}
                              alt={`${userName}, ${singularName}`}
                              className="rounded-full"
                              style={{
                                objectFit: "cover",
                                width: "65px",
                                height: "65px",
                              }}
                            />
                          </div>
                        }
                        target={userName}
                        href={`/user/${slug}`}
                        eventName="ClickUserImage"
                        locationOnPage="experts list"
                      />
                      <div className="flex flex-col">
                        <InternalLink
                          element={userName}
                          target={slug}
                          href={`/user/${slug}`}
                          className="text-base sm:text-xl font-semibold text-tl-dark-blue"
                          eventName="ClickUserName"
                          locationOnPage="main"
                        />
                        <ExternalLink
                          element={
                            <>
                              <div>{singularName}</div>
                              &nbsp;at&nbsp;
                              <span className="text-tl-light-blue">
                                {serviceName}
                              </span>
                            </>
                          }
                          target={serviceName}
                          href={serviceUrl}
                          className="flex flex-row text-tl-dark-blue"
                          eventName="ClickUserService"
                          locationOnPage="main"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
        <div className="flex flex-col gap-5 sm:w-[70%] sm:mx-auto">
          {questions && (
            <>
              <h2 className="capitalize">we asked</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions.map((item, index) => {
                  const question = item.question;
                  const image = question.seo.image?.url;
                  const slug = question.seo.slug;
                  const questionText = question.shortQuestion;

                  return (
                    <InternalLink
                      element={
                        <>
                          <Image
                            width={65}
                            height={65}
                            src={image || defaultImages.defaultQuestionImage}
                            alt={questionText}
                            className="rounded-full"
                            style={{
                              objectFit: "cover",
                              width: "65px",
                              height: "65px",
                            }}
                          />
                          <div className="flex flex-col">
                            <span className="text-tl-dark-blue text-xs font-light">
                              {pluralName}
                            </span>
                            <p>{questionText}</p>
                          </div>
                        </>
                      }
                      href={`/question/${params.badge}/${interviewSlug}/${slug}`}
                      className="flex flex-row gap-3 sm:gap-5 items-center"
                      eventName="ClickQuestionPage"
                      target={questionText}
                      locationOnPage="main"
                    />
                  );
                })}
              </div>{" "}
            </>
          )}
        </div>
      </div>
    </>
  );
}
