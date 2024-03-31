import { ImageAndText } from "@/components/elements/ImageAndText";
import { InternalLink } from "@/components/links/InternalLink";
import { WideBox } from "@/components/ui/boxes";
import { GentleButton } from "@/components/ui/buttons";
import { Badge, Media, User } from "@/payload/payload-types";
import {
  availableAtIcon,
  badgeIcon,
  interviewIcon,
  shareIcon,
} from "@/utils/defaultIcons";
import { defaultImages } from "@/utils/defaultImages";

interface BadgersTabProps {
  handleTabSelect: any;
  activeTab: string;
  handleModalOpen: any;
  data: Badge;
  params: { badge: string };
  user: User;
  userHasBadge: boolean;
}

export const BadgersTab = ({
  data,
  params,
  handleTabSelect,
  activeTab,
  handleModalOpen,
}: BadgersTabProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-3 max-w-[1000px] w-full">
      <div className="lg:w-[70%] flex flex-col gap-2">
        {data.users.length > 0 ? (
          data.users.map((item, index) => {
            const user = item as User;

            const relevantBadge = user.userBadges.filter(
              (item) => (item.badge as Badge)?.seo.slug == params.badge
            )[0];
            return (
              <>
                <WideBox className="p-3 sm:p-5" key={index}>
                  <div className="w-full">
                    <InternalLink
                      href={`/user/${user.seo.slug}`}
                      className="hover: border-tl-light-blue"
                      element={
                        <ImageAndText
                          preTitle={
                            <span className="text-sm text-weasker-grey">
                              {data.singularName}
                            </span>
                          }
                          title={<h2>{user.displayName || user.userName}</h2>}
                          image={(user.seo?.image as Media)?.filename}
                          defaultImage={defaultImages.defaultUserImage}
                          imageClassName="w-11 h-11 sm:w-24 sm:h-24"
                          about={
                            <div className="flex flex-col gap-2 p-1 text-sm">
                              {relevantBadge.bio || user.seo.excerpt}
                            </div>
                          }
                        />
                      }
                    ></InternalLink>
                    <div className="flex flex-row sm:justify-end">
                      <GentleButton
                        className="max-w-max"
                        onClick={() =>
                          handleModalOpen({
                            slug: "contact",
                            userContactDetails: user,
                          })
                        }
                        text={
                          <span className="flex flex-row gap-2 items-center">
                            {availableAtIcon(20)} Contact
                          </span>
                        }
                      />
                    </div>
                  </div>
                </WideBox>
              </>
            );
          })
        ) : (
          <WideBox className="p-3 sm:p-5">
            <div>Looks like this badge has no users yet...</div>
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
                activeTab == "badgers" &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
              text={<>{badgeIcon(20)} Experts</>}
              onClick={() => {
                handleTabSelect("badges");
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
