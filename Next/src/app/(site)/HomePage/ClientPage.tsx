"use client";

import SocialShareButtons from "../../../components/SocialShareButtons";
import React, { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { WhiteBox } from "../../../components/ui/boxes";
import {
  Badge,
  User,
  Interview,
  UsersInterview,
} from "@/payload/payload-types";
import { BadgesTab } from "./BadgesTab";
import { InterviewsTab } from "./InterviewsTab";
import { UsersTab } from "./UsersTab";
import { GentleButton } from "@/components/ui/buttons";
import {
  badgeIcon,
  badgersIcon,
  interviewIcon,
  shareIcon,
} from "@/utils/defaultIcons";

interface ClientPageProps {
  data: {
    data: {
      Badges: { docs: Badge[] };
      Users: { docs: User[] };
      Interviews: { docs: Interview[] };
      UsersInterviews: { docs: UsersInterview[] };
    };
  } | null;
}

const ClientPage: React.FC<ClientPageProps> = ({ data }) => {
  const interviews = data.data.Interviews.docs;
  const badges = data.data.Badges.docs;
  const users = data.data.Users.docs;
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsTab: string | null = searchParams.get("tab");
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string | null>(searchParamsTab);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    setActiveTab(searchParamsTab);
  }, [searchParamsTab]);

  const handleTabSelect = (slug: string) => {
    setActiveTab(slug);
    router.push(`${pathname}?tab=${slug}`);
  };

  const handleModalOpen = (slug: string) => {
    setModalIsOpen(true);
    setActiveModal(slug);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
    setActiveModal(null);
  };

  return (
    <>
      {(activeTab == "interviews" || activeTab == null) && (
        <InterviewsTab
          activeTab={activeTab}
          handleTabSelect={handleTabSelect}
          handleModalOpen={handleModalOpen}
          data={interviews}
        />
      )}
      {activeTab == "badges" && (
        <BadgesTab
          activeTab={activeTab}
          handleTabSelect={handleTabSelect}
          handleModalOpen={handleModalOpen}
          data={badges}
        />
      )}
      {activeTab == "users" && (
        <UsersTab
          activeTab={activeTab}
          handleTabSelect={handleTabSelect}
          handleModalOpen={handleModalOpen}
          data={users}
        />
      )}
      {modalIsOpen && activeModal == "share" && (
        <Modal onclick={handleModalClose}>
          <WhiteBox>
            <SocialShareButtons />
          </WhiteBox>
        </Modal>
      )}
      <div className="fixed flex flex-col items-center bottom-0 left-0 z-10 h-max lg:hidden w-full py-3 px-1 border-t bg-white mt-2">
        <div className="flex flex-wrap gap-2">
          <GentleButton
            onClick={() => {
              handleTabSelect("interviews");
            }}
            className={`border border-tl-dark-blue ${
              (activeTab == "interviews" || activeTab == null) &&
              "border-tl-light-blue text-tl-light-blue"
            }`}
            text={<> Interviews {interviewIcon(15)}</>}
          />
          <GentleButton
            onClick={() => {
              handleTabSelect("badges");
            }}
            className={`border border-tl-dark-blue ${
              activeTab == "badges" && "border-tl-light-blue text-tl-light-blue"
            }`}
            text={<> Badges {badgeIcon(15)}</>}
          />
          <GentleButton
            onClick={() => {
              handleTabSelect("users");
            }}
            className={`border border-tl-dark-blue ${
              activeTab == "users" && "border-tl-light-blue text-tl-light-blue"
            }`}
            text={<> Experts {badgersIcon(15)}</>}
          />
          <GentleButton
            onClick={() => handleModalOpen("share")}
            className="border border-tl-dark-blue"
            text={<> Share {shareIcon(15)}</>}
          />
        </div>
      </div>
    </>
  );
};

export default ClientPage;
