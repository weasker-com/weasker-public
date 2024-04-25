"use client";

import { notFound } from "next/navigation";
import { defaultImages } from "@/utils/defaultImages";
import SocialShareButtons from "../../../../../../components/SocialShareButtons";
import { QAPage, WithContext } from "schema-dts";
import Hero from "../../../../../../components/Hero";
import { InternalLink } from "../../../../../../components/links/InternalLink";
import React, { useState } from "react";
import Modal from "../../../../../../components/ui/Modal";
import { shareIcon } from "@/utils/defaultIcons";
import {
  BigButton,
  GentleButton,
} from "../../../../../../components/ui/buttons";
import { WhiteBox, WideBox } from "../../../../../../components/ui/boxes";
import {
  Badge,
  Interview,
  Media,
  User,
  UsersInterview,
} from "@/payload/payload-types";
import Answer from "@/components/Answer";
import { ImageAndText } from "@/components/elements/ImageAndText";
import { formatDistanceToNow } from "date-fns";
import ContactComp from "@/components/elements/ContactComp";
const { convert } = require("html-to-text");

interface QuestionPageProps {
  data: {
    data: {
      UsersInterviews: { docs: UsersInterview[] };
      Interviews: { docs: Interview[] };
    };
  } | null;
  params: { badge: string; interview: string; question: string };
}

