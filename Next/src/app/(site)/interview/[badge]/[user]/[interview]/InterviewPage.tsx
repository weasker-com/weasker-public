"use client";

import SocialShareButtons from "../../../../../../components/SocialShareButtons";
import { InternalLink } from "../../../../../../components/links/InternalLink";
import Hero from "../../../../../../components/Hero";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../../providers/Auth/Auth";
import Modal from "../../../../../../components/ui/Modal";
import { availableAtIcon, shareIcon } from "@/utils/defaultIcons";
import {
  BigButton,
  GentleButton,
} from "../../../../../../components/ui/buttons";
import { WhiteBox, WideBox } from "../../../../../../components/ui/boxes";
import ContactComp from "../../../../../../components/elements/ContactComp";
import { formatDistanceToNow } from "date-fns";
import {
  Badge,
  Interview,
  Media,
  User,
  UsersInterview,
} from "@/payload/payload-types";
import { ImageAndText } from "@/components/elements/ImageAndText";
import { FAQPage, WithContext } from "schema-dts";
import Answer from "@/components/Answer";
import BadgeApplyComp from "@/components/elements/BadgeApplyComp";
import { defaultImages } from "@/utils/defaultImages";

interface InterviewPageProps {
  data: { data: { UsersInterviews: { docs: UsersInterview[] } } };
  params: { badge: string; user: string; interview: string };
}

