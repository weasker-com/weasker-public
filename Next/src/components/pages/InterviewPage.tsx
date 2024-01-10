"use client";

import { MdOutlineAdd, MdOutlineFormatListBulleted } from "react-icons/md";
import { interviewPageRes } from "../../../types/Responses";
import SidebarBox from "../SidebarBox";
import { defaultImages } from "@/utils/defaultImages";
import { PiShareFatThin } from "react-icons/pi";
import SocialShareButtons from "../SocialShareButtons";
import { LiaUserCheckSolid } from "react-icons/lia";
import { IoLinkOutline } from "react-icons/io5";
import { BsFileText } from "react-icons/bs";
import { InternalLink } from "../links/InternalLink";
import { FAQPage, WithContext } from "schema-dts";
import Hero from "../Hero";
import Answer from "../Answer";
import SubMenu from "../SubMenu";
import { useState } from "react";
import Modal from "../Modal";
const { convert } = require("html-to-text");

interface InterviewPageProps {
  data: interviewPageRes;
  params: { badge: string; user: string; interview: string };
}

const InterviewPage: React.FC<InterviewPageProps> = (data) => {
  const params = data.params;
  const interview = data.data.data.BadgeInterview.docs[0];
  const user = data.data.data.InterviewUser.docs[0];
  const userBadge = data.data.data.InterviewUser.docs[0].userBadges.filter(
    (item) => item.badge.seo.slug == params.badge
  )[0];
  const pfp = user.seo.image?.url || null;
  const interviewSlug = params.interview;
  const badgeSlug = params.badge;
  const userName = user.userName;
  const userSlug = params.user;
  const badgePluralName = interview.badge.pluralName;
  const badgeSingularName = userBadge.badge.singularName;
  const badgeImage = interview.badge.seo.image?.url || null;
  const interviewTitle = interview.name;
  const bio = userBadge.bio;
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

  const jsonLd: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions
      .filter((item) => item.question.answers.length > 0)
      .map((item) => ({
        "@type": "Question",
        name: item.question.mediumQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: convert(
            item.question.answers.filter(
              (answer) => answer.user.seo.slug == params.user
            )[0].answer.richText_html
          ),
        },
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        title={interviewTitle}
        preTitle={
          <>
            {badgeSingularName},&nbsp;
            <InternalLink
              element={userName}
              style={"inherit"}
              href={`/user/${userSlug}`}
              eventName={"ClickUserName"}
              target={userName}
              locationOnPage={"subTitle"}
            />
          </>
        }
        image={pfp}
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
            handleModalOpen("contact");
          }}
          className="flex flex-row items-center gap-1"
        >
          <LiaUserCheckSolid /> Contact
        </div>
        <div
          onClick={() => {
            handleModalOpen("bio");
          }}
          className="flex flex-row items-center gap-1"
        >
          <BsFileText /> Bio
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
      {modalIsOpen && activeModal == "contact" && (
        <Modal onclick={handleModalClose}>
          <SidebarBox
            title={`Contact ${userName}`}
            linkStyle="blue"
            array={userBadge.services.map((item) => {
              return {
                name: item.name,
                url: item.url,
                icon: <IoLinkOutline size={20} />,
                eventName: "ClickQuestionPage",
              };
            })}
          />
        </Modal>
      )}
      {modalIsOpen && activeModal == "bio" && (
        <Modal onclick={handleModalClose}>
          <SidebarBox
            title={"Bio"}
            element={
              <>
                {bio}
                <InternalLink
                  style="blue"
                  element={`${userName} user page`}
                  href={`/user/${userSlug}`}
                  eventName={"ClickUserName"}
                  target={userName}
                  locationOnPage={"bio box"}
                />
              </>
            }
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
            const relevantAnswer = question.answers.filter(
              (answer) => answer.user.seo.slug == params.user
            )[0].answer;
            return (
              <Answer
                key={index}
                index={index + 1}
                interviewSlug={params.interview}
                badgeSingularName={badgeSingularName}
                badgePluralName={badgePluralName}
                badgeSlug={badgeSlug}
                badgeImage={badgeImage}
                location={"interview"}
                questionText={item.question.shortQuestion}
                answerText={relevantAnswer.richText_html}
                images={relevantAnswer.images}
                video={relevantAnswer.video}
                questionSlug={question.seo.slug}
                otherUsersAmount={question.answers.length - 1}
                userName={userName}
                userSlug={params.user}
                services={userBadge.services}
                pfp={pfp}
                updatedAt={relevantAnswer.updatedAt}
              />
            );
          })}
        </div>
        <div className="lg:block hidden flex flex-col gap-2 w-[30%] text-sm">
          <SidebarBox
            title={"Bio"}
            element={
              <>
                {bio}
                <InternalLink
                  style="blue"
                  element={`${userName} user page`}
                  href={`/user/${userSlug}`}
                  eventName={"ClickUserName"}
                  target={userName}
                  locationOnPage={"bio box"}
                />
              </>
            }
          />
          <SidebarBox
            title={"Contact"}
            linkStyle="blue"
            array={userBadge.services.map((item) => {
              return {
                name: item.name,
                url: item.url,
                icon: <IoLinkOutline size={20} />,
                eventName: "ClickQuestionPage",
              };
            })}
          />
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

export default InterviewPage;
