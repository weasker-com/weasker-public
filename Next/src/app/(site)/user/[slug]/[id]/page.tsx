import { fetchData } from "@/utils/payloadFetch";
import { Metadata } from "next";
import capitalize from "@/helpers/capitalize";
import { notFound } from "next/navigation";
import {
  Answer as AnswerType,
  Community,
  Media,
  Question,
  User,
} from "@/payload/payload-types";
import { defaultImages } from "@/utils/defaultImages";
import Hero from "@/components/Hero";
import { InternalLink } from "@/components/links/InternalLink";
import { ImageAndText } from "@/components/elements/ImageAndText";
import { formatDistanceToNow } from "date-fns";
import ShareButton from "@/components/ShareButton";
import { WideBox } from "@/components/ui/boxes";
import { toSentence } from "@/helpers/toSentence";
import Answer from "@/components/Answer";
import ContactButton from "@/components/ContactButton";
import { ProfilePage, WithContext } from "schema-dts";

type Props = {
  params: { id: string; slug: string };
};

interface LinkObject {
  [key: string]: string | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = `{
  User(id: "${params.id}"){
    id
    bio
    slug
    path
    bio
    communityCount
    answerCount
    questionCount
    displayName
    userName
    image {
      filename
      url
    }
    communities {
      community {
        singularName
        pluralName
      }
    }
  }
}`;

  const data: {
    data: {
      User: User;
    };
  } | null = await fetchData({
    query,
    method: "POST",
    collection: "User",
    mustHave: ["User"],
  });

  if (!data) {
    return {};
  }

  const userObject = data.data.User as User;

  const userName = userObject.displayName || userObject.userName;

  const communitySingularNamesArray = userObject.communities.map((item) => {
    return (item.community as Community).singularName;
  });

  const communitySingularNames = toSentence(communitySingularNamesArray);

  const metaTitle = capitalize(`${userName} | ${communitySingularNames}`);

  const metaDescription =
    userObject.bio ||
    `${userName} is a ${communitySingularNames}. Click here to see their questions and answers.`;

  const ogMeta = `${userObject.communityCount} Communities • ${userObject.answerCount} Answers • ${userObject.questionCount} Questions`;

