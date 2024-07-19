"use client";
import { useAuth } from "../../../providers/Auth/Auth";
import { defaultImages } from "@/utils/defaultImages";
import Hero from "../../../components/Hero";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Media } from "@/payload/payload-types";
import { internalLinkIcon } from "@/utils/defaultIcons";
import { SettingsTab } from "./settingsTab";
import { InternalLink } from "@/components/links/InternalLink";
import NoAuth from "@/components/NoAuth";
import { CommunitiesTab } from "./communitiesTab";
import { AnswersTab } from "./answersTab";
import { QuestionsTab } from "./questionsTab";

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

  return (
    <>
      <Hero
        alt={userName}
        title={userName}
        preTitle={"Account"}
        image={pfp || defaultImages.defaultUserImage}
        about={
          <div className="text-xs sm:text-sm mt-5 flex flex-row flex-wrap gap-3 sm:justify-start sm:gap-7">
            <span
              onClick={() => {
                handleTabSelect("settings");
              }}
              className={`flex flex-row hover:cursor-pointer ${
                (activeTab == "settings" || activeTab == null) &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
            >
              settings
            </span>
            <span
              onClick={() => {
                handleTabSelect("communities");
              }}
              className={`flex flex-row hover:cursor-pointer ${
                activeTab == "communities" &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
            >
              {user.communityCount} communities
            </span>
            <span
              onClick={() => {
                handleTabSelect("questions");
              }}
              className={`flex flex-row hover:cursor-pointer ${
                activeTab == "questions" &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
            >
              {user.questionCount} questions
            </span>
            <span
              onClick={() => {
                handleTabSelect("answers");
              }}
              className={`flex flex-row hover:cursor-pointer ${
                activeTab == "answers" &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
            >
              {user.answerCount} answers
            </span>
            <InternalLink
              href={`/user/${user.path}`}
              newTab={true}
              element={
                <span className="flex flex-row gap-1 items-center">
                  view profile {internalLinkIcon(15)}
                </span>
              }
            />
          </div>
        }
      />

      {(activeTab == "settings" || activeTab == null) && <SettingsTab />}
      {activeTab == "communities" && <CommunitiesTab />}
      {activeTab == "questions" && <QuestionsTab />}
      {activeTab == "answers" && <AnswersTab />}
    </>
  );
};

export default ClientPage;
