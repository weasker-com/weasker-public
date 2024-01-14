"use client";

import { MdOutlineFormatListBulleted } from "react-icons/md";
import { homePageRes } from "../../../types/Responses";
import Answer from "../Answer";
import SidebarBox from "../SidebarBox";
import { defaultImages } from "@/utils/defaultImages";
import { IoIosTrendingUp } from "react-icons/io";
import { TbUsers } from "react-icons/tb";
import { PiShareFatThin } from "react-icons/pi";
import SocialShareButtons from "../SocialShareButtons";
import Hero from "../Hero";
import SubMenu from "../SubMenu";
import { useEffect, useState } from "react";
import Modal from "../Modal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface HomePagePorps {
  data: homePageRes;
}

const HomePage: React.FC<HomePagePorps> = (data) => {
  const interviews = data.data.data.Interviews.docs;
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
      updatedAt: string;
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
              updatedAt: string;
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
          updatedAt: string;
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

  const structuredAnswers = curatedAnswers.map((item, index) => {
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
      updatedAt: item.answer.updatedAt,
    };
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsTab: string | null = searchParams.get("tab");
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<string | null>(searchParamsTab);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    setActiveTab(searchParamsTab);
  }, [searchParamsTab]);

  const handleTabSelect = (slug: string) => {
    router.push(`${pathname}?tab=${slug}`);
  };

  const handleModalOpen = (slug: string) => {
    setModalIsOpen(true);
    setActiveModal(slug);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
    setActiveModal(null);
  };

  return (
    <>
      <Hero
        location={"hp"}
        title={"Interviewing experts"}
        preTitle={"weasker.com"}
        image={defaultImages.weaskerLogo}
        alt={"weasker.com home page"}
      />
      <SubMenu>
        <div
          onClick={() => {
            handleTabSelect("questions");
          }}
          className={`flex flex-row items-center gap-1 ${
            (activeTab == "questions" || activeTab == null) &&
            "text-tl-light-blue"
          }`}
        >
          <MdOutlineFormatListBulleted /> Questions
        </div>
        <div
          onClick={() => {
            handleModalOpen("badges");
          }}
          className="flex flex-row items-center gap-1"
        >
          <IoIosTrendingUp /> Badges
        </div>
        <div
          onClick={() => {
            handleModalOpen("users");
          }}
          className="flex flex-row items-center gap-1"
        >
          <TbUsers /> Users
        </div>
        <div
          onClick={() => {
            handleModalOpen("share");
          }}
          className="flex flex-row items-center gap-1"
        >
          <PiShareFatThin /> Share
        </div>
      </SubMenu>
      {modalIsOpen && activeModal == "badges" && (
        <Modal onclick={handleModalClose}>
          <SidebarBox
            title={"Trending Badges"}
            array={data.data.data.Badges.docs.map((item) => {
              return {
                name: item.pluralName,
                url: `/badge/${item.seo.slug}`,
                image: item.seo.image?.url || defaultImages.defaultBadgeImage,
                eventName: "ClickBadgeName",
              };
            })}
            itemsAmount={8}
          />
        </Modal>
      )}
      {modalIsOpen && activeModal == "users" && (
        <Modal onclick={handleModalClose}>
          <SidebarBox
            title={"New users"}
            array={data.data.data.Users.docs.map((item) => {
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
        </Modal>
      )}
      {modalIsOpen && activeModal == "share" && (
        <Modal onclick={handleModalClose}>
          <SidebarBox title={"Share"} element={<SocialShareButtons />} />
        </Modal>
      )}
      {(activeTab == "questions" || activeTab == null) && (
        <div className="flex flex-col lg:flex-row lg:w-[1000px] mx-auto gap-3 space-between mt-2">
          <div className="flex flex-col lg:w-[70%] h-min">
            <div>
              {structuredAnswers.map((item, index) => {
                return (
                  <Answer
                    key={index}
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
                    updatedAt={item.updatedAt}
                  />
                );
              })}
            </div>
          </div>
          <div className="lg:block hidden flex flex-col gap-5 w-[30%] text-sm">
            <SidebarBox
              title={"Trending Badges"}
              array={data.data.data.Badges.docs.map((item) => {
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
              array={data.data.data.Users.docs.map((item) => {
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
      )}
    </>
  );
};

export default HomePage;
