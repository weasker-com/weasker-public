"use client";

import { toSentence } from "@/helpers/toSentence";
import { ProfilePage, WithContext } from "schema-dts";
import { defaultImages } from "@/utils/defaultImages";
import SocialShareButtons from "../../../../components/SocialShareButtons";
import Hero from "../../../../components/Hero";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Modal from "../../../../components/ui/Modal";
import { Badge, Media, User } from "@/payload/payload-types";
import { BigButton, GentleButton } from "@/components/ui/buttons";
import { WhiteBox } from "@/components/ui/boxes";
import ContactComp from "@/components/elements/ContactComp";
import { InterviewsTab } from "./InterviewsTab";
import { BadgesTab } from "./BadgesTab";
import { availableAtIcon, shareIcon } from "@/utils/defaultIcons";

interface ClientPageProps {
  params: { user: string };
  data: { data: { Users: { docs: User[] } } } | null;
}

const ClientPage: React.FC<ClientPageProps> = ({ params, data }) => {
  const user = data.data.Users.docs[0];
  const userExcerpt = user.seo.excerpt;
  const badges = user.userBadges;
  const links = user.userBadges[0]?.links || {};
  const userName = user.userName;
  const badgesSingularNamesArray = user.userBadges.map((item) => {
    return (item.badge as Badge).singularName;
  });

  const badgesSingularNames = toSentence(badgesSingularNamesArray);
  const pfp = (user.seo.image as Media)?.filename;

  const jsonLd: WithContext<ProfilePage> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: user.displayName || userName,
      jobTitle: badgesSingularNames,
      image: pfp || defaultImages.defaultUserImage,
      url: `https://www.weasker.com/user/${params.user}`,
      award: badges.map((item) => {
        return `${(item.badge as Badge).singularName} Badge`;
      }),
    },
  };

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

  const ctaButton = (
    <BigButton
      className="bg-tl-dark-blue"
      text={
        <span className="flex flex-row gap-2 items-center">
          {availableAtIcon(20)} Contact
        </span>
      }
      onClick={() => {
        setActiveModal("contact"), setModalIsOpen(true);
      }}
    />
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        title={user.displayName || userName}
        preTitle={"Expert"}
        image={pfp || defaultImages.defaultUserImage}
        about={userExcerpt || badges[0]?.bio}
        cta={ctaButton}
      />
      {(activeTab == "badges" || activeTab == null) && (
        <BadgesTab
          user={user}
          activeTab={activeTab}
          handleTabSelect={handleTabSelect}
          handleModalOpen={handleModalOpen}
        />
      )}
      {activeTab == "interviews" && (
        <InterviewsTab
          user={user}
          activeTab={activeTab}
          handleTabSelect={handleTabSelect}
          handleModalOpen={handleModalOpen}
        />
      )}
      {modalIsOpen && activeModal == "contact" && (
        <Modal onclick={handleModalClose}>
          <ContactComp
            user={user}
            userName={user.displayName || userName}
            links={links}
          />
        </Modal>
      )}
      {modalIsOpen && activeModal == "share" && (
        <Modal onclick={handleModalClose}>
          <WhiteBox>
            <SocialShareButtons />
          </WhiteBox>
        </Modal>
      )}
      <div className="fixed flex flex-col items-center bottom-0 left-0 z-10 h-max lg:hidden w-full py-3 px-1 border-t bg-white mt-2">
        <div className="flex flex-wrap gap-3">
          <GentleButton
            onClick={() => {
              handleTabSelect("interviews");
            }}
            className={`border border-tl-dark-blue ${
              activeTab == "interviews" &&
              "border-tl-light-blue text-tl-light-blue"
            }`}
            text="Interviews"
          />
          <GentleButton
            onClick={() => {
              handleTabSelect("badges");
            }}
            className={`border border-tl-dark-blue ${
              (activeTab == "badges" || activeTab == null) &&
              "border-tl-light-blue text-tl-light-blue"
            }`}
            text="Badges"
          />
          <GentleButton
            onClick={() => handleModalOpen("share")}
            className="border border-tl-dark-blue"
            text={<> Share {shareIcon(20)}</>}
          />
        </div>
      </div>
    </>
  );
};

export default ClientPage;
