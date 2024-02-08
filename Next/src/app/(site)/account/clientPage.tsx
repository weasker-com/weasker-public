"use client";
import { useAuth } from "../../../providers/Auth/Auth";
import { userPageRes } from "../../../../types/Responses";
import { defaultImages } from "@/utils/defaultImages";
import Hero from "../../../components/Hero";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import SubMenu from "../../../components/SubMenu";
import { LiaMicrophoneSolid } from "react-icons/lia";
import { Media } from "@/payload/payload-types";
import { PiShieldCheckLight } from "react-icons/pi";
import { PiUserCircleGearThin } from "react-icons/pi";
import { ProfileTab } from "@/app/(site)/account/profileTab";
import { BadgesTab } from "@/app/(site)/account/badgesTab";
import { InterviewsTab } from "@/app/(site)/account/interviewsTab";

interface AccountPageProps {
  data: userPageRes;
}

const ClientPage: React.FC<AccountPageProps> = ({ data }) => {
  const { user } = useAuth();
  const userAccount = data.data.Users.docs[0];
  const badges = userAccount.userBadges;
  const interviews = data.data.UserInterviews.docs;
  const userName = userAccount.userName;
  const pfp = (user?.seo?.image as Media)?.filename;
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsTab: string | null = searchParams.get("tab");
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string | null>(searchParamsTab);

  useEffect(() => {
    setActiveTab(searchParamsTab);
  }, [searchParamsTab]);

  const handleTabSelect = (slug: string) => {
    router.push(`${pathname}?tab=${slug}`);
  };

  if (user?.seo?.slug !== userAccount?.seo?.slug) {
    return null;
  }
  return (
    <>
      <Hero
        title={userName}
        preTitle={"Account"}
        image={pfp || defaultImages.defaultUserImage}
        location={"user"}
      />
      <SubMenu>
        <div
          onClick={() => {
            handleTabSelect("profile");
          }}
          className={`flex flex-row items-center gap-1 ${
            (activeTab == "profile" || activeTab == null) &&
            "text-tl-light-blue"
          }`}
        >
          <PiUserCircleGearThin size={20} />
          Profile
        </div>
        <div
          onClick={() => {
            handleTabSelect("badges");
          }}
          className={`flex flex-row items-center gap-1 ${
            activeTab == "badges" && "text-tl-light-blue"
          }`}
        >
          <PiShieldCheckLight size={20} />
          Badges
        </div>
        <div
          onClick={() => {
            handleTabSelect("interviews");
          }}
          className={`flex flex-row items-center gap-1 ${
            activeTab == "interviews" && "text-tl-light-blue"
          }`}
        >
          <LiaMicrophoneSolid size={20} /> interviews
        </div>
      </SubMenu>
      {(activeTab == "profile" || activeTab == null) && <ProfileTab />}
      {activeTab == "badges" && <BadgesTab badges={badges} />}
      {activeTab == "interviews" && <InterviewsTab interviews={interviews} />}
    </>
  );
};

export default ClientPage;
