import { fetchData } from "@/utils/payloadFetch";
import { Metadata } from "next";
import capitalize from "@/helpers/capitalize";
import { notFound } from "next/navigation";
import {
  Answer as AnswerType,
  Community,
  Media,
  Question as QuestionType,
  User,
} from "@/payload/payload-types";
import { defaultImages } from "@/utils/defaultImages";
import { QAPage, WithContext } from "schema-dts";
import Hero from "@/components/Hero";
import { InternalLink } from "@/components/links/InternalLink";
import { ImageAndText } from "@/components/elements/ImageAndText";
import { WideBox } from "@/components/ui/boxes";
import { formatDistanceToNow } from "date-fns";
import Answer from "@/components/Answer";
import ShareButton from "@/components/ShareButton";
import ContactButton from "@/components/ContactButton";
import { toSentence } from "@/helpers/toSentence";
import { badgeIcon } from "@/utils/defaultIcons";
const { convert } = require("html-to-text");

type Props = {
  params: { id: string; communities: string; questionText: string };
};

interface LinkObject {
  [key: string]: string | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = `{
  Question(id: "${params.id}") {
      id
      path
      createdAt
      updatedAt
      answersSum
      upvotesSum
      description
      user {
      path
      image {
      url
          filename
        }
        userName
        displayName
      }
      question
      description
      images {
        image {
          filename
        }
      }
      video {
        filename
      }
      communities {
        pluralName
        image {
          filename
        }
      }
      answers {
        id
      }
  }
}
`;

  const data: {
    data: {
      Question: QuestionType;
    };
  } | null = await fetchData({
    query,
    method: "POST",
    collection: "Question",
    mustHave: ["Question"],
  });

  if (!data) {
    return {};
  }

  const questionObject = data.data.Question;

  const metaTitle =
    questionObject.answers.length > 1
      ? capitalize(
          `${questionObject.question} | ${questionObject.answers.length} Answers`
        )
      : capitalize(questionObject.question);

  const metaDescription = questionObject.description;

  const communitySingularNamesArray = questionObject.communities.map(
    (item: Community) => {
      return item.pluralName;
    }
  );

  const communitySingularNames = toSentence(communitySingularNamesArray);

  const ogMeta = `${formatDistanceToNow(questionObject.updatedAt, {
    addSuffix: true,
  })}   •   ${questionObject.answersSum} Answers   •   ${
    questionObject.upvotesSum
  } Upvotes`;

  const ogImage = `${process.env.SITE_URL}/api/og/question?title=${
    questionObject.question
  }&img=${((questionObject.user as User).image as Media).url}&description=${
    questionObject.description
  }&preTitle=${communitySingularNames}&meta=${ogMeta}`;

  const authors = {
    name:
      (questionObject.user as User).displayName ||
      (questionObject.user as User).userName,
    url: `https://www.weasker/user/${(questionObject.user as User).path}`,
  };

