import { fetchData } from "@/utils/payloadFetch";
import { Metadata } from "next";
import capitalize from "@/helpers/capitalize";
import { notFound } from "next/navigation";
import { Community, Media, Question, User } from "@/payload/payload-types";
import { defaultImages } from "@/utils/defaultImages";
import Hero from "@/components/Hero";
import { InternalLink } from "@/components/links/InternalLink";
import { ImageAndText } from "@/components/elements/ImageAndText";
import { formatDistanceToNow } from "date-fns";
import ShareButton from "@/components/ShareButton";
import { WideBox } from "@/components/ui/boxes";
import { badgeIcon } from "@/utils/defaultIcons";

type Props = {
  params: { id: string; slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = `{
  Community(id: "${params.id}"){
    id
    image{ filename url}
    createdAt
    terms
    questionCount
    userCount
    singularName
    pluralName
    users{id}
    questions{id}
  }
}`;

  const data: {
    data: {
      Community: Community;
    };
  } | null = await fetchData({
    query,
    method: "POST",
    collection: "Community",
    mustHave: ["Community"],
  });

  if (!data) {
    return {};
  }

  const communityObject = data.data.Community as Community;

  const metaTitle =
    communityObject.users.length > 1
      ? capitalize(
          `${communityObject.pluralName} | ${communityObject.questions.length} Questions`
        )
      : capitalize(communityObject.pluralName);

  const metaDescription = `The ${communityObject.pluralName} community has ${communityObject.users.length} Members. Click here to view their answers and ask them questions`;

  const ogMeta = `${communityObject.questionCount} Questions • ${communityObject.userCount} Users`;

  const ogImage = `${process.env.SITE_URL}/api/og/community?img=${
    (communityObject.image as Media)?.url || defaultImages.defaultQuestionImage
  }&title=${communityObject.pluralName}&preTitle=Community&description=${
    communityObject.description
  }&meta=${ogMeta}`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      images: [ogImage],
      type: "website",
      url: `https://www.weasker.com/community/${params.slug}/${params.id}`,
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
        Community(id: "${id}"){
           id
    image {
      filename
      url
    }
    createdAt
    singularName
    description
    pluralName
    users {
    slug
      id
      image {
        filename
        url
      }
    }
    questions {
      id
      path
      question
      communities{path pluralName}
      updatedAt
      answersSum
      upvotesSum
      description
      user{
        image{filename}
userName
      }
    }
          terms
        }
      }`;

  const data: {
    data: {
      Community: Community;
    };
  } | null = await fetchData({
    query,
    method: "POST",
    collection: "Community",
    mustHave: ["Community"],
  });

  if (!data) {
    return null;
  }

  return data;
}

export default async function CommunityPage({ params }: Props) {
  const data = await getData(params.id);

  if (!data) {
    notFound();
  }

  const communityObject = data.data.Community;

  return (
    <>
      <Hero
        title={
          <ImageAndText
            image={(communityObject.image as Media).filename}
            alt={`Featured image of the ${communityObject.pluralName} community`}
            preTitle={
              <div
                className={`text-xs font-normal sm:text-sm sm:font-medium text-weasker-grey`}
              >
                Community &nbsp;
              </div>
            }
            title={
              <h1 className="text-base md:text-5xl">
                {communityObject.pluralName}
              </h1>
            }
            imageClassName="w-11 h-11"
          />
        }
        longTitle={true}
        about={
          <div className="flex flex-col gap-2 md:ml-14">
            <div className="text-sm font-normal">
              {communityObject.description}
            </div>
            <div className="text-sm font-normal">{communityObject.terms}</div>
            <div className="text-xs sm:text-sm mt-5 flex flex-row flex-wrap gap-3 sm:justify-start sm:gap-7">
              <span className="flex flex-row">
                {communityObject.questions.length} questions
              </span>
              <span className="flex flex-row">
                {communityObject.users.length} users
              </span>

              <ShareButton />
            </div>
          </div>
        }
      />
      <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2 w-full">
        <div className="lg:w-[70%] flex flex-col gap-2">
          <div className="flex flex-col gap-1 w-full">
            {communityObject.questionCount < 1 ? (
              <WideBox className="p-3 sm:p-5">
                <div>This community has no questions yet</div>
              </WideBox>
            ) : (
              communityObject.questions.map((item: Question, index) => {
                const questionObject = item;
                return (
                  <Hero
                    key={index}
                    title={
                      <ImageAndText
                        image={
                          ((questionObject.user as User).image as Media)
                            .filename
                        }
                        alt={`image of ${
                          (questionObject.user as User).userName
                        }`}
                        title={
                          <InternalLink
                            href={`/question/${questionObject.path}`}
                            element={
                              <h2 className="text-base md:text-3xl hover:text-tl-light-blue">
                                {questionObject.question}
                              </h2>
                            }
                          />
                        }
                        imageClassName="w-11 h-11"
                        preTitle={
                          <div
                            className={`flex flex-row gap-2 flex-wrap text-xs font-normal sm:text-sm sm:font-medium text-weasker-grey`}
                          >
                            {questionObject.communities.map(
                              (item: Community, index) => {
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
                              }
                            )}
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
                          <InternalLink
                            href={`/question/${questionObject.path}`}
                            element={
                              <span className="flex flex-row hover:text-tl-light-blue">
                                {questionObject.answersSum} answers
                              </span>
                            }
                          />
                          <span className="flex flex-row">
                            {questionObject.upvotesSum} upvotes
                          </span>
                        </div>
                      </div>
                    }
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 sticky z-10 top-2 pb-5 h-max max-h-screen sm:w-[30%] overflow-y-scroll">
          <WideBox className="p-3 sm:p-5">
            <div className="flex flex-col gap-5">
              <span className="font-bold">Community Members</span>
              <ul className="flex flex-row flex-wrap gap-1 text-sm">
                {communityObject.users.map((user: User, index) => {
                  return (
                    <li key={index} className="">
                      <InternalLink
                        href={`/user/${user.slug}/${user.id}`}
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
        </div>
      </div>
    </>
  );
}
