import { ImageAndText } from "@/components/elements/ImageAndText";
import { InternalLink } from "@/components/links/InternalLink";
import { WideBox } from "@/components/ui/boxes";
import { GentleButton } from "@/components/ui/buttons";
import { User, Media, Badge } from "@/payload/payload-types";
import {
  badgeIcon,
  interviewIcon,
  shareIcon,
  usersIcon,
} from "@/utils/defaultIcons";
import { defaultImages } from "@/utils/defaultImages";

interface UsersTabProps {
  handleTabSelect: any;
  activeTab: string;
  handleModalOpen: any;
  data: User[];
}

export const UsersTab = ({
  data,
  handleTabSelect,
  activeTab,
  handleModalOpen,
}: UsersTabProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-3 max-w-[1000px] w-full mt-2">
      <div className="lg:w-[70%] flex flex-col w-full gap-2">
        <WideBox className="p-5 sm:p-10">
          <div className="text-5xl smallCaps font-black">Experts</div>
        </WideBox>
        <WideBox className="p-5 flex flex-row">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {data.map((item, index) => {
              return (
                <InternalLink
                  className="w-full"
                  key={index}
                  href={`/user/${item.seo.slug}`}
                  element={
                    <div className="transition-shadow ease-in-out duration-300 flex flex-col items-start shadow rounded rounded-t-lg p-2 sm:p-4 hover:shadow-tl-dark-blue w-full">
                      <ImageAndText
                        image={
                          (item?.seo?.image as Media)?.filename ||
                          defaultImages.defaultUserImage
                        }
                        imageClassName="w-11 h-11 sm:w-24 sm:h-24"
                        preTitle={<h2>{item.displayName || item.userName}</h2>}
                        title={
                          <div className="flex flex-row gap-1">
                            {item.userBadges.length > 0 &&
                              item.userBadges.map((item, index) => {
                                return (
                                  <span key={index} className="text-sm">
                                    {(item.badge as Badge).singularName}
                                  </span>
                                );
                              })}
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
                handleTabSelect("badgers");
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
