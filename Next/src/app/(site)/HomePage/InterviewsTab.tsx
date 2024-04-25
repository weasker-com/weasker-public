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
import {
  badgeIcon,
  interviewIcon,
  shareIcon,
  usersIcon,
} from "@/utils/defaultIcons";
import { defaultImages } from "@/utils/defaultImages";

interface BadgesTabProps {
  handleTabSelect: any;
  activeTab: string;
  handleModalOpen: any;
  data: Interview[];
}

export const InterviewsTab = ({
  handleTabSelect,
  activeTab,
  handleModalOpen,
  data,
}: BadgesTabProps) => {
  const answeredInterviews = data.filter((item) => {
    return (
      item.userInterviews &&
      item.userInterviews?.length > 0 &&
      item?.userInterviews.some((userInterview) => {
        return (userInterview as UsersInterview).answersAmount > 0;
      })
    );
  });

  return (
    <div className="flex flex-col lg:flex-row lg:w-[1000px] mx-auto gap-3 space-between mt-2">
      <div className="flex flex-col lg:w-[70%] h-min gap-2">
        <WideBox className="p-5 sm:p-10">
          <div className="text-5xl smallCaps font-black">Interviews</div>
        </WideBox>
        {answeredInterviews.map((interview, index) => {
          const badge = interview.badge as Badge;
          return (
            <InternalLink
              key={index}
              href={`/interview/${badge.seo.slug}/all/${interview.seo.slug}`}
              element={
                <WideBox className="transition-shadow ease-in-out duration-300 p-5 hover:shadow-tl-dark-blue">
                  <div className="w-full">
                    <ImageAndText
                      image={(interview.seo.image as Media)?.filename}
                      defaultImage={defaultImages.defaultInterviewImage}
                      imageClassName="w-24 h-24"
                      preTitle={
                        <h2 className="lg:text-lg capitalize">
                          {interview.userInterviews.length} {interview.name}
                        </h2>
                      }
                      title={
                        <div className="flex flex-col gap-1 ">
                          <span>{`${interview.questions.length} interview questions `}</span>
                        </div>
                      }
                    />
                  </div>
                </WideBox>
              }
            />
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
                activeTab == "badges" &&
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
