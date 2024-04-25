"use client";

import { InternalLink } from "../../../../../../components/links/InternalLink";
import Hero from "../../../../../../components/Hero";
import React, { useEffect, useState } from "react";
import Modal from "../../../../../../components/ui/Modal";
import { WhiteBox, WideBox } from "../../../../../../components/ui/boxes";
import { useAuth } from "../../../../../../providers/Auth/Auth";
import {
  Badge,
  Interview,
  Media,
  User,
  UsersInterview,
} from "@/payload/payload-types";
import { BigButton, GentleButton } from "@/components/ui/buttons";
import { shareIcon } from "@/utils/defaultIcons";
import SocialShareButtons from "@/components/SocialShareButtons";
import ContactComp from "@/components/elements/ContactComp";
import { FAQPage, WithContext } from "schema-dts";
import BadgeApplyComp from "@/components/elements/BadgeApplyComp";
import { defaultImages } from "@/utils/defaultImages";
import InterviewAnswer from "../../../../../../components/InterviewAnswer";
import { ImageAndText } from "@/components/elements/ImageAndText";

interface InterviewAllPageProps {
  data: {
    data: {
      Interviews: { docs: Interview[] };
      UsersInterviews: { docs: UsersInterview[] };
    };
  };
  params: { badge: string; user: string; interview: string };
}