const InterviewPage: React.FC<InterviewPageProps> = ({ data, params }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { user } = useAuth();
  const interview = data.data.UsersInterviews.docs[0].interview as Interview;
  const interviewUser = data.data.UsersInterviews.docs[0].user as User;
  const pfp =
    (interviewUser.seo.image as Media)?.filename ||
    defaultImages.defaultUserImage;
  const answers = data.data.UsersInterviews.docs[0].answers;
  const badge = interview.badge as Badge;

  const questionsWithAnswer = interview.questions.filter((question) =>
    answers.some(
      (answer) =>
        answer.answer.questionSlug == question.question.seo.slug &&
        (answer.answer.images.length > 0 ||
          answer.answer.textAnswer !== "" ||
          answer.answer.video)
    )
  );

  const [userIsInterviewee, setUserIsInterviewee] = useState(false);
  const [userHasBadge, setUserHasBadge] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.seo.slug === params.user) {
        setUserIsInterviewee(true);
      }
      if (
        user.userBadges.some(
          (item) => (item.badge as Badge).seo.slug === params.badge
        )
      ) {
        setUserHasBadge(true);
      }
    } else {
      setUserIsInterviewee(false);
      setUserHasBadge(false);
    }
  }, [user, params.badge, params.user]);

  const relevantUserBadge = interviewUser.userBadges.filter(
    (userBadge) => (userBadge.badge as Badge).seo.slug === params.badge
  )[0];

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
    mainEntity: questionsWithAnswer.map((item) => ({
      "@type": "Question",
      name: item.question.mediumQuestion,
      acceptedAnswer: {
        "@type": "Answer",
        text: answers.filter(
          (answer) => answer.answer.questionSlug == item.question.seo.slug
        )[0].answer.textAnswer,
      },
    })),
  };

  const ctaButton = (
    <BigButton
      className="bg-tl-dark-blue"
      text={
        <span className="flex flex-row gap-2 items-center">
          {availableAtIcon(20)} Contact
        </span>
      }
      onClick={() => {
        setActiveModal("contact"), setModalIsOpen(true);
      }}
    />
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        title={interview.name}
        longTitle={true}
        preTitle={
          <>
            Interview with&nbsp;
            <InternalLink
              element={interviewUser.displayName || interviewUser.userName}
              style={"inherit"}
              className="underline"
              href={`/user/${params.user}`}
            />
          </>
        }
        image={pfp}
        about={relevantUserBadge.bio || interviewUser.seo.excerpt || ""}
        cta={ctaButton}
      />
      <div className="flex flex-col lg:flex-row gap-3 max-w-[1000px] w-full">
        <div className="lg:w-[70%] flex flex-col w-full">
          <div className="flex flex-col gap-3">
            {questionsWithAnswer.map((question, index) => {
              const relevantAnswer = answers.filter(
                (answer) =>
                  answer.answer.questionSlug == question.question.seo.slug
              )[0].answer;
              if (relevantAnswer) {
                return (
                  <WideBox
                    key={index}
                    className="p-3 sm:p-5"
                    id={question.question.seo.slug}
                  >
                    <div className="flex flex-col gap-5 w-full">
                      <div>
                        <InternalLink
                          href={`/question/${params.badge}/${params.interview}/${question.question.seo.slug}`}
                          newTab={true}
                          element={
                            <ImageAndText
                              number={index + 1}
                              title={<h2>{question.question.shortQuestion}</h2>}
                            />
                          }
                        />
                      </div>
                      <div>
                        <ImageAndText
                          image={(interviewUser.seo.image as Media)?.filename}
                          defaultImage={defaultImages.defaultUserImage}
                          imageClassName="w-11 h-11"
                          preTitle={
                            <InternalLink
                              className="hover:underline max-w-max"
                              href={`/user/${params.user}`}
                              element={
                                <span>
                                  {interviewUser.displayName ||
                                    interviewUser.userName}
                                </span>
                              }
                            />
                          }
                          title={
                            <span className="text-xs">
                              <InternalLink
                                className="hover:underline"
                                href={`/badge/${params.badge}`}
                                element={badge.singularName}
                              />{" "}
                              &#8226;{" "}
                              {formatDistanceToNow(relevantAnswer.updatedAt, {
                                addSuffix: true,
                              })}{" "}
                              &#8226;{" "}
                              <span
                                className="hover:cursor-pointer hover:underline text-tl-light-blue"
                                onClick={() => {
                                  setActiveModal("contact"),
                                    setModalIsOpen(true);
                                }}
                              >
                                Contact
                              </span>
                            </span>
                          }
                        />
                      </div>
                      <Answer answer={relevantAnswer} />
                      <div className="flex flex-row gap-2 sm:px-5">
                        <InternalLink
                          href={`/interview/${params.badge}/all/${params.interview}#${question.question.seo.slug}`}
                          element={
                            <GentleButton
                              className="text-xs"
                              text="View more answers"
                            />
                          }
                        />
                      </div>
                    </div>
                  </WideBox>
                );
              }
            })}
          </div>
        </div>
        <div className="sticky z-10 top-2 h-max flex-col gap-2 hidden lg:flex w-[30%]">
          <WideBox className="p-3 sm:p-5">
            <div className="flex flex-row flex-wrap gap-2">
              <GentleButton
                className=" border border-tl-dark-blue"
                onClick={() => handleModalOpen("questions")}
                text="Question list"
              />
              <GentleButton
                onClick={() => handleModalOpen("share")}
                className=" border border-tl-dark-blue"
                text={<> Share {shareIcon(20)}</>}
              />
              {(!user || !userHasBadge) && (
                <GentleButton
                  className="border border-tl-dark-blue"
                  text="Apply"
                  onClick={() => handleModalOpen("apply")}
                />
              )}
              {userHasBadge && !userIsInterviewee && (
                <InternalLink
                  href={`/interview/${params.badge}/edit/${params.interview}`}
                  newTab={true}
                  element={
                    <GentleButton
                      className="border border-tl-dark-blue"
                      text="Take this interview"
                    />
                  }
                />
              )}
              {userIsInterviewee && (
                <InternalLink
                  href={`/interview/${params.badge}/edit/${params.interview}`}
                  newTab={true}
                  element={
                    <GentleButton
                      className="border border-tl-dark-blue"
                      text="Edit your interview"
                    />
                  }
                />
              )}
              <InternalLink
                element={
                  <GentleButton
                    className=" border border-tl-dark-blue"
                    text="All interviews"
                  />
                }
                href={`/interview/${params.badge}/all/${params.interview}`}
              />
              <InternalLink
                href={`/badge/${params.badge}?tab=badgers`}
                element={
                  <GentleButton
                    className="border border-tl-dark-blue"
                    text={`More ${badge.pluralName}`}
                  />
                }
              />
              <GentleButton
                className=" border border-tl-dark-blue"
                text={
                  <span className="flex flex-row gap-2 items-center">
                    {availableAtIcon(20)} Contact
                  </span>
                }
                onClick={() => {
                  setActiveModal("contact"), setModalIsOpen(true);
                }}
              />
            </div>
          </WideBox>
        </div>
        <div className="fixed flex flex-col items-center bottom-0 left-0 z-10 h-max lg:hidden w-full py-3 px-1 border-t bg-white mt-2">
          <div className="flex flex-wrap gap-3">
            <GentleButton
              onClick={() => {
                handleModalOpen("options");
              }}
              className=" border border-tl-dark-blue"
              text="Options"
            />
            <GentleButton
              onClick={() => handleModalOpen("share")}
              className=" border border-tl-dark-blue"
              text={<> Share {shareIcon(20)}</>}
            />
          </div>
        </div>
      </div>
      {modalIsOpen && activeModal == "questions" && (
        <Modal onclick={handleModalClose}>
          <WideBox className="p-3 sm:p-5">
            <div className="flex flex-col gap-5">
              <span className="smallCaps text-base font-bold">
                Question list
              </span>
              <ul className="flex flex-col gap-3 text-sm">
                {questionsWithAnswer.map((question, index) => {
                  return (
                    <li
                      key={index}
                      className="hover:pointer-cursor hover:text-tl-light-blue"
                      onClick={() => setModalIsOpen(false)}
                    >
                      {
                        <InternalLink
                          href={`#${question.question.seo.slug}`}
                          element={
                            <div className="flex flex-row gap-1">
                              <div className="font-bold">{index + 1}.</div>
                              <span>{question.question.shortQuestion}</span>
                            </div>
                          }
                        />
                      }
                    </li>
                  );
                })}
              </ul>
            </div>
          </WideBox>
        </Modal>
      )}

      {modalIsOpen && activeModal == "contact" && (
        <Modal onclick={handleModalClose}>
          <ContactComp
            user={interviewUser}
            userName={interviewUser.displayName || interviewUser.userName}
            links={relevantUserBadge.links}
          />
        </Modal>
      )}

      {modalIsOpen && activeModal == "share" && (
        <Modal onclick={handleModalClose}>
          <WhiteBox>
            <SocialShareButtons />
          </WhiteBox>
        </Modal>
      )}
      {modalIsOpen && activeModal == "apply" && (
        <Modal onclick={handleModalClose}>
          <BadgeApplyComp
            badge={badge}
            next={"Take interview"}
            termsText={badge.terms}
          />
        </Modal>
      )}
      {modalIsOpen && activeModal == "options" && (
        <Modal onclick={handleModalClose}>
          <WhiteBox>
            <div className="flex flex-row flex-wrap gap-2">
              <GentleButton
                onClick={() => handleModalOpen("questions")}
                className=" border border-tl-dark-blue"
                text="Question list"
              />
              <GentleButton
                onClick={() => handleModalOpen("share")}
                className=" border border-tl-dark-blue"
                text={<> Share {shareIcon(15)}</>}
              />
              {(!user || !userHasBadge) && (
                <GentleButton
                  className="border border-tl-dark-blue"
                  text="Take this interview"
                  onClick={() => handleModalOpen("apply")}
                />
              )}
              {userHasBadge && !userIsInterviewee && (
                <InternalLink
                  href={`/interview/${params.badge}/edit/${params.interview}`}
                  newTab={true}
                  element={
                    <GentleButton
                      className="border border-tl-dark-blue"
                      text="Take this interview"
                    />
                  }
                />
              )}
              {userIsInterviewee && (
                <InternalLink
                  href={`/interview/${params.badge}/edit/${params.interview}`}
                  newTab={true}
                  element={
                    <GentleButton
                      className="border border-tl-dark-blue"
                      text="Edit your interview"
                    />
                  }
                />
              )}
              <InternalLink
                element={
                  <GentleButton
                    className=" border border-tl-dark-blue"
                    text="All interviews"
                  />
                }
                href={`/interview/${params.badge}/all/${params.interview}`}
              />
              <InternalLink
                href={`/badge/${params.badge}?tab=badgers`}
                element={
                  <GentleButton
                    className="border border-tl-dark-blue"
                    text={`More ${badge.pluralName}`}
                  />
                }
              />
              <GentleButton
                className=" border border-tl-dark-blue"
                text={
                  <span className="flex flex-row gap-2 items-center">
                    {availableAtIcon(20)} Contact
                  </span>
                }
                onClick={() => {
                  setActiveModal("contact"), setModalIsOpen(true);
                }}
              />
            </div>
          </WhiteBox>
        </Modal>
      )}
    </>
  );
};

export default InterviewPage;
