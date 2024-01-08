"use client";

import { MdOutlineFormatListBulleted } from "react-icons/md";
import { badgePageRes } from "../../../types/Responses";
import ListItem from "../ListItem";
import { defaultImages } from "@/utils/defaultImages";
import { InternalLink } from "../links/InternalLink";
import { TbMessages } from "react-icons/tb";
import SidebarBox from "../SidebarBox";
import { PiShareFatThin, PiUsersThreeLight } from "react-icons/pi";
import { LiaUserCheckSolid } from "react-icons/lia";
import ExternalLink from "../links/ExternalLink";
import { HiOutlineExternalLink } from "react-icons/hi";
import SocialShareButtons from "../SocialShareButtons";
import Hero from "../Hero";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SubMenu from "../SubMenu";
import Modal from "../Modal";

interface BadgePageProps {
  data: badgePageRes;
  params: { badge: string };
}

const BadgePage: React.FC<BadgePageProps> = (data) => {
  const params = data.params;
  const badge = data.data.data.Badges.docs[0];
  const users = data.data.data.BadgeUsers.docs;
  const questions = data.data.data.BadgeQuestions.docs[0]?.questions;
  const interviewSlug = data.data.data.BadgeQuestions.docs[0]?.seo.slug;
  const singularName = badge.singularName;
  const pluralName = badge.pluralName;
  const excerpt = badge.seo.excerpt;
  const badgeImage = badge.seo.image?.url || null;
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
      <div className="flex flex-col w-full">
        <Hero
          title={singularName}
          preTitle={"Badge"}
          image={badgeImage}
          location={"badge"}
        />
        <SubMenu>
          <div
            onClick={() => {
              handleTabSelect("questions");
            }}
            className={`flex flex-row items-center sm:gap-1 ${
              (activeTab == "questions" || activeTab == null) &&
              "text-tl-light-blue"
            }`}
          >
            <MdOutlineFormatListBulleted /> Questions
          </div>
          <div
            onClick={() => {
              handleTabSelect("users");
            }}
            className={`flex flex-row items-center sm:gap-1 ${
              activeTab == "users" && "text-tl-light-blue"
            }`}
          >
            <PiUsersThreeLight /> users
          </div>
          <div
            onClick={() => {
              handleModalOpen("share");
            }}
            className="flex flex-row items-center sm:gap-1"
          >
            <PiShareFatThin /> Share
          </div>
        </SubMenu>
        {modalIsOpen && activeModal == "share" && (
          <Modal onclick={handleModalClose}>
            <SidebarBox title={"Share"} element={<SocialShareButtons />} />
          </Modal>
        )}
      </div>
      {(activeTab == "questions" || activeTab == null) && (
        <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2">
          <div className="lg:w-[70%] flex flex-col">
            {questions.map((question, index) => {
              return (
                <ListItem
                  key={index}
                  location={"badge"}
                  name={question.question.shortQuestion}
                  preTitle={"Question"}
                  slugs={`/question/${params.badge}/${interviewSlug}/${question.question.seo.slug}`}
                  image={
                    question.question.seo.image?.filename ||
                    data.data.data.BadgeQuestions.docs[0].seo.image?.filename ||
                    defaultImages.defaultQuestionImage
                  }
                  excerpt={question.question.longQuestion}
                  links={[
                    <InternalLink
                      element={
                        <div className="flex flex-row gap-1 items-center">
                          <TbMessages />
                          <>{`${question.question.answers.length} answers`}</>
                        </div>
                      }
                      style={"blue"}
                      href={`/question/${params.badge}/${interviewSlug}/${question.question.seo.slug}`}
                      eventName={"ClickUserName"}
                      target={question.question.shortQuestion}
                      locationOnPage={"list item"}
                    />,
                  ]}
                />
              );
            })}
          </div>
          <div className="lg:block hidden w-[30%] text-sm">
            <SidebarBox
              title={"Badge terms"}
              element={<>{badge.seo.excerpt}</>}
            />
            {users.length > 0 && (
              <SidebarBox
                title={`Top ${pluralName}`}
                array={users.map((item, index) => {
                  return {
                    name: item.userName,
                    url: `/user/${item.seo.slug}`,
                    image:
                      item.seo.image?.filename ||
                      defaultImages.defaultUserImage,
                    eventName: "ClickUserName",
                  };
                })}
                itemsAmount={8}
              />
            )}
          </div>
        </div>
      )}
      {(activeTab == "users" || activeTab == null) && (
        <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2">
          <div className="lg:w-[70%] flex flex-col">
            {users.length > 0 ? (
              users.map((item, index) => {
                const relevantBadge = item.userBadges.filter(
                  (item) => item.badge.seo.slug == params.badge
                )[0];
                return (
                  <ListItem
                    key={index}
                    location={"badge"}
                    name={item.userName}
                    preTitle={"User"}
                    slugs={`/user/${item.seo.slug}`}
                    image={
                      item.seo.image?.filename || defaultImages.defaultUserImage
                    }
                    excerpt={relevantBadge.bio}
                    links={[
                      <InternalLink
                        element={
                          <div className="flex flex-row gap-1 items-center">
                            <LiaUserCheckSolid /> <>Badger page</>
                          </div>
                        }
                        style={"blue"}
                        href={`/user/${item.seo.slug}`}
                        eventName={"ClickUserName"}
                        target={item.userName}
                        locationOnPage={"list item"}
                      />,
                    ].concat(
                      relevantBadge.services.map((item, index) => {
                        return (
                          <ExternalLink
                            key={index}
                            element={
                              <div className="flex flex-row gap-1 items-center">
                                <HiOutlineExternalLink /> <>{item.name}</>
                              </div>
                            }
                            style={"blue"}
                            href={item.url}
                            eventName={"ClickUserService"}
                            target={item.name}
                            locationOnPage={"list item"}
                          />
                        );
                      })
                    )}
                  />
                );
              })
            ) : (
              <ListItem
                name={"Looks like this badge has no users yet..."}
                location={"badge"}
              />
            )}
          </div>
          <div className="lg:block hidden w-[30%] text-sm">
            <SidebarBox
              title={"Badge terms"}
              element={<>{badge.seo.excerpt}</>}
            />
            <SidebarBox
              title={`Questions for ${badge.pluralName}`}
              array={questions.map((item) => {
                return {
                  name: item.question.shortQuestion,
                  url: `/question/${params.badge}/${interviewSlug}/${item.question.seo.slug}`,
                  image:
                    item.question.seo.image?.filename ||
                    data.data.data.BadgeQuestions.docs[0].seo.image?.filename ||
                    defaultImages.defaultUserImage,

                  eventName: "ClickUserName",
                };
              })}
              itemsAmount={8}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BadgePage;
