import { fetchData } from "@/utils/payloadFetch";
import Answer from "@/components/Answer";
import { homePageRes } from "../../../types/Responses";
import SidebarBox from "../../components/SidebarBox";
import { defaultImages } from "@/utils/defaultImages";
import Hero from "@/components/Hero";
import SubMenu from "@/components/SubMenu";
import { IoIosTrendingUp } from "react-icons/io";
import { TbUsers } from "react-icons/tb";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { PiShareFatThin } from "react-icons/pi";
import SocialShareButtons from "@/components/SocialShareButtons";
import { notFound } from "next/navigation";

async function getData() {
  const query = `{
        Interviews {
          docs {
            name
            seo {
              slug
              excerpt
              image{url filename}
            }
            badge {
              singularName
              pluralName
              seo {
                slug
                image{url filename}
              }
            }
            questions {
              question {
                shortQuestion
                mediumQuestion
                seo {
                  slug
                }
                answers {
                  user {
                    seo{image{url filename}}
                    userName
                    seo {
                      slug
                    }
                  }
                  answer{richText_html video{url filename} images{image {url filename}}}
                }
              }
            }
          }
        }
        Badges {
          docs {
            pluralName
            singularName
            seo{slug image{url filename}}
          }
        }
        Users(where: { roles: { equals: endUser } }){
          docs{
            userName
            seo{slug image{url filename}}
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

  if (!data) {
    notFound();
  }

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
          filename: string;
        } | null;
      };
    };
    answer: {
      richText_html: string;
      video: {
        url: string;
        filename: string;
      } | null;
      images: {
        image: {
          url: string;
          filename: string;
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
          image: { url: string; filename: string } | null;
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
                image: { url: string; filename: string } | null;
              };
            };
            answer: {
              richText_html: string;
              video: { url: string; filename: string } | null;
              images: { image: { url: string; filename: string } }[];
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
      mediumQuestion: string;
      answers: {
        user: {
          userName: string;
          seo: {
            slug: string;
            image: {
              filename: string;
              url: string;
            } | null;
          };
        };
        answer: {
          richText_html: string;
          video: {
            filename: string;
            url: string;
          } | null;
          images: {
            image: {
              filename: string;
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
      questionText: item.question.mediumQuestion,
      questionSlug: item.question.seo.slug,
      text: item.answer.richText_html,
      images: item.answer.images,
      video: item.answer.video,
      otherUsersAmount: item.question.answers.length - 1,
      userName: item.user.userName,
      userSlug: item.user.seo.slug,
      services: null,
      pfp: item.user.seo.image,
    };
  });

  const subMenuArray = [
    {
      name: (
        <>
          <MdOutlineFormatListBulleted /> &nbsp;Questions
        </>
      ),
      slug: "questions",
      tab: (
        <div className="flex flex-col lg:flex-row lg:w-[1000px] mx-auto gap-3 space-between mt-2">
          <div className="flex flex-col lg:w-[70%] h-min">
            <div>
              {structuredAnswers.map((item, index) => {
                return (
                  <Answer
                    index={index}
                    interviewSlug={item.interviewSlug}
                    badgeSingularName={item.badgeSingularName}
                    badgePluralName={item.badgePluralName}
                    badgeSlug={item.badgeSlug}
                    badgeImage={item.badgeImage}
                    location={"hp"}
                    questionText={item.questionText}
                    answerText={item.text}
                    images={item.images}
                    video={item.video}
                    questionSlug={item.questionSlug}
                    otherUsersAmount={item.otherUsersAmount}
                    userName={item.userName}
                    userSlug={item.userSlug}
                    services={item.services}
                    pfp={item.pfp?.filename || null}
                  />
                );
              })}
            </div>
          </div>
          <div className="lg:block hidden flex flex-col gap-5 w-[30%] text-sm">
            <SidebarBox
              title={"Trending Badges"}
              array={data.data.Badges.docs.map((item) => {
                return {
                  name: item.pluralName,
                  url: `/badge/${item.seo.slug}`,
                  image: item.seo.image?.url || defaultImages.defaultBadgeImage,
                  eventName: "ClickBadgeName",
                };
              })}
              itemsAmount={8}
            />
            <SidebarBox
              title={"New users"}
              array={data.data.Users.docs.map((item) => {
                return {
                  name: item.userName,
                  url: `/user/${item.seo.slug}`,
                  image: item.seo.image?.url || defaultImages.defaultUserImage,
                  alt: item.userName,
                  eventName: "ClickUserName",
                  eventTarget: item.userName,
                };
              })}
              itemsAmount={8}
            />
          </div>
        </div>
      ),
    },
    {
      name: (
        <>
          <IoIosTrendingUp /> &nbsp;Badges
        </>
      ),
      slug: "badges",
      modal: (
        <SidebarBox
          title={"Trending Badges"}
          array={data.data.Badges.docs.map((item) => {
            return {
              name: item.pluralName,
              url: `/badge/${item.seo.slug}`,
              image: item.seo.image?.url || defaultImages.defaultBadgeImage,
              eventName: "ClickBadgeName",
            };
          })}
          itemsAmount={8}
        />
      ),
    },
    {
      name: (
        <>
          <TbUsers /> &nbsp;Users
        </>
      ),
      slug: "users",
      modal: (
        <SidebarBox
          title={"New users"}
          array={data.data.Users.docs.map((item) => {
            return {
              name: item.userName,
              url: `/user/${item.seo.slug}`,
              image: item.seo.image?.url || defaultImages.defaultUserImage,
              alt: item.userName,
              eventName: "ClickUserName",
              eventTarget: item.userName,
            };
          })}
          itemsAmount={8}
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
      <Hero
        location={"hp"}
        title={"Interviewing experts"}
        preTitle={"weasker.com"}
        image={defaultImages.weaskerLogo}
        alt={"weasker.com home page"}
      />
      <SubMenu location={"hp"} menu={subMenuArray} />
    </>
  );
}
