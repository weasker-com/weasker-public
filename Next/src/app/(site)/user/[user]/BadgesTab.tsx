"use client";

import { ImageAndText } from "@/components/elements/ImageAndText";
import { InternalLink } from "@/components/links/InternalLink";
import { WideBox } from "@/components/ui/boxes";
import { GentleButton } from "@/components/ui/buttons";
import { Badge, Media, User } from "@/payload/payload-types";
import { badgeIcon, interviewIcon, shareIcon } from "@/utils/defaultIcons";
import { defaultImages } from "@/utils/defaultImages";

interface BadgesTabProps {
  user: User;
  handleTabSelect: any;
  activeTab: string;
  handleModalOpen: any;
}

export const BadgesTab = ({
  user,
  handleTabSelect,
  activeTab,
  handleModalOpen,
}: BadgesTabProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2 w-full">
      <div className="lg:w-[70%] flex flex-col w-full gap-2">
        {user.userBadges.length > 0 ? (
          user.userBadges.map((item, index) => {
            const badge = item.badge as Badge;
            return (
              <WideBox key={index} className="p-5">
                <InternalLink
                  href={`/badge/${badge.seo.slug}`}
                  element={
                    <ImageAndText
                      preTitle={<span>Badge</span>}
                      title={<h2>{badge.singularName}</h2>}
                      image={
                        (badge.seo.image as Media).filename ||
                        defaultImages.defaultBadgeImage
                      }
                      defaultImage={defaultImages.defaultBadgeImage}
                      imageClassName="w-11 h-11 sm:w-24 sm:h-24"
                      about={badge.seo.excerpt}
                    />
                  }
                />
              </WideBox>
            );
          })
        ) : (
          <WideBox className="p-3 sm:p-5">
            <div>Looks like this user doesn&apos;t have any badges yet</div>
          </WideBox>
        )}
      </div>
      <div className="lg:block hidden w-[30%] text-sm">
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
