"use client";

import { ImageAndText } from "@/components/elements/ImageAndText";
import { InternalLink } from "@/components/links/InternalLink";
import { WideBox } from "@/components/ui/boxes";
import { GentleButton } from "@/components/ui/buttons";
import {
  Badge,
  Interview,
  Media,
  User,
  UsersInterview,
} from "@/payload/payload-types";
import { badgeIcon, interviewIcon, shareIcon } from "@/utils/defaultIcons";
import { defaultImages } from "@/utils/defaultImages";
import { useState } from "react";

interface InterviewsTabProps {
  handleTabSelect: any;
  activeTab: string;
  data: Badge;
  params: { badge: string };
  user: User;
  userHasBadge: boolean;
  handleModalOpen: any;
}

export const InterviewsTab = ({
  data,
  params,
  user,
  userHasBadge,
  handleTabSelect,
  activeTab,
  handleModalOpen,
}: InterviewsTabProps) => {
  const [showQuestions, setShowQuestions] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row gap-3 max-w-[1000px] w-full">
      <div className="lg:w-[70%] flex flex-col gap-2 w-full">
        {data.interviews.map((item, index) => {
          const interview = item as Interview;
          const editInterviewUrl = `/interview/${params.badge}/edit/${interview.seo.slug}`;
          const userTookInterview = user
            ? user?.userInterviews?.some((item) => {
                ((item as UsersInterview).interview as Interview).id ==
                  interview.id;
              })
            : false;

          const interviewHasAnswers = interview.userInterviews?.length > 0;

          const getInterviewActionButton = () => {
            if (user && userTookInterview) {
              return (
                <InternalLink
                  href={editInterviewUrl}
                  newTab={true}
                  element={<GentleButton text="Edit interview" />}
                />
              );
            } else if (user && userHasBadge && !userTookInterview) {
              return (
                <InternalLink
                  href={editInterviewUrl}
                  newTab={true}
                  element={<GentleButton text="Take interview" />}
                />
              );
            } else
              return (
                <InternalLink
                  href={editInterviewUrl}
                  element={
                    <GentleButton disabled={true} text="Take interview" />
                  }
                />
              );
          };

          return (
            <WideBox className="p-3 sm:p-5 w-full" key={index}>
              <InternalLink
                href={`/interview/${params.badge}/all/${interview.seo.slug}`}
                className="hover: border-tl-light-blue"
                element={
                  <ImageAndText
                    preTitle="Interview"
                    title={<h2 className="capitalize">{interview.name}</h2>}
                    image={(interview.seo.image as Media)?.filename}
                    defaultImage={defaultImages.defaultInterviewImage}
                    imageClassName="w-11 h-11 sm:w-24 sm:h-24"
                  />
                }
              ></InternalLink>
              <div className="flex flex-row gap-2 justify-end w-full">
                <GentleButton
                  text="Show questions"
                  onClick={() => setShowQuestions(!showQuestions)}
                />
                {getInterviewActionButton()}

                <InternalLink
                  element={
                    <GentleButton disabled={!interviewHasAnswers} text="View" />
                  }
                  href={`/interview/${params.badge}/all/${interview.seo.slug}`}
                />
              </div>
              {showQuestions && (
                <div className="flex flex-col gap-2">
                  <span className="font-bold">Interview questions</span>
                  <ul className="flex flex-col gap-2 text-weasker-grey text-sm">
                    {interview.questions.map((item, index) => {
                      console.log("interviewHasAnswers", interviewHasAnswers);
                      return interviewHasAnswers ? (
                        <InternalLink
                          key={index}
                          newTab={true}
                          href={`/question/${data.seo.slug}/${interview.seo.slug}/${item.question.seo.slug}`}
                          element={
                            <li className="hover:text-tl-light-blue">
                              {`${index + 1}. ${item.question.shortQuestion}`}
                            </li>
                          }
                        />
                      ) : (
                        <li key={index}>
                          {`${index + 1}. ${item.question.shortQuestion}`}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </WideBox>
          );
        })}
      </div>
      <div className="sticky z-10 top-2 h-max flex-col gap-2 hidden lg:flex w-[30%]">
        <WideBox className="p-3 sm:p-5">
          <div className="flex flex-row flex-wrap gap-2">
            <GentleButton
              className={`border border-tl-dark-blue ${
                (activeTab == "interviews" || activeTab == null) &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
              text={<>{interviewIcon(20)} Interviews</>}
              onClick={() => {
                handleTabSelect("interviews");
              }}
            />
            <GentleButton
              className={`border border-tl-dark-blue ${
                activeTab == "badgers" &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
              text={<>{badgeIcon(20)} Experts</>}
              onClick={() => {
                handleTabSelect("badgers");
              }}
            />
            <GentleButton
              className={`border border-tl-dark-blue`}
              text={<>Share {shareIcon(20)}</>}
              onClick={() => {
                handleModalOpen({ slug: "share" });
              }}
            />
          </div>
        </WideBox>
      </div>
    </div>
  );
};
