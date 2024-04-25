"use client";
import { useAuth } from "../../../providers/Auth/Auth";
import { defaultImages } from "@/utils/defaultImages";
import Hero from "../../../components/Hero";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Media } from "@/payload/payload-types";
import {
  badgeIcon,
  internalLinkIcon,
  interviewIcon,
  profileIcon,
} from "@/utils/defaultIcons";
import { ProfileTab } from "./profileTab";
import { BadgesTab } from "./badgesTab";
import { InterviewsTab } from "./interviewsTab";
import { InternalLink } from "@/components/links/InternalLink";
import { BigButton, GentleButton } from "@/components/ui/buttons";
import NoAuth from "@/components/NoAuth";

interface AccountPageProps {}

const ClientPage: React.FC<AccountPageProps> = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsTab: string | null = searchParams.get("tab");
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string | null>(searchParamsTab);

  useEffect(() => {
    setActiveTab(searchParamsTab);
  }, [searchParamsTab]);

  if (!user) {
    return <NoAuth />;
  }

  const userName = user?.userName;
  const pfp = (user?.seo?.image as Media)?.filename;

  const handleTabSelect = (slug: string) => {
    setActiveTab(slug);
    router.push(`${pathname}?tab=${slug}`);
  };

  const ctaButton = (
    <InternalLink
      href={`/user/${userName}`}
      newTab={true}
      element={
        <BigButton
          className="bg-tl-dark-blue"
          text={
            <div className="flex flex-row gap-1 items-center">
              {`View profile`}
              {internalLinkIcon(20)}
            </div>
          }
        />
      }
    ></InternalLink>
  );

  return (
    <>
      <Hero
        title={userName}
        preTitle={"Account"}
        image={pfp || defaultImages.defaultUserImage}
        about={
          "Here you can edit your profile, view your badges, and edit your interviews"
        }
        cta={ctaButton}
      />

      {(activeTab == "profile" || activeTab == null) && (
        <ProfileTab handleTabSelect={handleTabSelect} activeTab={activeTab} />
      )}
      {activeTab == "badges" && (
        <BadgesTab handleTabSelect={handleTabSelect} activeTab={activeTab} />
      )}
      {activeTab == "interviews" && (
        <InterviewsTab
          handleTabSelect={handleTabSelect}
          activeTab={activeTab}
        />
      )}
      <div className="fixed flex flex-col items-center bottom-0 left-0 z-10 h-max lg:hidden w-full py-3 px-1 border-t bg-white mt-2">
        <div className="flex flex-wrap gap-3">
          <GentleButton
            onClick={() => {
              handleTabSelect("profile");
            }}
            className={`border border-tl-dark-blue ${
              (activeTab == "profile" || activeTab == null) &&
              "border-tl-light-blue text-tl-light-blue"
            }`}
            text={<>{profileIcon(20)} Profile</>}
          />
          <GentleButton
            onClick={() => {
              handleTabSelect("badges");
            }}
            className={`border border-tl-dark-blue ${
              activeTab == "badges" && "border-tl-light-blue text-tl-light-blue"
            }`}
            text={<>{badgeIcon(20)} Badges</>}
          />
          <GentleButton
            onClick={() => {
              handleTabSelect("interviews");
            }}
            className={`border border-tl-dark-blue ${
              activeTab == "interviews" &&
              "border-tl-light-blue text-tl-light-blue"
            }`}
            text={<>{interviewIcon(20)} Interviews</>}
          />
        </div>
      </div>
    </>
  );
};

export default ClientPage;
