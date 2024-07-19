import { fetchData } from "@/utils/payloadFetch";
import { notFound } from "next/navigation";
import { Community, Media, Question, User } from "@/payload/payload-types";
import { ImageAndText } from "@/components/elements/ImageAndText";
import { InternalLink } from "@/components/links/InternalLink";
import Hero from "@/components/Hero";
import { formatDistanceToNow } from "date-fns";
import { badgeIcon } from "@/utils/defaultIcons";

async function getData() {
  const query = `{
  Questions(
    where: { communities: { not_in: ["668815e56280ae52d4d4a79c"] } }
    limit: 1000
  ) {
    docs {
      id
      updatedAt
      upvotesSum
      answersSum
      user {
      image {filename}
        userName
        displayName
      }
      question
      path
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
        path
        id
        image {
          filename
        }
      }
      answers {
        id
      }
    }
  }
}
`;

  const data: {
    data: {
      Questions: { docs: Question[] };
    };
  } | null = await fetchData({
    query,
    method: "POST",
    collection: "Questions",
    cache: true,
    mustHave: ["Questions"],
  });

  if (!data) {
    return null;
  }

  return data;
}

export default async function Home() {
  const data = await getData();

  if (!data) {
    notFound();
  }

  const sortedQuestions = data.data.Questions.docs.sort(
    (a, b) => b.answers.length - a.answers.length
  );

  const communityMap = new Map();

  const curatedQuestions = sortedQuestions.filter((question) => {
    const community = (question.communities[0] as Community).pluralName;
    if (!communityMap.has(community)) {
      communityMap.set(community, true);
      return true;
    }
    return false;
  });

  return (
    <div className="flex flex-col gap-5 w-full max-w-[1000px]">
      <div className="flex flex-col md:flex-col w-full">
        <div className="text-center w-full">
          <h1 className="text-[40px] md:text-[85px] leading-[3rem] md:leading-[6rem] font-black mb-10">
            Ask{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              The Right Community
            </span>{" "}
            to Answer Your Question
          </h1>
        </div>
      </div>
      <div className="flex flex-col gap-5 w-full">
        {curatedQuestions.map((item, index) => {
          const questionObject = item;
          return (
            <Hero
              key={index}
              title={
                <ImageAndText
                  image={
                    ((questionObject.user as User).image as Media).filename
                  }
                  alt={`image of ${(questionObject.user as User).userName}`}
                  title={
                    <InternalLink
                      href={`/question/${questionObject.path}`}
                      element={
                        <h2 className="text-base md:text-5xl hover:text-tl-light-blue">
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
        })}
      </div>
    </div>
  );
}
