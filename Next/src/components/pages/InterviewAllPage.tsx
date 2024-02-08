"use client";

import { MdOutlineAdd, MdOutlineFormatListBulleted } from "react-icons/md";
import { allInterviewPageRes } from "../../../types/Responses";
import SidebarBox from "../SidebarBox";
import { defaultImages } from "@/utils/defaultImages";
import { PiShareFatThin } from "react-icons/pi";
import SocialShareButtons from "../SocialShareButtons";
import { InternalLink } from "../links/InternalLink";
import Hero from "../Hero";
import Answer from "../Answer";
import SubMenu from "../SubMenu";
import React, { useState } from "react";
import Modal from "../Modal";

interface InterviewAllPageProps {
  data: allInterviewPageRes;
  params: { badge: string; user: string; interview: string };
}

const InterviewAllPage: React.FC<InterviewAllPageProps> = (data) => {
  const params = data.params;
  const interview = data.data.data.BadgeInterview.docs[0];
  const badgeSlug = params.badge;
  const badgePluralName = interview.badge.pluralName;
  const badgeSingularName = interview.badge.singularName;
  const badgeImage = interview.badge.seo.image?.filename || null;
  const interviewTitle = interview.name;
  const questions = interview.questions;
  const uniqueUsers = new Set();
  const otherUsers = questions.flatMap((question) => {
    return question.question.answers
      .filter(
        (answer) =>
          !uniqueUsers.has(answer.user.seo.slug) &&
          answer.user.seo.slug !== params.user
      )
      .map((answer) => {
        uniqueUsers.add(answer.user.seo.slug);
        return {
          name: answer.user.userName,
          slug: answer.user.seo.slug,
          pfp: answer.user.seo.image.filename,
          userBadgeSlug: badgeSlug,
        };
      });
  });

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleModalOpen = (slug: string) => {
    setModalIsOpen(true);
    setActiveModal(slug);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
    setActiveModal(null);
  };

  // const jsonLd: WithContext<FAQPage> = {
  //   "@context": "https://schema.org",
  //   "@type": "FAQPage",
  //   mainEntity: questions
  //     .filter((item) => item.question.answers.length > 0)
  //     .map((item) => ({
  //       "@type": "Question",
  //       name: item.question.mediumQuestion,
  //       acceptedAnswer: {
  //         "@type": "Answer",
  //         text: convert(
  //           item.question.answers.filter(
  //             (answer) => answer.user.seo.slug == params.user
  //           )[0].answer.richText_html
  //         ),
  //       },
  //     })),
  // };

  return (
    <>
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      /> */}
      <Hero
        title={interviewTitle}
        preTitle={
          <>
            we asked&nbsp;
            <InternalLink
              element={badgePluralName}
              style={"inherit"}
              href={`/badge/${badgeSlug}`}
              eventName={"ClickBadgeName"}
              target={badgePluralName}
              locationOnPage={"subTitle"}
            />
          </>
        }
        image={badgeImage}
        location={"interview"}
      />
      <SubMenu>
        <div
          onClick={() => {
            handleModalOpen("questions");
          }}
          className="flex flex-row items-center gap-1"
        >
          <MdOutlineFormatListBulleted /> Questions
        </div>
        <div
          onClick={() => {
            handleModalOpen("more");
          }}
          className="flex flex-row items-center gap-1"
        >
          <MdOutlineAdd /> more
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
      {modalIsOpen && activeModal == "questions" && (
        <Modal onclick={handleModalClose}>
          <SidebarBox
            onclick={handleModalClose}
            title={"Questions"}
            array={questions.map((item) => {
              return {
                name: item.question.shortQuestion,
                url: `#${item.question.seo.slug}`,
                image:
                  item.question.seo.image?.url ||
                  data.data.data.BadgeInterview.docs[0].seo.image?.url ||
                  defaultImages.defaultQuestionImage,
                eventName: "ClickQuestionPage",
              };
            })}
            itemsAmount={8}
          />
        </Modal>
      )}

      {modalIsOpen && activeModal == "more" && (
        <Modal onclick={handleModalClose}>
          <SidebarBox
            title={"More users answered this interview"}
            array={otherUsers.map((item) => {
              return {
                name: item.name,
                url: `/interview/${params.badge}/${item.slug}/${params.interview}/`,
                image: item.pfp || defaultImages.defaultQuestionImage,
                eventName: "ClickQuestionPage",
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
      <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2">
        <div className="lg:w-[70%] flex flex-col">
          {questions.map((item, index) => {
            const question = item.question;
            const [chosenUserAnswer, setChosenUserAnswer] = useState<string>(
              question.answers.map((item) => {
                return item.user.seo.slug;
              })[0]
            );
            const usersImages = question.answers.map((item) => {
              return {
                pfp: item.user.seo.image.filename,
                slug: item.user.seo.slug,
              };
            });
            const relevantAnswer = question.answers.filter(
              (answer) => answer.user.seo.slug == chosenUserAnswer
            )[0];
            return (
              <Answer
                location={"allInterview"}
                usersImages={usersImages}
                onClickUserImage={setChosenUserAnswer}
                chosenUserSlug={chosenUserAnswer}
                key={index}
                index={index + 1}
                interviewSlug={params.interview}
                badgeSingularName={badgeSingularName}
                badgePluralName={badgePluralName}
                badgeSlug={badgeSlug}
                badgeImage={badgeImage}
                questionText={item.question.shortQuestion}
                answerText={relevantAnswer.answer.richText_html}
                images={relevantAnswer.answer.images}
                video={relevantAnswer.answer.video}
                questionSlug={question.seo.slug}
                otherUsersAmount={question.answers.length - 1}
                userName={relevantAnswer.user.userName}
                userSlug={params.user}
                pfp={relevantAnswer.user.seo.image.filename}
                updatedAt={relevantAnswer.answer.updatedAt}
              />
            );
          })}
        </div>
        <div className="lg:block hidden flex flex-col gap-2 w-[30%] text-sm">
          <SidebarBox
            title={"Questions"}
            array={questions.map((item) => {
              return {
                name: item.question.shortQuestion,
                url: `#${item.question.seo.slug}`,
                image:
                  item.question.seo.image?.url ||
                  data.data.data.BadgeInterview.docs[0].seo.image?.url ||
                  defaultImages.defaultQuestionImage,
                eventName: "ClickQuestionPage",
              };
            })}
            itemsAmount={8}
          />
          <SidebarBox
            title={"Also answered"}
            array={otherUsers.map((item) => {
              return {
                name: item.name,
                url: `/interview/${params.badge}/${item.slug}/${params.interview}/`,
                image: item.pfp || defaultImages.defaultQuestionImage,
                eventName: "ClickQuestionPage",
              };
            })}
            itemsAmount={8}
          />
        </div>
      </div>
    </>
  );
};

export default InterviewAllPage;