  return {
    title: metaTitle,
    description: metaDescription,
    authors: authors,
    openGraph: {
      images: [ogImage],
      type: "website",
      url: `https://www.weasker.com/question/${questionObject.path}`,
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

async function getData(id: string) {
  const query = `{
  Question(id: "${id}") {
      id
      updatedAt
      createdAt
      path
      upvotesSum
      questionSlug
      communitiesSlug
      user {
      slug
      path
      image {
          filename
          url
        }
      communities {
      id
      }
        userName
        displayName
         seo{
          slug
          image {url filename}
        }
      }
      question
      description
      images {
        image {
          filename
        }
      }
      video {
        filename
      }
      communities {
      id
      slug
      questions{
        upvotesSum
          question
          answersSum
          path
        }
        pluralName
        singularName
        path
        image {
          filename
        }
      }
      answers {
        id
        upvotesSum
        updatedAt
        createdAt
        user{
        path
        slug
        image{url filename}
          communities {
          community {
          id 
          pluralName 
          path
          }
          links {
            linkOne
            linkTwo
            linkThree
            linkFour
            linkFive
          }}
          displayName
          userName
          seo{slug image{url filename}}
        }
        textAnswer
        video{url filename}
        images{image{url filename}}
      }
  }
}
`;

  const data: {
    data: {
      Question: QuestionType;
    };
  } | null = await fetchData({
    query,
    method: "POST",
    collection: "Question",
    mustHave: ["Question"],
  });

  if (!data) {
    return null;
  }

  return data;
}

export default async function Question({ params }: Props) {
  const data = await getData(params.id);

  if (!data) {
    notFound();
  }

  const getAnswerPriority = (answer: AnswerType) => {
    if (!answer) {
      return Infinity;
    }

    const hasVideo = answer.video != null;
    const hasImages = answer.images != null && answer.images.length > 0;
    const textLength = answer.textAnswer?.length ?? 0;

    if (hasVideo && hasImages) return 1;
    if (hasVideo) return 2;
    if (hasImages) return 3;
    return 1000 - textLength;
  };

  const questionObject = data.data.Question;

  const getUserRelevantCommunities = (
    userCommunities: { community: Community }[]
  ) => {
    const questionCommunities = questionObject.communities as Community[];
    const intersection = questionCommunities.filter((questionComm) =>
      userCommunities.some(
        (userComm) => userComm.community.id === questionComm.id
      )
    );

    return intersection;
  };

  const sortedAnswers = questionObject.answers.sort((a, b) => {
    const priorityA = getAnswerPriority(a as AnswerType);
    const priorityB = getAnswerPriority(b as AnswerType);
    return priorityA - priorityB;
  });

  const jsonLd: WithContext<QAPage> = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      author: {
        "@type": "Person",
        name: (questionObject.user as User).userName,
        url: `https://www.weasker.com/user/${
          (questionObject.user as User).path
        }`,
      },
      datePublished: questionObject.createdAt,
      dateModified: questionObject.updatedAt,
      name: questionObject.question,
      text: questionObject.description,
      answerCount: questionObject.answers.length,
      upvoteCount: questionObject.upvotesSum,
      suggestedAnswer: sortedAnswers.map((item) => {
        return {
          "@type": "Answer",
          text: convert((item as AnswerType).textAnswer),
          url: `https://www.weasker.com/question/${questionObject.path}#${
            ((item as AnswerType).user as User).slug
          }`,
          author: {
            "@type": "Person",
            name:
              ((item as AnswerType).user as User).displayName ||
              ((item as AnswerType).user as User).userName,
            url: `https://www.weasker.com/user/${
              ((item as AnswerType).user as User).path
            }`,
          },
          datePublished: (item as AnswerType).createdAt,
          dateModified: (item as AnswerType).updatedAt,
          upvoteCount: (item as AnswerType).upvotesSum,
        };
      }),
    },
  };

  const getRelevantLinks = (
    user: User,
    questionCommunities: Community[]
  ): LinkObject => {
    const userCommunities = user.communities || [];
    const relevantLinks: LinkObject = {};

    userCommunities
      .filter((userComm) =>
        questionCommunities.some(
          (questionComm) =>
            questionComm.id === (userComm.community as Community).id
        )
      )
      .forEach((userComm) => {
        const links = userComm.links || {};
        Object.entries(links).forEach(([key, url]) => {
          if (url) {
            relevantLinks[key] = url;
          }
        });
      });

    return relevantLinks;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        title={
          <ImageAndText
            image={((questionObject.user as User).image as Media).filename}
            alt={`image of ${(questionObject.user as User).userName}`}
            title={
              <h1 className="text-base md:text-4xl">
                {questionObject.question}
              </h1>
            }
            imageClassName="w-11 h-11"
            preTitle={
              <div
                className={`flex flex-row gap-2 flex-wrap text-xs font-normal sm:text-sm sm:font-medium text-weasker-grey`}
              >
                {questionObject.communities.map((item: Community, index) => {
                  return (
                    <InternalLink
                      key={index}
                      href={`/community/${item.path}`}
                      element={
                        <span className="flex flex-row gap-1 items-center hover:text-tl-light-blue">
                          {badgeIcon(15)} {item.pluralName}
                        </span>
                      }
                    />
                  );
                })}
                &nbsp;
              </div>
            }
          />
        }
        longTitle={true}
        about={
          <div className="flex flex-col gap-2 md:ml-14">
            <div className="text-sm font-normal">
              {questionObject.description}
            </div>
            <div className="text-xs sm:text-sm mt-5 flex flex-row justify-around sm:justify-start sm:gap-7">
              <span>
                {formatDistanceToNow(questionObject.updatedAt, {
                  addSuffix: true,
                })}
              </span>

              <span className="flex flex-row">
                {questionObject.answers.length} answers
              </span>
              <span className="flex flex-row">
                {questionObject.upvotesSum} upvotes
              </span>

              <ShareButton />
            </div>
          </div>
        }
      />
      <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2 w-full">
        <div className="lg:w-[70%] flex flex-col gap-3">
          {questionObject.answers && questionObject.answers.length > 0 ? (
            sortedAnswers.map((item: AnswerType, index) => {
              const user = item.user as User;

              const userCommunities = (user as User).communities.map(
                (userComm: { community: Community }) => ({
                  community: userComm.community as Community,
                })
              );

              const relevantLinks = getRelevantLinks(
                user,
                (questionObject.communities as Community[]) || []
              );

              return (
                <WideBox
                  className="p-5"
                  key={index}
                  id={(item.user as User).slug}
                >
                  <div className="flex flex-col gap-5 w-full">
                    <ImageAndText
                      alt={`${
                        (item.user as User).displayName ||
                        (item.user as User).userName
                      }
                      }`}
                      preTitle={
                        <InternalLink
                          className="hover:underline max-w-max"
                          href={`/user/${(item.user as User).path}`}
                          element={
                            <h2 className="text-base font-normal">
                              {(item.user as User).displayName ||
                                (item.user as User).userName}
                              &nbsp;
                            </h2>
                          }
                        />
                      }
                      title={
                        <span className="flex flex-row gap-1 text-xs">
                          {getUserRelevantCommunities(userCommunities).map(
                            (item, index) => {
                              return (
                                <InternalLink
                                  key={index}
                                  className="hover:underline underline-offset-4 decoration-inherit decoration-1 hover:text-tl-light-blue"
                                  href={`/community/${item.path}`}
                                  element={
                                    <div className="flex flex-row gap-1 items-center hover:text-tl-light-blue">
                                      {badgeIcon(15)}
                                      {item.singularName}
                                    </div>
                                  }
                                />
                              );
                            }
                          )}{" "}
                          &#8226;{" "}
                          <span className="text-tl-light-blue hover:underline underline-offset-4 decoration-inherit decoration-1">
                            <ContactButton
                              user={user}
                              userName={user.displayName || user.userName}
                              links={relevantLinks}
                            />
                          </span>
                        </span>
                      }
                      image={((item.user as User).image as Media)?.filename}
                      defaultImage={defaultImages.defaultUserImage}
                      imageClassName="w-11 h-11"
                    />
                    <Answer
                      answer={item}
                      alt={`Image uploaded by ${
                        (item.user as User).userName
                      } for the question: ${questionObject.question}`}
                    />
                    <div className="flex flex-row text-sm gap-10 sm:px-5">
                      {item.updatedAt &&
                        formatDistanceToNow(item.updatedAt, {
                          addSuffix: true,
                        })}{" "}
                      <span className="">{item.upvotesSum} upvotes</span>
                    </div>
                  </div>
                </WideBox>
              );
            })
          ) : (
            <WideBox className="p-3 sm:p-5">
              <span>Looks like no one answered this questions yet.</span>
            </WideBox>
          )}
        </div>

        <div className="flex flex-col gap-2 sticky z-10 top-2 pb-5 h-max max-h-screen sm:w-[30%] overflow-y-scroll">
          <WideBox className="p-3 sm:p-5">
            <div className="flex flex-col gap-5">
              <ul className="flex flex-row flex-wrap gap-1 text-sm">
                {questionObject.answers.map((item: AnswerType, index) => {
                  const user = item.user as User;
                  return (
                    <li key={index} className="">
                      <InternalLink
                        href={`#${user.slug}`}
                        element={
                          <ImageAndText
                            imageClassName="w-11"
                            image={
                              (user.image as Media)?.url ||
                              defaultImages.defaultUserImage
                            }
                            alt={`View answer by ${
                              user.displayName || user.userName
                            }`}
                          />
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </WideBox>
          <WideBox>
            <div className="flex flex-col gap-3 p-5">
              {questionObject.communities.map((community: Community, index) => (
                <ul key={index} className="flex flex-col text-sm">
                  {community.questions.map((item: QuestionType, index) => (
                    <li
                      key={index}
                      className="flex flex-col gap-1 border-b py-1"
                    >
                      <InternalLink
                        href={`/question/${item.path}`}
                        element={
                          <>
                            <span className="font-bold">{item.question}</span>
                            <div className="flex flex-row gap-2">
                              <span>{item.answersSum} answers</span>
                              <span>{item.upvotesSum} upvotes</span>
                            </div>
                          </>
                        }
                        style="blue-hover"
                      />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </WideBox>
        </div>
      </div>
    </>
  );
}