  const ogImage = `${process.env.SITE_URL}/api/og/user?img=${
    (userObject.image as Media).url
  }&preTitle=${communitySingularNames}&title=${userName}&description=${
    userObject.bio
  }&meta=${ogMeta}`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      images: [ogImage],
      type: "website",
      url: `https://www.weasker.com/user/${userObject.path}`,
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
          User(id: "${id}"){
          id
          slug
          bio
          path
          communityCount
          questionCount
          answerCount
          displayName
          userName
          image {
            filename
            url
          }
          communities {
             links{
        linkOne
        linkTwo
        linkThree
        linkFour
        linkFive
      }
            community {
            path
            image{filename url}
              singularName
              pluralName
            }
          }
          questions{
          id 
          question 
          description 
          updatedAt 
          createdAt
          upvotesSum 
          answersSum 
          path 
          communities{pluralName path}}
              answers {
        question{
        description
        user {image{url filename}}
        updatedAt
        createdAt
        question 
        upvotesSum
        answers{id}
        path
        }
        id
        updatedAt
        createdAt
        upvotesSum
        user{
          communities{community{id}   links {
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
      }`;

  const data: {
    data: {
      User: User;
    };
  } | null = await fetchData({
    query,
    method: "POST",
    collection: "User",
    mustHave: ["User"],
  });

  if (!data) {
    return null;
  }

  return data;
}

export default async function UserPage({ params }: Props) {
  const data = await getData(params.id);

  if (!data) {
    notFound();
  }

  const userObject = data.data.User;

  const userName = data.data.User.displayName || data.data.User.userName;
  const userCommunitiesSingularNamesArray = userObject.communities.map(
    (item) => {
      return (item.community as Community).singularName;
    }
  );

  const jsonLd: WithContext<ProfilePage> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: userName,
      jobTitle: userCommunitiesSingularNamesArray,
      image: (userObject.image as Media).url || defaultImages.defaultUserImage,
      url: `https://www.weasker.com/usernew/${userObject.path}`,
    },
  };

  const userLinks = (): LinkObject => {
    const relevantLinks: LinkObject = {};
    userObject.communities.forEach((userComm) => {
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
      <>
        <Hero
          title={
            <ImageAndText
              image={
                (userObject.image as Media)?.filename ||
                defaultImages.defaultUserImage
              }
              alt={`Featured image of user ${userName}`}
              preTitle={
                <div
                  className={`text-xs font-normal sm:text-sm sm:font-medium text-weasker-grey`}
                >
                  User &nbsp;
                </div>
              }
              title={
                <div>
                  <h1 className="text-base md:text-5xl">{userName}</h1>{" "}
                  <div className="text-xs sm:text-base font-normal underline">
                    <ContactButton
                      userName={userName}
                      user={userObject}
                      links={userLinks()}
                    />
                  </div>
                </div>
              }
              imageClassName="w-11 h-11"
            />
          }
          longTitle={true}
          about={
            <div className="flex flex-col gap-2 md:ml-14">
              <div className="text-sm font-normal">{userObject.bio}</div>
              <div className="text-xs sm:text-sm mt-5 flex flex-row justify-around flex-wrap sm:justify-start sm:gap-7">
                <span className="flex flex-row">
                  {userObject.questionCount} questions
                </span>
                <span className="flex flex-row">
                  {userObject.communityCount} communities
                </span>
                <span className="flex flex-row">
                  {userObject.answerCount} answers
                </span>
                <ShareButton />
              </div>
            </div>
          }
        />
        <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2 w-full">
          <div className="lg:w-[70%] flex flex-col gap-2">
            <div className="flex flex-col gap-5 w-full">
              {userObject.answerCount < 1 ? (
                <WideBox className="p-3 sm:p-5">
                  <div>This user answered no questions yet</div>
                </WideBox>
              ) : (
                userObject.answers.map((item: AnswerType, index) => {
                  const questionObject = item.question as Question;

                  return (
                    <WideBox className="p-5 w-full" key={index}>
                      <div className="flex flex-col gap-5 w-full">
                        <div className="flex flex-col gap-5 w-full pb-5 sm:pt-5  border-b">
                          <InternalLink
                            href={`/question/${questionObject.path}`}
                            style="blue-hover"
                            element={
                              <ImageAndText
                                title={
                                  <h2 className="text-xl">
                                    {questionObject.question}
                                  </h2>
                                }
                                alt={""}
                                image={
                                  ((questionObject.user as User).image as Media)
                                    .filename
                                }
                                imageClassName="w-11 h-11"
                              />
                            }
                          />

                          <div className="flex flex-col gap-2 sm:ml-11">
                            <div className="text-sm font-normal">
                              {questionObject.description}
                            </div>
                            <div className="text-xs sm:text-sm mt-5 flex flex-row justify-around sm:justify-start sm:gap-7">
                              <span>
                                {formatDistanceToNow(questionObject.updatedAt, {
                                  addSuffix: true,
                                })}
                              </span>
                              <InternalLink
                                href={`/question/${questionObject.path}`}
                                style="blue-hover"
                                element={
                                  <span className="flex flex-row">
                                    {questionObject.answers.length} answers
                                  </span>
                                }
                              />

                              <span className="flex flex-row">
                                {questionObject.upvotesSum} upvotes
                              </span>
                            </div>
                          </div>
                        </div>

                        <ImageAndText
                          alt={`${
                            (item.user as User).displayName ||
                            (item.user as User).userName
                          }
                      }`}
                          preTitle={
                            <div className="flex flex-row gap-1 content-center font-normal text-base">
                              <span className="">
                                {(item.user as User).displayName ||
                                  (item.user as User).userName}
                                &nbsp;
                              </span>
                              &#8226;
                              <div className="text-xs underline self-center">
                                <ContactButton
                                  userName={
                                    userObject.displayName ||
                                    userObject.userName
                                  }
                                  user={userObject}
                                  links={userLinks()}
                                />
                              </div>
                            </div>
                          }
                          image={
                            (userObject.image as Media)?.filename ||
                            defaultImages.defaultUserImage
                          }
                          defaultImage={defaultImages.defaultUserImage}
                          imageClassName="w-11 h-11"
                        />
                        <Answer
                          key={index}
                          answer={item}
                          alt={`Image uploaded by ${
                            (item.user as User).userName
                          } for the question: ${
                            (item.question as Question).question
                          }`}
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
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 sticky z-10 top-2 pb-5 h-max max-h-screen sm:w-[30%] overflow-y-scroll">
            <WideBox className="p-3 sm:p-5">
              <span className="font-bold">Communities</span>
              {userObject.communityCount < 1 ? (
                <div>This user joined no communities yet</div>
              ) : (
                <div className="flex flex-col gap-5">
                  <ul className="flex flex-row flex-wrap gap-1 text-sm">
                    {userObject.communities.map((item, index) => {
                      const community = item.community as Community;
                      return (
                        <li key={index} className="">
                          <InternalLink
                            style="blue-hover"
                            href={`/community/${community.path}`}
                            element={
                              <ImageAndText
                                title={
                                  <span className="font-bold">
                                    {community.pluralName}
                                  </span>
                                }
                                imageClassName="w-11"
                                image={
                                  (community.image as Media)?.url ||
                                  defaultImages.defaultUserImage
                                }
                                alt={`View answer by ${community.pluralName}`}
                              />
                            }
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </WideBox>
            <WideBox className="p-3 sm:p-5">
              <div className="flex flex-col gap-5">
                <span className="font-bold">Questions</span>
                {userObject.questionCount < 1 ? (
                  <span className="">This user asked no questions yet</span>
                ) : (
                  <ul>
                    {userObject.questions.map((item: Question, index) => {
                      const questionObject = item;
                      return (
                        <InternalLink
                          key={index}
                          style={"blue-hover"}
                          href={`/question/${questionObject.path}`}
                          element={
                            <li>
                              <div className="flex flex-col gap-1 border-b py-3">
                                <div className="text-sm flex flex-row gap-2">
                                  {item.communities.map(
                                    (item: Community, index) => {
                                      return (
                                        <div key={index}>{item.pluralName}</div>
                                      );
                                    }
                                  )}
                                </div>
                                <span className="font-bold">
                                  {item.question}
                                </span>
                                <div className="text-xs flex flex-row justify-between">
                                  <span>
                                    {formatDistanceToNow(item.createdAt, {
                                      addSuffix: true,
                                    })}
                                  </span>
                                  <span>{item.answersSum} answers</span>
                                  <span>{item.upvotesSum} upvotes</span>
                                </div>
                              </div>
                            </li>
                          }
                        />
                      );
                    })}
                  </ul>
                )}
              </div>
            </WideBox>
          </div>
        </div>
      </>
    </>
  );
}
