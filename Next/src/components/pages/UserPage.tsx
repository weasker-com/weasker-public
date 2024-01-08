"use client";

import { toSentence } from "@/helpers/toSentence";
import { userPageRes } from "../../../types/Responses";
import { ProfilePage, WithContext } from "schema-dts";
import { defaultImages } from "@/utils/defaultImages";
import ListItem from "../ListItem";
import { InternalLink } from "../links/InternalLink";
import { TbMessageShare } from "react-icons/tb";
import SidebarBox from "../SidebarBox";
import { IoLinkOutline } from "react-icons/io5";
import { PiShareFatThin } from "react-icons/pi";
import SocialShareButtons from "../SocialShareButtons";
import Hero from "../Hero";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { BsFileText, BsUiChecks } from "react-icons/bs";
import SubMenu from "../SubMenu";
import { LiaMicrophoneSolid, LiaUserCheckSolid } from "react-icons/lia";
import Modal from "../Modal";

interface UserPageProps {
  data: userPageRes;
  params: { user: string };
}

const UserPage: React.FC<UserPageProps> = (data) => {
  const params = data.params;
  const user = data.data.data.Users.docs[0];
  const userExcerpt = user.seo.excerpt;
  const badges = user.userBadges;
  const interviews = data.data.data.UserInterviews.docs;
  const userName = user.userName;
  const services = badges.flatMap((badge) => {
    return badge.services.map((service) => {
      return {
        name: service.name,
        url: service.url,
      };
    });
  });

  const badgesSingularNamesArray = user.userBadges.map((item) => {
    return item.badge.singularName;
  });

  const badgesSingularNames = toSentence(badgesSingularNamesArray);
  const pfp = user.seo.image?.filename;

  const jsonLd: WithContext<ProfilePage> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: userName,
      jobTitle: badgesSingularNames,
      image: pfp || defaultImages.defaultUserImage,
      url: `https://www.weasker.com/user/${params.user}`,
      award: badges.map((item) => {
        return `${item.badge.singularName} Badge`;
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        title={userName}
        preTitle={"Badger"}
        image={pfp || defaultImages.defaultUserImage}
        location={"user"}
      />
      <SubMenu>
        <div
          onClick={() => {
            handleTabSelect("badges");
          }}
          className={`flex flex-row items-center sm:gap-1 ${
            (activeTab == "badges" || activeTab == null) && "text-tl-light-blue"
          }`}
        >
          <BsUiChecks /> Badges
        </div>
        <div
          onClick={() => {
            handleTabSelect("interviews");
          }}
          className={`flex flex-row items-center sm:gap-1 ${
            activeTab == "interviews" && "text-tl-light-blue"
          }`}
        >
          <LiaMicrophoneSolid /> interviews
        </div>
        <div
          onClick={() => {
            handleModalOpen("contact");
          }}
          className="flex flex-row items-center sm:gap-1"
        >
          <LiaUserCheckSolid /> Contact
        </div>
        <div
          onClick={() => {
            handleModalOpen("bio");
          }}
          className="flex flex-row items-center sm:gap-1"
        >
          <BsFileText /> Bio
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
      {modalIsOpen && activeModal == "contact" && (
        <Modal onclick={handleModalClose}>
          <SidebarBox
            title={`Contact ${userName}`}
            linkStyle="blue"
            array={badges[0].services.map((item) => {
              return {
                name: item.name,
                url: item.url,
                icon: <IoLinkOutline size={20} />,
                eventName: "ClickQuestionPage",
              };
            })}
          />
        </Modal>
      )}
      {modalIsOpen && activeModal == "bio" && (
        <Modal onclick={handleModalClose}>
          <SidebarBox
            title={user.userName}
            element={<>{userExcerpt || badges[0].bio}</>}
          />
        </Modal>
      )}
      {modalIsOpen && activeModal == "share" && (
        <Modal onclick={handleModalClose}>
          <SidebarBox title={"Share"} element={<SocialShareButtons />} />
        </Modal>
      )}
      {(activeTab == "badges" || activeTab == null) && (
        <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2">
          <div className="lg:w-[70%] flex flex-col">
            {badges.map((item) => {
              return (
                <ListItem
                  location={"user"}
                  name={item.badge.singularName}
                  preTitle={"Badge"}
                  slugs={`/badge/${item.badge.seo.slug}`}
                  image={
                    item.badge.seo.image?.filename ||
                    defaultImages.defaultBadgeImage
                  }
                  excerpt={item.badge.seo.excerpt || item.bio}
                  links={[
                    <InternalLink
                      element={
                        <div className="flex flex-row gap-1 items-center">
                          <TbMessageShare /> <>View badge</>
                        </div>
                      }
                      style={"blue"}
                      href={`/badge/${item.badge.seo.slug}`}
                      eventName={"ClickBadgeName"}
                      target={item.badge.pluralName}
                      locationOnPage={"list item"}
                    />,
                  ]}
                />
              );
            })}
          </div>
          <div className="lg:block hidden w-[30%] text-sm">
            <SidebarBox
              title={user.userName}
              element={<>{userExcerpt || badges[0].bio}</>}
            />
            <SidebarBox
              title={`Contact ${userName}`}
              linkStyle="blue"
              array={badges[0].services.map((item) => {
                return {
                  name: item.name,
                  url: item.url,
                  icon: <IoLinkOutline size={20} />,
                  eventName: "ClickQuestionPage",
                };
              })}
            />
          </div>
        </div>
      )}
      {activeTab == "interviews" && (
        <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2">
          <div className="lg:w-[70%] flex flex-col">
            {interviews.length > 0 ? (
              interviews.map((item) => {
                const threeShortQuestions = item.questions
                  .slice(0, 3)
                  .map((question) => {
                    return ` ${question.question.shortQuestion}`;
                  });
                return (
                  <ListItem
                    location={"user"}
                    name={item.name}
                    preTitle={userName}
                    slugs={`/interview/${item.badge.seo.slug}/${params.user}/${item.seo.slug}`}
                    image={
                      item.seo.image?.filename ||
                      defaultImages.defaultInterviewImage
                    }
                    excerpt={
                      item.seo.excerpt ||
                      `In this interview we asked ${item.badge.pluralName} ${item.questions.length} questions ${item.name}. For example: ${threeShortQuestions}`
                    }
                    links={[
                      <InternalLink
                        element={
                          <div className="flex flex-row gap-1 items-center">
                            <TbMessageShare /> <>Full interview</>
                          </div>
                        }
                        style={"blue"}
                        href={`/interview/${item.badge.seo.slug}/${params.user}/${item.seo.slug}`}
                        eventName={"ClickInterviewPage"}
                        target={item.name}
                        locationOnPage={"list item"}
                      />,
                    ]}
                  />
                );
              })
            ) : (
              <ListItem
                location={"user"}
                name={
                  "looks like this badger didn't answer any interviews yet..."
                }
              />
            )}
          </div>
          <div className="lg:block hidden w-[30%] text-sm">
            <SidebarBox
              title={user.userName}
              element={<>{userExcerpt || badges[0].bio}</>}
            />
            <SidebarBox
              title={`Contact ${userName}`}
              linkStyle="blue"
              array={badges[0].services.map((item) => {
                return {
                  name: item.name,
                  url: item.url,
                  icon: <IoLinkOutline size={20} />,
                  eventName: "ClickQuestionPage",
                };
              })}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UserPage;