const InterviewAllPage: React.FC<InterviewAllPageProps> = (data) => {
  const { user } = useAuth();
  const params = data.params;
  const interview = data.data.data.Interviews.docs[0];
  const allInterviews = data.data.data.UsersInterviews.docs;
  const [currentUser, setCurrentUser] = useState<User>(
    (allInterviews[0]?.user as User) || null
  );

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [contactUser, setContactUser] = useState<User>(
    (allInterviews[0]?.user as User) || null
  );

  const [userIsInterviewee, setUserIsInterviewee] = useState(false);
  const [userHasBadge, setUserHasBadge] = useState(false);

  useEffect(() => {
    if (user) {
      if (
        allInterviews.some((item) => {
          return (item.user as User).seo.slug == user.seo.slug;
        })
      ) {
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
  }, [user, params.badge, allInterviews]);

  const badge = interview.badge as Badge;
  const allAnswers = allInterviews.map((interview) => interview.answers).flat();

  const questionsWithAnswer = interview.questions.filter((question) =>
    allAnswers.some(
      (answer) =>
        answer.answer.questionSlug == question.question.seo.slug &&
        (answer.answer.images.length > 0 ||
          answer.answer.textAnswer !== "" ||
          answer.answer.video)
    )
  );

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
        text: allAnswers.filter(
          (answer) => answer.answer.questionSlug == item.question.seo.slug
        )[0].answer.textAnswer,
      },
    })),
  };

  const getCtaButton = () => {
    if (!user || !userHasBadge) {
      return (
        <BigButton
          text="Apply for interview"
          className="bg-tl-dark-blue"
          onClick={() => handleModalOpen("apply")}
        />
      );
    }

    if (!userIsInterviewee) {
      return (
        <InternalLink
          href={`/interview/${params.badge}/edit/${params.interview}`}
          newTab={true}
          element={
            <BigButton className="bg-tl-light-blue" text="Take interview" />
          }
        />
      );
    }

    return (
      <InternalLink
        href={`/interview/${params.badge}/edit/${params.interview}`}
        newTab={true}
        element={
          <BigButton className="bg-tl-light-blue" text="Edit interview" />
        }
      />
    );
  };

  const ctaButton = getCtaButton();

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
              element={badge.pluralName}
              style={"inherit"}
              href={`/badge/${params.badge}`}
              className="underline decoration-1"
            />
          </>
        }
        about={
          <div>
            We asked {badge.pluralName} about{" "}
            {interview.questions.map((item, index) => {
              return (
                <span key={index}>
                  {index > 0 && ", "}
                  {item.question.seo.slug.replace(/-/g, " ")}
                </span>
              );
            })}
          </div>
        }
        image={
          (badge.seo?.image as Media).filename ||
          defaultImages.defaultBadgeImage
        }
        cta={ctaButton}
      />
      <div className="flex flex-col lg:flex-row gap-3 max-w-[1000px] w-full">
        {allInterviews.length > 0 ? (
          <div className="lg:w-[70%] flex flex-col w-full gap-3">
            {questionsWithAnswer.map((question, index) => {
              const relevantAnswers = allInterviews
                .map((interview) => {
                  const user = interview.user as User;
                  const answer =
                    interview.answers.filter(
                      (interviewAnswer) =>
                        interviewAnswer.answer.questionSlug ==
                        question.question.seo.slug
                    )[0]?.answer || null;

                  {
                    return { user, answer };
                  }
                })
                .filter(
                  (answer) =>
                    answer?.answer?.images.length > 0 ||
                    answer?.answer?.video ||
                    answer?.answer?.textAnswer?.length > 0
                );

              const getAnswerPriority = (entry: {
                user: User;
                answer?: UsersInterview["answers"][number]["answer"];
              }) => {
                const answer = entry.answer;

                if (!answer) {
                  return Infinity;
                }

                const hasVideo = answer.video != null;
                const hasImages =
                  answer.images != null && answer.images.length > 0;
                const textLength = answer.textAnswer?.length ?? 0;

                if (hasVideo && hasImages) return 1;
                if (hasVideo) return 2;
                if (hasImages) return 3;
                return 1000 - textLength;
              };

              const sortedRelevantAnswers = relevantAnswers.sort((a, b) => {
                const priorityA = getAnswerPriority(a);
                const priorityB = getAnswerPriority(b);
                return priorityA - priorityB;
              });

              const goToPrevUser = () => {
                const currentIndex = relevantAnswers.findIndex(
                  (item) => item.user.seo.slug === currentUser.seo.slug
                );
                const prevIndex =
                  (currentIndex - 1 + relevantAnswers.length) %
                  relevantAnswers.length;
                const prevUser = relevantAnswers[prevIndex].user;

                setCurrentUser(prevUser);
              };

              const goToNextUser = () => {
                const currentIndex = relevantAnswers.findIndex(
                  (item) => item.user.seo.slug === currentUser.seo.slug
                );
                const nextIndex = (currentIndex + 1) % relevantAnswers.length;
                const nextUser = relevantAnswers[nextIndex].user;
                setCurrentUser(nextUser);
              };

              return (
                <InterviewAnswer
                  key={index}
                  badgeSlug={data.params.badge}
                  badgeName={badge.singularName}
                  questionNumber={index + 1}
                  question={question}
                  relevantAnswers={sortedRelevantAnswers}
                  onGoToNextUser={goToNextUser}
                  onGoToPrevUser={goToPrevUser}
                  onChangeUser={setCurrentUser}
                  currentUser={currentUser}
                  onContactUser={(user: User) => {
                    setContactUser(user);
                    setActiveModal("contact");
                    setModalIsOpen(true);
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="lg:w-[70%] flex flex-col w-full gap-3">
            {interview.questions.map((question, index) => {
              return (
                <WideBox
                  key={index}
                  className="p-5"
                  id={question.question.seo.slug}
                >
                  <div>
                    <ImageAndText
                      number={index + 1}
                      title={<h2>{question.question.shortQuestion}</h2>}
                      about={
                        <span className="text-sm mt-1">
                          {question.question.longQuestion}
                        </span>
                      }
                    />
                  </div>
                  <div className="p-5">Answers coming soon.</div>
                </WideBox>
              );
            })}
          </div>
        )}

        <div className="hidden lg:flex sticky z-10 top-2 h-max flex-col gap-2  w-[30%]">
          <WideBox className="p-3 sm:p-5">
            <div className="flex flex-row flex-wrap gap-2">
              <GentleButton
                onClick={() => handleModalOpen("questions")}
                className="border border-tl-dark-blue"
                text="Question list"
              />
              <GentleButton
                onClick={() => handleModalOpen("share")}
                className="border border-tl-dark-blue"
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
                href={`/badge/${params.badge}?tab=badgers`}
                element={
                  <GentleButton
                    className="border border-tl-dark-blue"
                    text={`All ${badge.pluralName}`}
                  />
                }
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
              className="border border-tl-dark-blue"
              text="Options"
            />
            <GentleButton
              onClick={() => handleModalOpen("share")}
              className="border border-tl-dark-blue"
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
      {modalIsOpen && activeModal == "share" && (
        <Modal onclick={handleModalClose}>
          <WhiteBox>
            <SocialShareButtons />
          </WhiteBox>
        </Modal>
      )}

      {modalIsOpen && activeModal == "contact" && (
        <Modal onclick={handleModalClose}>
          <ContactComp
            user={contactUser}
            userName={contactUser.displayName || contactUser.userName}
            links={
              contactUser.userBadges.filter((userBadge) => {
                return (userBadge.badge as Badge).seo.slug == badge.seo.slug;
              })[0].links
            }
          />
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
          <WhiteBox className="p-5">
            <div className="flex flex-row flex-wrap gap-2">
              <GentleButton
                onClick={() => handleModalOpen("questions")}
                className="border border-tl-dark-blue"
                text="Question list"
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
                href={`/badge/${params.badge}?tab=badgers`}
                element={
                  <GentleButton
                    className="border border-tl-dark-blue"
                    text={`All ${badge.pluralName}`}
                  />
                }
              />
            </div>
          </WhiteBox>
        </Modal>
      )}
    </>
  );
};

export default InterviewAllPage;
