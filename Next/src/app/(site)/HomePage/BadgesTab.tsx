import { ImageAndText } from "@/components/elements/ImageAndText";
import { InternalLink } from "@/components/links/InternalLink";
import { WideBox } from "@/components/ui/boxes";
import { GentleButton } from "@/components/ui/buttons";
import { Badge, Media } from "@/payload/payload-types";
import {
  badgeIcon,
  interviewIcon,
  shareIcon,
  usersIcon,
} from "@/utils/defaultIcons";

interface BadgesTabProps {
  handleTabSelect: any;
  activeTab: string;
  handleModalOpen: any;
  data: Badge[];
}

export const BadgesTab = ({
  data,
  handleTabSelect,
  activeTab,
  handleModalOpen,
}: BadgesTabProps) => {
  const curatedBadges = data.sort((a, b) => b.users.length - a.users.length);

  return (
    <div className="flex flex-col lg:flex-row gap-3 max-w-[1000px] w-full mt-2">
      <div className="lg:w-[70%] flex flex-col w-full gap-2">
        <WideBox className="p-5 sm:p-10">
          <div className="text-5xl smallCaps font-black">Badges</div>
        </WideBox>
        <WideBox className="p-5 flex flex-row">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {curatedBadges.map((item, index) => {
              return (
                <InternalLink
                  className="w-full"
                  key={index}
                  href={`/badge/${item.seo.slug}`}
                  element={
                    <div className="transition-shadow ease-in-out duration-300 flex flex-col items-start shadow rounded rounded-t-lg p-2 sm:p-4 w-full hover:shadow-tl-dark-blue">
                      <ImageAndText
                        image={(item.seo.image as Media).filename}
                        imageClassName="w-11 h-11 sm:w-24 sm:h-24"
                        preTitle={<h2>{item.pluralName}</h2>}
                        title={
                          <div className="flex flex-row gap-1">
                            {item?.users?.length > 0 && (
                              <span className="text-sm">
                                {item.users.length} Experts
                              </span>
                            )}
                          </div>
                        }
                      />
                    </div>
                  }
                />
              );
            })}
          </div>
        </WideBox>
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
                activeTab == "badges" &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
              text={<>{badgeIcon(20)} Badges</>}
              onClick={() => {
                handleTabSelect("badges");
              }}
            />
            <GentleButton
              className={`border border-tl-dark-blue ${
                activeTab == "users" &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
              text={<>{usersIcon(20)} Experts</>}
              onClick={() => {
                handleTabSelect("users");
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
