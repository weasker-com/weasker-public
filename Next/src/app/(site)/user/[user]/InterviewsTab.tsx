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

interface InterviewsTabProps {
  user: User;
  handleTabSelect: any;
  activeTab: string;
  handleModalOpen: any;
}

export const InterviewsTab = ({
  user,
  handleTabSelect,
  activeTab,
  handleModalOpen,
}: InterviewsTabProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2 w-full">
      <div className="lg:w-[70%] flex flex-col w-full gap-2">
        {user.userInterviews.length > 0 ? (
          user.userInterviews.map((item, index) => {
            const userInterview = item as UsersInterview;
            const interview = (item as UsersInterview).interview as Interview;
            return (
              <WideBox key={index} className="p-5">
                <InternalLink
                  href={`/interview/${
                    (userInterview.badge as Badge).seo.slug
                  }/${user.seo.slug}/${interview.seo.slug}`}
                  element={
                    <ImageAndText
                      preTitle={`Interview with ${user.userName}`}
                      title={<h2>{interview.name}</h2>}
                      image={
                        (interview.seo.image as Media).filename ||
                        defaultImages.defaultInterviewImage
                      }
                      imageClassName="w-11 h-11 sm:w-24 sm:h-24"
                    />
                  }
                />
              </WideBox>
            );
          })
        ) : (
          <WideBox className="p-3 sm:p-5">
            <div>
              Looks like this user didn&apos;t answer any interviews yet...
            </div>
          </WideBox>
        )}
      </div>
      <div className="sticky z-10 top-2 h-max flex-col gap-2 hidden lg:flex w-[30%]">
        <WideBox className="p-3 sm:p-5">
          <div className="flex flex-row flex-wrap gap-2">
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
            <GentleButton
              className={`border border-tl-dark-blue ${
                (activeTab == "badges" || activeTab == null) &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
              text={<>{badgeIcon(20)} Badges</>}
              onClick={() => {
                handleTabSelect("badges");
              }}
            />
            <GentleButton
              className={`border border-tl-dark-blue`}
              text={<>Share {shareIcon(20)}</>}
              onClick={() => {
                handleModalOpen("share");
              }}
            />
          </div>
        </WideBox>
      </div>
    </div>
  );
};
