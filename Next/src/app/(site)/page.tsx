import { fetchData } from "@/utils/payloadFetch";
import Answer from "@/components/Answer";
import Image from "next/image";
import { defaultImages } from "@/utils/defaultImages";
import { InternalLink } from "@/components/links/InternalLink";
import { homePageRes } from "../../../types/PageRes";

async function getData() {
  const query = `{
        Interviews {
          docs {
            seo {
              slug
            }
            badge {
              singularName
              pluralName
              seo {
                slug
                image{url}
              }
            }
            questions {
              question {
                shortQuestion
                seo {
                  slug
                }
                answers {
                  user {
                    seo{image{url}}
                    userName
                    seo {
                      slug
                    }
                  }
                  answer{richText_html video{url} images{image {url}}}
                }
              }
            }
          }
        }
        Badges {
          docs {
            pluralName
            singularName
            seo{slug image{url}}
          }
        }
        Users(where: { roles: { equals: endUser } }){
          docs{
            userName
            seo{slug image{url}}
          }
        }
      }
      `;

  const data: homePageRes | null = await fetchData(query, "POST", "Interviews");

  if (!data) {
    return null;
  }

  return data;
}

export default async function Home() {
  const data = await getData();

  if (!data) return "Internal server error";

  const interviews = data.data.Interviews.docs;
  const maxQuestions = Math.max(
    ...interviews.map((interview) => interview.questions.length)
  );

  interface curatedAnswers {
    user: {
      userName: string;
      seo: {
        slug: string;
        image: {
          url: string;
        };
      };
    };
    answer: {
      richText_html: string;
      video: {
        url: string;
      };
      images: {
        image: {
          url: string;
        };
      }[];
    };

    interview: {
      seo: {
        slug: string;
      };
      badge: {
        pluralName: string;
        singularName: string;
        seo: {
          slug: string;
          image: { url: string } | null;
        };
      };
      questions: {
        question: {
          seo: {
            slug: string;
          };
          shortQuestion: string;
          answers: {
            user: {
              userName: string;
              seo: {
                slug: string;
                image: { url: string };
              };
            };
            answer: {
              richText_html: string;
              video: { url: string };
              images: { image: { url: string } }[];
            };
          }[];
        };
      }[];
    };
    question: {
      seo: {
        slug: string;
      };
      shortQuestion: string;
      answers: {
        user: {
          userName: string;
          seo: {
            slug: string;
            image: {
              url: string;
            };
          };
        };
        answer: {
          richText_html: string;
          video: {
            url: string;
          };
          images: {
            image: {
              url: string;
            };
          }[];
        };
      }[];
    };
  }

  let curatedAnswers: curatedAnswers[] = [];

  for (let qIndex = 0; qIndex < maxQuestions; qIndex++) {
    interviews.forEach((interview) => {
      if (interview.questions[qIndex]) {
        const question = interview.questions[qIndex].question;
        const chosenAnswer = question.answers.sort((a, b) => {
          if (a.answer.video && !b.answer.video) return -1;
          if (!a.answer.video && b.answer.video) return 1;
          if (a.answer.images.length > 0 && b.answer.images.length === 0)
            return -1;
          if (a.answer.images.length === 0 && b.answer.images.length > 0)
            return 1;
          return 0;
        })[0];

        if (chosenAnswer) {
          curatedAnswers.push({ ...chosenAnswer, interview, question });
        }
      }
    });
  }

  const structuredAnswers = curatedAnswers.map((item) => {
    return {
      location: "hp",
      interviewSlug: item.interview.seo.slug,
      badgeSingularName: item.interview.badge.singularName,
      badgePluralName: item.interview.badge.pluralName,
      badgeSlug: item.interview.badge.seo.slug,
      badgeImage: item.interview.badge.seo.image?.url || null,
      questionText: item.question.shortQuestion,
      questionSlug: item.question.seo.slug,
      text: item.answer.richText_html,
      images: item.answer.images,
      otherUsersAmount: item.question.answers.length - 1,
      user: {
        name: item.user.userName,
        slug: item.user.seo.slug,
        services: null,
        pfp: item.user.seo.image.url,
      },
    };
  });

  return (
    <div className="flex flex-col md:flex-row md:w-[90%] mx-auto gap-5">
      <div className="flex flex-col md:w-[70%] h-min md:border-r">
        <div className="text-[#195851]/90 text-xl font-light px-auto py-2 mt-10 mb-5 sm:mx-5 text-center border rounded border-[#195851]/90 border-1">
          <h1>Latest Answers</h1>
        </div>
        <div className="md:px-5">
          <div>
            {structuredAnswers.map((item) => {
              return (
                <Answer
                  interviewSlug={item.interviewSlug}
                  badgeSingularName={item.badgeSingularName}
                  badgePluralName={item.badgePluralName}
                  badgeSlug={item.badgeSlug}
                  badgeImage={item.badgeImage}
                  location={"hp"}
                  questionText={item.questionText}
                  text={item.text}
                  images={item.images}
                  questionSlug={item.questionSlug}
                  otherUsersAmount={item.otherUsersAmount}
                  user={{
                    name: item.user.name,
                    slug: item.user.slug,
                    services: item.user.services,
                    pfp: item.user.pfp,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[30%] text-sm hidden sm:block">
        <div className="bg-[#D9D9D9]/25 rounded-t mt-10 shadow-md">
          <div className="border-b w-full p-3">Trending Badges</div>
          <div className="flex flex-col gap-5 p-3">
            {data.data.Badges.docs.slice(0, 8).map((badge) => {
              return (
                <InternalLink
                  element={
                    <div className="flex flex-row gap-2 items-center text-sm text-tl-dark-blue">
                      <Image
                        width={34}
                        height={34}
                        src={
                          badge.seo.image.url || defaultImages.defaultBadgeImage
                        }
                        alt={badge.pluralName}
                        className="rounded-full"
                        style={{
                          objectFit: "cover",
                          width: "34px",
                          height: "34px",
                        }}
                      />
                      {badge.pluralName}
                    </div>
                  }
                  href={`/badge/${badge.seo.slug}`}
                  eventName={"ClickBadgeName"}
                  target={badge.pluralName}
                  locationOnPage={"side-bar"}
                />
              );
            })}
          </div>
        </div>
        <div className="bg-[#D9D9D9]/25 rounded-t mt-10 shadow-md">
          <div className="border-b w-full p-3">New users</div>
          <div className="flex flex-col gap-5 p-3">
            {data.data.Users.docs.slice(0, 8).map((user) => {
              return (
                <InternalLink
                  element={
                    <div className="flex flex-row gap-2 items-center text-tl-dark-blue">
                      <Image
                        width={34}
                        height={34}
                        src={
                          user.seo.image.url || defaultImages.defaultUserImage
                        }
                        alt={user.userName}
                        className="rounded-full"
                        style={{
                          objectFit: "cover",
                          width: "34px",
                          height: "34px",
                        }}
                      />
                      {user.userName}
                    </div>
                  }
                  href={`/user/${user.seo.slug}`}
                  eventName={"ClickBadgeName"}
                  target={user.userName}
                  locationOnPage={"side-bar"}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
