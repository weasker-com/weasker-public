"use client";

import { notFound } from "next/navigation";
import { questionPageRes } from "../../../types/Responses";
import { MdOutlineAdd, MdOutlineFormatListBulleted } from "react-icons/md";
import SidebarBox from "../SidebarBox";
import { defaultImages } from "@/utils/defaultImages";
import { PiShareFatThin } from "react-icons/pi";
import SocialShareButtons from "../SocialShareButtons";
import { BsFileText } from "react-icons/bs";
import { QAPage, WithContext } from "schema-dts";
import Hero from "../Hero";
import { InternalLink } from "../links/InternalLink";
import Answer from "../Answer";
import ListItem from "../ListItem";
import SubMenu from "../SubMenu";
import { useState } from "react";
import Modal from "../Modal";
const { convert } = require("html-to-text");

interface QuestionPageProps {
  data: questionPageRes;
  params: { badge: string; interview: string; question: string };
}

const QuestionPage: React.FC<QuestionPageProps> = (data) => {
  const params = data.params;

  const interview = data.data.data.BadgeInterview.docs[0];
  const relevantQuestion = interview.questions.filter(
    (item) => item.question.seo.slug == params.question
  )[0]?.question;

  if (!relevantQuestion) {
    notFound();
  }

  const otherQuestions = interview.questions.filter(
    (item) => item.question.seo.slug !== params.question
  );

  const answersAmount = relevantQuestion.answers.length;
  const interviewSlug = params.interview;
  const badgeSlug = params.badge;
  const badgePluralName = interview.badge.pluralName;
  const badgeSingularName = interview.badge.singularName;
  const badgeImage = interview.badge.seo.image?.url || null;
  const interviewImage = interview.seo.image?.filename || null;
  const questionIndex = relevantQuestion.index;
  const questionImage = relevantQuestion.seo.image?.filename || null;
  const shortQuestion = relevantQuestion.shortQuestion;
  const mediumQuestion = relevantQuestion.mediumQuestion;
  const longQuestion = relevantQuestion.longQuestion;

  const answersList = relevantQuestion.answers.map((item) => {
    const userName = item.user.userName;
    const userSlug = item.user.seo.slug;
    const userBadge = item.user.userBadges.filter(
      (item) => item.badge.seo.slug == params.badge
    )[0];
    const userServices = userBadge.services;
    const userPfp = item.user.seo.image.filename;
    const answerText = item.answer.richText_html;
    const answerImages = item.answer.images;
    const answerVideo = item.answer.video;
    const updatedAt = item.answer.updatedAt;
    return {
      user: {
        name: userName,
        slug: userSlug,
        services: userServices,
        pfp: userPfp,
        singularName: badgeSingularName,
        badgeSlug: badgeSlug,
      },
      answer: {
        text: answerText,
        images: answerImages,
        number: questionIndex,
        video: answerVideo,
        updatedAt,
      },
    };
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

  const jsonLd: WithContext<QAPage> = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: mediumQuestion,
      text: longQuestion,
      answerCount: answersAmount,
      suggestedAnswer: relevantQuestion.answers.map((item, index) => {
        return {
          "@type": "Answer",
          text: convert(item.answer.richText_html),
          url: `https://www.weasker.com/question/${params.badge}/${interviewSlug}/${params.question}#${item.user.seo.slug}`,
        };
      }),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        title={mediumQuestion}
        preTitle={
          <>
            Question for&nbsp;
            <InternalLink
              element={badgePluralName}
              style={"inherit"}
              href={`/badge/${badgeSlug}`}
              eventName={"ClickBadgeName"}
              target={badgePluralName}
              locationOnPage={"subTitle"}
            />
            &nbsp;
          </>
        }
        image={questionImage || interviewImage}
        location={"interview"}
      />
      <SubMenu>
        <div
          onClick={() => {
            handleModalOpen("answers");
          }}
          className="flex flex-row items-center gap-1"
        >
          <MdOutlineFormatListBulleted /> Answers
        </div>
        <div
          onClick={() => {
            handleModalOpen("share");
          }}
          className="flex flex-row items-center gap-1"
        >
          <PiShareFatThin /> Share
        </div>
        <div
          onClick={() => {
            handleModalOpen("excerpt");
          }}
          className="flex flex-row items-center gap-1"
        >
          <BsFileText /> Excerpt
        </div>
        <div
          onClick={() => {
            handleModalOpen("more");
          }}
          className="flex flex-row items-center gap-1"
        >
          <MdOutlineAdd /> more
        </div>
      </SubMenu>
      {modalIsOpen && activeModal == "answers" && (
        <Modal onclick={handleModalClose}>
          <SidebarBox
            onclick={handleModalClose}
            title={`Answers`}
            array={answersList.map((item) => {
              return {
                name: item.user.name,
                url: `#${item.user.slug}`,
                image: item.user.pfp || defaultImages.defaultUserImage,
                eventName: "ClickUserName",
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
      {modalIsOpen && activeModal == "excerpt" && (
        <Modal onclick={handleModalClose}>
          <SidebarBox title={"Excerpt"} element={<>{longQuestion}</>} />
        </Modal>
      )}
      {modalIsOpen && activeModal == "more" && (
        <Modal onclick={handleModalClose}>
          <SidebarBox
            title={`More questions`}
            array={otherQuestions.map((item) => {
              return {
                name: item.question.shortQuestion,
                url: `/question/${params.badge}/${params.interview}/${item.question.seo.slug}/`,
                image:
                  item.question.seo.image?.url ||
                  interview.seo.image?.url ||
                  defaultImages.defaultQuestionImage,
                eventName: "ClickQuestionPage",
              };
            })}
            itemsAmount={8}
          />
        </Modal>
      )}
      <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2">
        <div className="lg:w-[70%] flex flex-col">
          {answersList.length > 0 ? (
            answersList.map((item, index) => {
              return (
                <Answer
                  key={index}
                  index={index}
                  interviewSlug={params.interview}
                  badgeSingularName={badgeSingularName}
                  badgePluralName={badgePluralName}
                  badgeSlug={badgeSlug}
                  badgeImage={badgeImage}
                  location={"question"}
                  questionText={shortQuestion}
                  answerText={item.answer.text}
                  images={item.answer.images}
                  video={item.answer.video}
                  questionSlug={params.question}
                  otherUsersAmount={answersAmount}
                  userName={item.user.name}
                  userSlug={item.user.slug}
                  services={item.user.services}
                  pfp={item.user.pfp}
                  updatedAt={item.answer.updatedAt}
                />
              );
            })
          ) : (
            <ListItem
              location={"question"}
              name={"Looks like this question doesn't have any answers yet..."}
            />
          )}
        </div>
        <div className="lg:block hidden lg:w-[30%] text-sm">
          <SidebarBox title={"Excerpt"} element={<>{longQuestion}</>} />
          <SidebarBox
            title={`Answers`}
            array={answersList.map((item) => {
              return {
                name: item.user.name,
                url: `#${item.user.slug}`,
                image: item.user.pfp || defaultImages.defaultUserImage,
                eventName: "ClickUserName",
              };
            })}
            itemsAmount={8}
          />
          <SidebarBox
            title={`Similar questions`}
            array={otherQuestions.map((item) => {
              return {
                name: item.question.shortQuestion,
                url: `/question/${params.badge}/${params.interview}//${item.question.seo.slug}/`,
                image:
                  item.question.seo.image?.url ||
                  interview.seo.image?.url ||
                  defaultImages.defaultQuestionImage,
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

export default QuestionPage;