const QuestionPage: React.FC<QuestionPageProps> = ({ params, data }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const interviews = data.data.UsersInterviews.docs;
  const interview = data.data.Interviews.docs[0];
  const badge = interview.badge as Badge;
  const relevantQuestion = interview.questions.filter(
    (item) => item.question.seo.slug == params.question
  )[0]?.question;

  if (!relevantQuestion) {
    notFound();
  }
  const interviewImage = (interview.seo?.image as Media)?.filename || null;
  const questionImage =
    (relevantQuestion.seo?.image as Media)?.filename || null;

  const relevantAnswers = interviews
    .flatMap((item) => {
      const relevantAnswer = item.answers.filter((item) => {
        return item.answer.questionSlug == params.question;
      })[0];

      if (relevantAnswer) {
        return {
          user: item.user as User,
          answer: relevantAnswer,
        };
      }
    })
    .filter((item) => item);

  const getAnswerPriority = (entry: {
    user: User;
    answer: { answer?: UsersInterview["answers"][number]["answer"] };
  }) => {
    const answer = entry.answer.answer;

    if (!answer) {
      return Infinity;
    }

    const hasVideo = answer.video != null;
    const hasImages = answer.images != null && answer.images.length > 0;
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

  const [contactUser, setContactUser] = useState<User>(
    (relevantAnswers[0]?.user as User) || null
  );

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
      author: {
        "@type": "Organization",
        name: "weasker",
        url: `https://www.weasker.com`,
      },
      datePublished: interview.createdAt,
      name: relevantQuestion.mediumQuestion,
      text: relevantQuestion.longQuestion,
      answerCount: relevantAnswers.length,
      suggestedAnswer: sortedRelevantAnswers.map((item) => {
        return {
          "@type": "Answer",
          text: convert(item.answer.answer.textAnswer),
          url: `https://www.weasker.com/question/${params.badge}/${
            params.interview
          }/${params.question}#${(item.user as User).seo.slug}`,
          author: {
            "@type": "Person",
            name: item.user.displayName || item.user.userName,
            url: `https://www.weasker.com/user/${item.user.seo.slug}`,
          },
          datePublished: item.answer.answer.updatedAt,
        };
      }),
    },
  };

  const ctaButton = (
    <InternalLink
      newTab={true}
      href={`/interview/${params.badge}/all/${params.interview}`}
      element={
        <div className="flex flex-col gap-1 items-center m-auto">
          <BigButton className="bg-tl-dark-blue" text="View parent interview" />
        </div>
      }
    ></InternalLink>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        title={relevantQuestion.mediumQuestion}
        longTitle={true}
        cta={ctaButton}
        preTitle={
          <>
            Question for&nbsp;
            <InternalLink
              element={badge.pluralName}
              href={`/badge/${params.badge}`}
              style="inherit"
              className="underline"
            />
            &nbsp;
          </>
        }
        image={
          questionImage || interviewImage || defaultImages.defaultQuestionImage
        }
        about={relevantQuestion.longQuestion}
      />
      <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2 w-full">
        <div className="lg:w-[70%] flex flex-col gap-2">
          {relevantAnswers && relevantAnswers.length > 0 ? (
            sortedRelevantAnswers.map((item, index) => {
              return (
                <WideBox className="p-5" key={index} id={item.user.seo.slug}>
                  <div className="flex flex-col gap-5 w-full">
                    <ImageAndText
                      preTitle={
                        <InternalLink
                          className="hover:underline max-w-max"
                          href={`/user/${item.user.seo.slug}`}
                          element={
                            <h2 className="text-base font-normal">
                              {item.user.displayName || item.user.userName}
                            </h2>
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
                          {formatDistanceToNow(item.answer.answer.updatedAt, {
                            addSuffix: true,
                          })}{" "}
                          &#8226;{" "}
                          <span
                            className="hover:cursor-pointer hover:underline text-tl-light-blue"
                            onClick={() => {
                              setContactUser(item.user);
                              setActiveModal("contact"), setModalIsOpen(true);
                            }}
                          >
                            Contact
                          </span>
                        </span>
                      }
                      image={(item.user.seo.image as Media)?.filename}
                      defaultImage={defaultImages.defaultUserImage}
                      imageClassName="w-11 h-11"
                    />
                    <Answer answer={item.answer.answer} />
                    <div className="flex flex-row gap-2 sm:px-5">
                      <InternalLink
                        href={`/interview/${params.badge}/${item.user.seo.slug}/${params.interview}`}
                        element={
                          <GentleButton
                            className="text-xs"
                            text={`${
                              item.user.displayName || item.user.userName
                            } full interview`}
                          />
                        }
                      />
                    </div>
                  </div>
                </WideBox>
              );
            })
          ) : (
            <WideBox className="p-3 sm:p-5">
              <span>
                Looks like no{" "}
                <span className="font-semibold lowercase">
                  {badge.singularName}
                </span>{" "}
                answered this questions yet.
              </span>
              <InternalLink
                href={`/interview/${params.badge}/all/${params.interview}`}
                element={"Apply for this interview"}
                style="blue"
              />
            </WideBox>
          )}
        </div>
        <div className="sticky z-10 top-2 h-max flex-col gap-2 hidden lg:flex w-[30%]">
          <WideBox className="p-3 sm:p-5">
            <div className="flex flex-row flex-wrap gap-2">
              {relevantAnswers && relevantAnswers.length > 0 && (
                <GentleButton
                  className=" border border-tl-dark-blue"
                  onClick={() => handleModalOpen("users")}
                  text="Answers list"
                />
              )}
              <GentleButton
                onClick={() => handleModalOpen("share")}
                className=" border border-tl-dark-blue"
                text={<> Share {shareIcon(20)}</>}
              />
              <GentleButton
                onClick={() => handleModalOpen("siblingQuestions")}
                className="border border-tl-dark-blue"
                text="Sibling questions"
              />
              <InternalLink
                element={
                  <GentleButton
                    className=" border border-tl-dark-blue"
                    text="Parent interview"
                  />
                }
                href={`/interview/${params.badge}/all/${params.interview}`}
              />
              <InternalLink
                href={`/badge/${params.badge}?tab=badgers`}
                element={
                  <GentleButton
                    className=" border border-tl-dark-blue"
                    text={`All ${badge.pluralName}`}
                  />
                }
              />
            </div>
          </WideBox>
        </div>
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
        {modalIsOpen && activeModal == "share" && (
          <Modal onclick={handleModalClose}>
            <WhiteBox>
              <SocialShareButtons />
            </WhiteBox>
          </Modal>
        )}
        {modalIsOpen && activeModal == "users" && (
          <Modal onclick={handleModalClose}>
            <WideBox className="p-3 sm:p-5">
              <div className="flex flex-col gap-5">
                <span className="smallCaps text-base font-bold">
                  Answers list
                </span>
                <ul className="flex flex-col gap-3 text-sm">
                  {relevantAnswers.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className="hover:pointer-cursor hover:text-tl-light-blue"
                        onClick={() => setModalIsOpen(false)}
                      >
                        {
                          <InternalLink
                            href={`#${item.user.seo.slug}`}
                            element={
                              <div className="flex flex-row gap-1">
                                <div className="font-bold">{index + 1}.</div>
                                <span>
                                  {item.user.displayName || item.user.userName}
                                </span>
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
        {modalIsOpen && activeModal == "siblingQuestions" && (
          <Modal onclick={handleModalClose}>
            <WideBox className="p-3 sm:p-5">
              <div className="flex flex-col gap-5">
                <span className="smallCaps text-base font-bold">
                  Sibling questions
                </span>
                <ul className="flex flex-col gap-3 text-sm">
                  {interview.questions.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className="hover:pointer-cursor hover:text-tl-light-blue"
                        onClick={() => setModalIsOpen(false)}
                      >
                        {
                          <InternalLink
                            href={`/question/${badge.seo.slug}/${interview.seo.slug}/${item.question.seo.slug}`}
                            element={
                              <div className="flex flex-row gap-1">
                                <div className="font-bold">{index + 1}.</div>
                                <span>{item.question.shortQuestion}</span>
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
        {modalIsOpen && activeModal == "options" && (
          <Modal onclick={handleModalClose}>
            <WhiteBox className="p-5">
              <div className="flex flex-col gap-5">
                <span className="smallCaps text-base font-bold">Options</span>

                <div className="flex flex-row flex-wrap gap-2">
                  <GentleButton
                    className=" border border-tl-dark-blue"
                    onClick={() => handleModalOpen("users")}
                    text="Answers list"
                  />

                  <GentleButton
                    onClick={() => handleModalOpen("siblingQuestions")}
                    className="border border-tl-dark-blue"
                    text="Sibling questions"
                  />
                  <InternalLink
                    element={
                      <GentleButton
                        className=" border border-tl-dark-blue"
                        text="Parent interview"
                      />
                    }
                    href={`/interview/${params.badge}/all/${params.interview}`}
                  />
                  <InternalLink
                    href={`/badge/${params.badge}?tab=badgers`}
                    element={
                      <GentleButton
                        className=" border border-tl-dark-blue"
                        text={`All ${badge.pluralName}`}
                      />
                    }
                  />
                </div>
              </div>
            </WhiteBox>
          </Modal>
        )}
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
    </>
  );
};

export default QuestionPage;
