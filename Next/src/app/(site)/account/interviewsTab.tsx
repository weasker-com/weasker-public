"use client";

import { ImageAndText } from "@/components/elements/ImageAndText";
import { InternalLink } from "@/components/links/InternalLink";
import { WideBox } from "@/components/ui/boxes";
import { GentleButton } from "@/components/ui/buttons";
import {
  Badge,
  Interview,
  Media,
  UsersInterview,
} from "@/payload/payload-types";
import { useAuth } from "../../../providers/Auth/Auth";
import { defaultImages } from "@/utils/defaultImages";
import { badgeIcon, interviewIcon, profileIcon } from "@/utils/defaultIcons";
import getArticle from "@/helpers/getArticle";

interface InterviewsTabProps {
  handleTabSelect: any;
  activeTab: string;
}

export const InterviewsTab = ({
  handleTabSelect,
  activeTab,
}: InterviewsTabProps) => {
  const { user } = useAuth();

  const answeredInterviews =
    user?.userInterviews?.filter((item) => {
      return (item as UsersInterview).answersAmount > 0;
    }) || [];

  const answeredInterviewsIds = answeredInterviews.map((interview) => {
    return (interview as UsersInterview).id;
  });

  const availableInterviews = user.userBadges.flatMap((userBadge) => {
    return (userBadge.badge as Badge).interviews.map((interview) => {
      return { badge: userBadge.badge, interview: interview };
    });
  });

  const availableInterviewsNotTaken = availableInterviews.filter((item) => {
    return (item.interview as Interview).userInterviews
      ? !(item.interview as Interview).userInterviews.some((userInterview) => {
          return answeredInterviewsIds.includes(userInterview as string);
        })
      : [];
  });

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] w-full">
      <div className="lg:w-[70%] flex flex-col w-full gap-3">
        <WideBox className="p-3 sm:p-5">
          <div className="flex flex-col gap-5 w-full">
            <h2 className="smallCaps">Your interviews</h2>
            {answeredInterviews.length > 0 ? (
              answeredInterviews.map((item, index) => {
                const userInterview = item as UsersInterview;
                return (
                  <div key={index} className="flex flex-col gap-5">
                    <ImageAndText
                      image={(user.seo.image as Media)?.filename}
                      defaultImage={defaultImages.defaultUserImage}
                      preTitle={user.displayName || user.userName}
                      title={
                        <h3 className="text-lg">
                          {(userInterview.interview as Interview).name}
                        </h3>
                      }
                      imageClassName="w-11 h-11 sm:w-24 sm:h-24"
                    />
                    <div className="flex flex-row flex-wrap gap-2">
                      <InternalLink
                        newTab={true}
                        href={`/interview/${
                          (userInterview.badge as Badge).seo.slug
                        }/edit/${
                          (userInterview.interview as Interview).seo.slug
                        }`}
                        element={<GentleButton text="Edit interview" />}
                      />
                      <InternalLink
                        newTab={true}
                        element={<GentleButton text="View" />}
                        href={`/interview/${
                          (userInterview.badge as Badge).seo.slug
                        }/${user.seo.slug}/${
                          (userInterview.interview as Interview).seo.slug
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div>
                <span>
                  Looks like you didn&apos;t answer any interviews yet
                </span>
              </div>
            )}
          </div>
        </WideBox>
        <WideBox className="p-3 sm:p-5">
          <div className="flex flex-col gap-5 w-full">
            <h2 className="smallCaps">Interviews available to you</h2>
            {availableInterviewsNotTaken.length > 0 ? (
              <ul className="flex flex-col gap-5 w-full">
                {availableInterviewsNotTaken.map((item, index) => {
                  const interview = item.interview as Interview;
                  const interviewHasAnswers =
                    interview.userInterviews?.length > 0;

                  const badge = item.badge as Badge;
                  const article = getArticle(
                    (interview.badge as Badge).singularName
                  );
                  return (
                    <li key={index}>
                      <div key={index} className="flex flex-col gap-3">
                        <ImageAndText
                          image={
                            (badge.seo?.image as Media)?.filename ||
                            defaultImages.defaultBadgeImage
                          }
                          defaultImage={defaultImages.defaultInterviewImage}
                          imageClassName="w-11 h-11 sm:w-24 sm:h-24"
                          preTitle={`As ${article} ${badge.singularName}`}
                          title={<h3 className="text-lg">{interview.name}</h3>}
                        />
                        <div className="flex flex-row flex-wrap gap-2">
                          <InternalLink
                            newTab={true}
                            href={`/interview/${badge.seo.slug}/edit/${interview.seo.slug}`}
                            element={<GentleButton text="Take interview" />}
                          />
                          {interviewHasAnswers && (
                            <InternalLink
                              newTab={true}
                              element={<GentleButton text="View" />}
                              href={`/interview/${badge.seo.slug}/all/${interview.seo.slug}`}
                            />
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-col gap-5">
                <span>
                  Looks like you don&apos;t have any available interviews now
                </span>
                <InternalLink
                  href={"/?tab=badges"}
                  style="blue"
                  element={
                    <span>Apply to badges so you can take more interviews</span>
                  }
                />
              </div>
            )}
          </div>
        </WideBox>
      </div>
      <div className="sticky z-10 top-2 h-max flex-col gap-2 hidden lg:flex w-[30%]">
        <WideBox className="p-3 sm:p-5">
          <div className="flex flex-row flex-wrap gap-2">
            <GentleButton
              className={`border border-tl-dark-blue ${
                (activeTab == "profile" || activeTab == null) &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
              text={<>{profileIcon(20)} Profile</>}
              onClick={() => {
                handleTabSelect("profile");
              }}
            />
            <GentleButton
              className={`border border-tl-dark-blue ${
                activeTab == "badgers" &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
              text={<>{badgeIcon(20)} Badges</>}
              onClick={() => {
                handleTabSelect("badges");
              }}
            />
            <GentleButton
              className={`border border-tl-dark-blue ${
                activeTab == "interviews" &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
              text={<>{interviewIcon(20)} Interviews</>}
              onClick={() => {
                handleTabSelect("interviews");
              }}
            />
          </div>
        </WideBox>
      </div>
    </div>
  );
};
