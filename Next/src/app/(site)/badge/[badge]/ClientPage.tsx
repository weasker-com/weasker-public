"use client";

import { useAuth } from "../../../../providers/Auth/Auth";
import SocialShareButtons from "../../../../components/SocialShareButtons";
import Hero from "../../../../components/Hero";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Modal from "../../../../components/ui/Modal";

import {
  badgeIcon,
  badgersIcon,
  pendingIcon,
  shareIcon,
} from "@/utils/defaultIcons";
import { WhiteBox } from "../../../../components/ui/boxes";
import { BigButton, GentleButton } from "../../../../components/ui/buttons";
import BadgeApplyComp from "../../../../components/elements/BadgeApplyComp";
import { Application, Badge, Media, User } from "@/payload/payload-types";
import { InterviewsTab } from "./InterviewsTab";
import { BadgersTab } from "./BadgersTab";
import ContactComp from "@/components/elements/ContactComp";
import { defaultImages } from "@/utils/defaultImages";

interface ClientPageProps {
  data: { data: { Badges: { docs: Badge[] } } };
  params: { badge: string };
}

const ClientPage: React.FC<ClientPageProps> = ({ data, params }) => {
  const badge = data.data.Badges.docs[0];
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsTab: string | null = searchParams.get("tab");
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string | null>(searchParamsTab);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userHasBadge, setUserHasBadge] = useState(false);
  const [userHasPendingApplication, setUserHasPendingApplication] =
    useState(false);
  const [userContact, setUserContact] = useState<User | null>(null);

  useEffect(() => {
    if (
      user &&
      badge.id &&
      user.userBadges.some((item) => {
        return (item.badge as Badge).id == badge.id;
      })
    ) {
      setUserHasBadge(true);
    }
  }, [user, badge.id]);

  useEffect(() => {
    if (
      user &&
      badge.id &&
      user.userApplications?.some((item) => {
        const application = item as Application;
        return (
          (application.badge as Badge).id == badge.id &&
          application.status == "pending"
        );
      })
    ) {
      setUserHasPendingApplication(true);
    }
  }, [user, badge.id]);

  useEffect(() => {
    setActiveTab(searchParamsTab);
  }, [searchParamsTab]);

  const handleTabSelect = (slug: string) => {
    setActiveTab(slug);
    router.push(`${pathname}?tab=${slug}`);
  };
  interface ModalIsOpen {
    slug: string;
    userContactDetails?: User;
  }

  const handleModalOpen = ({ slug, userContactDetails }: ModalIsOpen) => {
    setModalIsOpen(true);
    setActiveModal(slug);
    if (userContactDetails) {
      setUserContact(userContactDetails);
    }
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
    setActiveModal(null);
    setUserContact(null);
  };

  const getCtaButton = () => {
    if (userHasBadge) {
      return <BigButton disabled={true} text={<>Approved {badgeIcon(20)}</>} />;
    } else if (userHasPendingApplication) {
      return (
        <BigButton disabled={true} text={<>Pending {pendingIcon(20)}</>} />
      );
    } else {
      return (
        <BigButton
          disabled={userHasBadge || userHasPendingApplication}
          className="bg-tl-dark-blue"
          text={<>Apply {badgersIcon(20)}</>}
          onClick={() => {
            handleModalOpen({ slug: "apply" });
          }}
        />
      );
    }
  };

  const ctaButtonNew = getCtaButton();

  return (
    <div className="max-h-min">
      <Hero
        title={badge.singularName}
        preTitle={"Badge"}
        image={
          (badge?.seo?.image as Media)?.filename ||
          defaultImages.defaultBadgeImage
        }
        cta={ctaButtonNew}
        about={badge.seo.excerpt}
      />
      {(activeTab == "interviews" || activeTab == null) && (
        <InterviewsTab
          activeTab={activeTab}
          handleTabSelect={handleTabSelect}
          data={badge}
          params={params}
          user={user}
          userHasBadge={userHasBadge}
          handleModalOpen={handleModalOpen}
        />
      )}
      {activeTab == "badgers" && (
        <BadgersTab
          activeTab={activeTab}
          handleTabSelect={handleTabSelect}
          handleModalOpen={handleModalOpen}
          data={badge}
          params={params}
          user={user}
          userHasBadge={userHasBadge}
        />
      )}
      {modalIsOpen && activeModal == "share" && (
        <Modal onclick={handleModalClose}>
          <WhiteBox>
            <SocialShareButtons />
          </WhiteBox>
        </Modal>
      )}
      {modalIsOpen && activeModal == "apply" && (
        <Modal onclick={handleModalClose}>
          <BadgeApplyComp badge={badge} termsText={badge.terms} />
        </Modal>
      )}
      {modalIsOpen && activeModal == "takeInterview" && (
        <Modal onclick={handleModalClose}>
          <BadgeApplyComp
            badge={badge}
            buttonText={"TAKE INTERVIEW NOW"}
            termsText={badge.terms}
          />
        </Modal>
      )}
      {modalIsOpen && activeModal == "contact" && (
        <Modal onclick={handleModalClose}>
          <ContactComp
            user={userContact}
            userName={userContact.displayName || userContact.userName}
            links={
              userContact.userBadges.filter((userBadge) => {
                return (userBadge.badge as Badge).seo.slug == badge.seo.slug;
              })[0].links
            }
          />
        </Modal>
      )}
      <div className="fixed flex flex-col items-center bottom-0 left-0 z-10 h-max lg:hidden w-full py-3 px-1 border-t bg-white mt-2">
        <div className="flex flex-wrap gap-3">
          <GentleButton
            onClick={() => {
              handleTabSelect("interviews");
            }}
            className={`border border-tl-dark-blue ${
              (activeTab == "interviews" || activeTab == null) &&
              "border-tl-light-blue text-tl-light-blue"
            }`}
            text="Interviews"
          />
          <GentleButton
            onClick={() => {
              handleTabSelect("badgers");
            }}
            className={`border border-tl-dark-blue ${
              activeTab == "badgers" &&
              "border-tl-light-blue text-tl-light-blue"
            }`}
            text="Experts"
          />
          <GentleButton
            onClick={() => handleModalOpen({ slug: "share" })}
            className="border border-tl-dark-blue"
            text={<> Share {shareIcon(20)}</>}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
