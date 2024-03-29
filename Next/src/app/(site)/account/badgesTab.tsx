"useClient";

import { TextAreaInput, TextInput } from "@/components/ui/inputs";
import getArticle from "@/helpers/getArticle";
import { Application, Badge, Media } from "@/payload/payload-types";
import { CldImage } from "next-cloudinary";
import { useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { useAuth } from "../../../providers/Auth/Auth";
import { isValidUrl } from "../../../helpers/validateUrl";
import Modal from "@/components/ui/Modal";
import { RemoveBadgeComp } from "@/components/RemoveBadgeComp";
import { InternalLink } from "@/components/links/InternalLink";
import { WideBox } from "@/components/ui/boxes";
import { GentleButton } from "@/components/ui/buttons";
import { badgeIcon, interviewIcon, profileIcon } from "@/utils/defaultIcons";
import { defaultImages } from "@/utils/defaultImages";

const serviceLinkNames = ["one", "two", "three", "four", "five"];
interface BadgesTabProps {
  handleTabSelect: any;
  activeTab: string;
}

export const BadgesTab = ({ handleTabSelect, activeTab }: BadgesTabProps) => {
  const { user, setUser, updateUser } = useAuth();
  const [expandedBadge, setExpandedBadge] = useState(null);
  const [about, setAbout] = useState("");
  const [aboutCurrentValue, setAboutCurrentValue] = useState("");
  const [aboutLength, setAboutLength] = useState(0);
  const [aboutErrorMessage, setAboutErrorMessage] = useState(null);
  const [serviceLinksErrorMessage, setServiceLinksErrorMessage] = useState({});
  const [aboutSaved, setAboutSaved] = useState(false);
  const [serviceLinks, setServiceLinks] = useState({});
  const [serviceLinksCurrent, setServiceLinksCurrent] = useState({});
  const [serviceLinksSaved, setServiceLinksSaved] = useState({});
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const userPendingBadges =
    user?.userApplications && user?.userApplications.length > 0
      ? user.userApplications.filter((item) => {
          return (item as Application).status == "pending";
        })
      : [];

  const handleModalOpen = (slug: string) => {
    setModalIsOpen(true);
    setActiveModal(slug);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
    setActiveModal(null);
  };

  useEffect(() => {
    if (expandedBadge) {
      const newServiceLinks = {};
      const newServiceLinksCurrent = {};
      serviceLinkNames.forEach((name) => {
        newServiceLinks[name] =
          expandedBadge.links[
            `link${name.charAt(0).toUpperCase() + name.slice(1)}`
          ] || "";
        newServiceLinksCurrent[name] = newServiceLinks[name];
      });
      setServiceLinks(newServiceLinks);
      setServiceLinksCurrent(newServiceLinksCurrent);
      setAbout(expandedBadge.bio || "");
      setAboutCurrentValue(expandedBadge.bio || "");
      setAboutLength(expandedBadge.bio?.length || 0);
    }
  }, [expandedBadge]);

  const toggleBadgeExpansion = (userBadge) => {
    if (expandedBadge?.badge?.seo?.slug === userBadge.badge.seo.slug) {
      setExpandedBadge(null);
    } else {
      setExpandedBadge(userBadge);
    }
  };

  const handleAboutBlur = async () => {
    if (about !== aboutCurrentValue) {
      const updatedUserBadges = user.userBadges.map((userBadge) => {
        if (userBadge.id === expandedBadge.id) {
          return { ...userBadge, bio: about };
        }
        return userBadge;
      });
      const res = await updateUser(user, { userBadges: updatedUserBadges });
      if (res) {
        setUser(res);
        setAboutSaved(true);
        setAboutCurrentValue(about);
        setTimeout(() => setAboutSaved(false), 3000);
      } else {
        setAboutErrorMessage("Error: please try again");
      }
    }
  };

  const handleLinkBlur = async (name) => {
    const link = serviceLinks[name];
    const currentLink = serviceLinksCurrent[name];

    if (!isValidUrl(link) && link !== "") {
      setServiceLinksErrorMessage((prev) => ({
        ...prev,
        [name]: "Please enter a valid URL",
      }));
    } else {
      setServiceLinksErrorMessage((prev) => {
        const newState = { ...prev };
        delete newState[name];
        return newState;
      });

      if (link !== currentLink) {
        const updatedUserBadges = user.userBadges.map((userBadge) => {
          if (userBadge.id === expandedBadge.id) {
            const newLinks = {
              ...userBadge.links,
              [`link${name.charAt(0).toUpperCase() + name.slice(1)}`]: link,
            };
            return {
              ...userBadge,
              badge: (userBadge.badge as Badge).id,
              links: newLinks,
            };
          }
          return { ...userBadge, badge: (userBadge.badge as Badge).id };
        });
        const res = await updateUser(user, { userBadges: updatedUserBadges });
        if (res) {
          setUser(res);
          setServiceLinksSaved({ ...serviceLinksSaved, [name]: true });
          setServiceLinksCurrent({ ...serviceLinksCurrent, [name]: link });
          setTimeout(
            () => setServiceLinksSaved({ ...serviceLinksSaved, [name]: false }),
            3000
          );
        }
      }
    }
  };

  const handleLinkChange = (e, name) => {
    const newLink = e.target.value;
    setServiceLinksErrorMessage({});
    setServiceLinksSaved({});
    if (!isValidUrl(newLink) && newLink !== "") {
      setServiceLinksErrorMessage((prev) => ({
        ...prev,
        [name]: "Please enter a valid URL",
      }));
    } else {
      setServiceLinksErrorMessage((prev) => {
        const newState = { ...prev };
        delete newState[name];
        return newState;
      });
    }

    setServiceLinks({ ...serviceLinks, [name]: newLink });
  };

  const handleAboutChange = (e) => {
    const newAbout = e.target.value;
    setAbout(newAbout);
    setAboutLength(newAbout.length);
    setAboutErrorMessage(null);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] w-full">
      <div className="lg:w-[70%] w-full flex flex-col gap-2">
        {userPendingBadges.length > 0 &&
          userPendingBadges.map((item, index) => {
            const badge = (item as Application).badge as Badge;
            return (
              <WideBox
                key={index}
                className="flex flex-col bg-white p-2 lg:px-10 lg:py-3 gap-10 w-full round"
              >
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="flex flex-row items-center content-center gap-3">
                    <CldImage
                      width={200}
                      height={200}
                      src={defaultImages.pending}
                      defaultImage={defaultImages.pending}
                      alt={badge.pluralName}
                      className="h-[50px] w-[50px] sm:w-[70px] sm:h-[70px] cover rounded-full"
                    />
                    <div>
                      <span className=" text-weasker-grey">Badge</span>
                      <h2>{badge.singularName}</h2>
                      <InternalLink
                        newTab={true}
                        style={"blue"}
                        className="hover:underline"
                        href={`/badge/${badge.seo.slug}`}
                        element={
                          <span className="text-xs">Visit Badge Page</span>
                        }
                      />
                    </div>
                  </div>
                  <div className="text-weasker-grey">Pending</div>
                </div>
              </WideBox>
            );
          })}

        {Array.isArray(user.userBadges) && user.userBadges.length > 0 ? (
          user.userBadges.map((item, index) => {
            const isExpanded =
              expandedBadge?.badge.seo?.slug === (item.badge as Badge).seo.slug;
            const article = getArticle((item.badge as Badge).singularName);
            return (
              <WideBox key={index}>
                <WideBox className="flex flex-col bg-white p-2 lg:px-10 lg:py-3  gap-10 w-full round">
                  <div
                    onClick={() => toggleBadgeExpansion(item)}
                    className="flex flex-row justify-between items-center hover:cursor-pointer w-full"
                  >
                    <div className="flex flex-row items-center content-center gap-3">
                      <CldImage
                        width={200}
                        height={200}
                        src={
                          ((item.badge as Badge).seo.image as Media).filename
                        }
                        defaultImage={defaultImages.defaultBadgeImage}
                        alt={(item.badge as Badge).pluralName}
                        className="h-[50px] w-[50px] sm:w-[70px] sm:h-[70px] cover rounded-full border-2 border-weasker-grey"
                      />

                      <div>
                        <span className="text-weasker-grey">Badge</span>

                        <h2>{(item.badge as Badge).singularName}</h2>
                        <InternalLink
                          newTab={true}
                          style={"blue"}
                          className="hover:underline"
                          href={`/badge/${(item.badge as Badge).seo.slug}`}
                          element={
                            <span className="text-xs">Visit Badge Page</span>
                          }
                        />
                      </div>
                    </div>

                    {!isExpanded ? (
                      <div className="text-tl-light-blue">Expand</div>
                    ) : (
                      <div className="text-tl-light-blue">Close</div>
                    )}
                  </div>
                  {isExpanded && (
                    <div className="flex flex-col gap-5 w-full">
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-col w-full gap-1">
                          <TextAreaInput
                            label="About (optional)"
                            labelClassName="text-base"
                            description={
                              <span className="">
                                A brief description of your experience as{" "}
                                {article}
                                &nbsp;
                                <span className="font-bold">
                                  {(item.badge as Badge).singularName}
                                </span>
                              </span>
                            }
                            name="linkOne"
                            className="resize-none h-48 text-sm"
                            placeHolder={about}
                            onChange={handleAboutChange}
                            onBlur={handleAboutBlur}
                            value={about}
                            errorMessage={aboutErrorMessage}
                            maxLength={300}
                            comment={`${300 - aboutLength} characters left`}
                            saved={aboutSaved}
                          />
                        </div>
                      </div>

                      <div className="flex flex-row justify-between">
                        <div className="flex flex-col gap-3 w-full">
                          <label
                            className="text-base font-bold uppercase"
                            htmlFor="links"
                          >
                            Links (optional)
                          </label>
                          <span className="text-weasker-grey text-sm normal-case">
                            Link to your services as {article}&nbsp;
                            <span className="font-bold">
                              {(item.badge as Badge).singularName}
                            </span>
                          </span>

                          {serviceLinkNames.map((name) => (
                            <TextInput
                              key={name}
                              type="text"
                              name={`link-${name}`}
                              label={`LINK ${name.toUpperCase()}`}
                              labelClassName="text-xs"
                              placeHolder={`https://www.example.com/my-service-${name}`}
                              value={serviceLinks[name] || ""}
                              onChange={(e) => handleLinkChange(e, name)}
                              onBlur={() => handleLinkBlur(name)}
                              saved={serviceLinksSaved[name] || false}
                              errorMessage={serviceLinksErrorMessage[name]}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-col w-full">
                          <span className="text-base font-bold">
                            Danger zone
                          </span>
                          <hr />
                          <div className="flex flex-row justify-between mt-2 ">
                            <span className="text-weasker-grey text-sm">
                              Remove badge
                            </span>
                            <div
                              onClick={() => handleModalOpen("remove")}
                              className="flex flex-row gap-1 items-center text-red-600 font-semibold hover:cursor-pointer"
                            >
                              <IoTrashOutline />
                              <span>REMOVE BADGE</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {modalIsOpen && activeModal == "remove" && (
                    <Modal onclick={handleModalClose}>
                      <RemoveBadgeComp
                        userBadges={user.userBadges}
                        removeBadge={expandedBadge}
                      />
                    </Modal>
                  )}
                </WideBox>
              </WideBox>
            );
          })
        ) : (
          <WideBox className="p-3 sm:p-5">
            <>Looks like you don&apos;t have any badges yet</>
            <InternalLink
              href={"/?tab=badges"}
              style={"blue"}
              element={<>View all available badges</>}
            />
          </WideBox>
        )}
      </div>
      <div className="sticky z-10 top-2 h-max flex-col gap-2 hidden lg:flex w-[30%]">
        <WideBox className="p-3 sm:p-5">
          <div className="flex flex-row flex-wrap gap-2">
            <GentleButton
              className={`border border-tl-dark-blue ${
                (activeTab == "profile" || activeTab == null) &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
              text={<>{profileIcon(20)} Profile</>}
              onClick={() => {
                handleTabSelect("profile");
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
                activeTab == "interviews" &&
                "border-tl-light-blue text-tl-light-blue"
              }`}
              text={<>{interviewIcon(20)} Interviews</>}
              onClick={() => {
                handleTabSelect("interviews");
              }}
            />
          </div>
        </WideBox>
      </div>
    </div>
  );
};
