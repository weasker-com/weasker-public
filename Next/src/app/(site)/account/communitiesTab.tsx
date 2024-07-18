"useClient";

import { TextAreaInput, TextInput } from "@/components/ui/inputs";
import getArticle from "@/helpers/getArticle";
import { Application, Community, Media } from "@/payload/payload-types";
import { CldImage } from "next-cloudinary";
import { useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { useAuth } from "../../../providers/Auth/Auth";
import { isValidUrl } from "../../../helpers/validateUrl";
import Modal from "@/components/ui/Modal";
import { RemoveCommunityComp } from "@/components/RemoveCommunityComp";
import { InternalLink } from "@/components/links/InternalLink";
import { WideBox } from "@/components/ui/boxes";
import { defaultImages } from "@/utils/defaultImages";

const serviceLinkNames = ["one", "two", "three", "four", "five"];

export const CommunitiesTab = () => {
  const { user, setUser, updateUser } = useAuth();
  const [expandedCommunity, setExpandedCommunity] = useState(null);
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

  const userPendingCommunities =
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
    if (expandedCommunity) {
      const newServiceLinks = {};
      const newServiceLinksCurrent = {};
      serviceLinkNames.forEach((name) => {
        newServiceLinks[name] =
          expandedCommunity.links[
            `link${name.charAt(0).toUpperCase() + name.slice(1)}`
          ] || "";
        newServiceLinksCurrent[name] = newServiceLinks[name];
      });
      setServiceLinks(newServiceLinks);
      setServiceLinksCurrent(newServiceLinksCurrent);
      setAbout(expandedCommunity.bio || "");
      setAboutCurrentValue(expandedCommunity.bio || "");
      setAboutLength(expandedCommunity.bio?.length || 0);
    }
  }, [expandedCommunity]);

  const toggleCommunityExpansion = (userCommunity) => {
    if (expandedCommunity?.community.slug === userCommunity.community.slug) {
      setExpandedCommunity(null);
    } else {
      setExpandedCommunity(userCommunity);
    }
  };

  const handleAboutBlur = async () => {
    if (about !== aboutCurrentValue) {
      const updatedUserCommunities = user.communities.map((community) => {
        if (community.id === expandedCommunity.id) {
          return { ...community, bio: about };
        }
        return community;
      });
      const res = await updateUser(user, {
        communities: updatedUserCommunities,
      });
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
        const updatedUserCommunities = user.communities.map((userCommunity) => {
          if (userCommunity.id === expandedCommunity.id) {
            const newLinks = {
              ...userCommunity.links,
              [`link${name.charAt(0).toUpperCase() + name.slice(1)}`]: link,
            };
            return {
              ...userCommunity,
              community: (userCommunity.community as Community).id,
              links: newLinks,
            };
          }
          return {
            ...userCommunity,
            community: (userCommunity.community as Community).id,
          };
        });
        const res = await updateUser(user, {
          communities: updatedUserCommunities,
        });
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
        {userPendingCommunities.length > 0 &&
          userPendingCommunities.map((item, index) => {
            const community = (item as Application).community as Community;
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
                      src={
                        (community.image as Media).filename ||
                        defaultImages.pending
                      }
                      defaultImage={defaultImages.pending}
                      alt={community.pluralName}
                      className="h-[50px] w-[50px] sm:w-[70px] sm:h-[70px] cover rounded-full"
                    />
                    <div>
                      <span className=" text-weasker-grey">Community</span>
                      <h2>{community.singularName}</h2>
                      <InternalLink
                        newTab={true}
                        style={"blue"}
                        className="hover:underline"
                        href={`/community/${community.path}`}
                        element={
                          <span className="text-xs">Visit Community Page</span>
                        }
                      />
                    </div>
                  </div>
                  <div className="text-weasker-grey">Pending</div>
                </div>
              </WideBox>
            );
          })}

        {Array.isArray(user.communities) && user.communities.length > 0 ? (
          user.communities.map((item, index) => {
            const isExpanded =
              expandedCommunity?.community.slug ===
              (item.community as Community).slug;
            const article = getArticle(
              (item.community as Community).singularName
            );
            return (
              <WideBox key={index}>
                <WideBox className="flex flex-col bg-white p-2 lg:px-10 lg:py-3  gap-10 w-full round">
                  <div
                    onClick={() => toggleCommunityExpansion(item)}
                    className="flex flex-row justify-between items-center hover:cursor-pointer w-full"
                  >
                    <div className="flex flex-row items-center content-center gap-3">
                      <CldImage
                        width={200}
                        height={200}
                        src={
                          ((item.community as Community).image as Media)
                            .filename
                        }
                        defaultImage={defaultImages.defaultCommunityImage}
                        alt={(item.community as Community).pluralName}
                        className="h-[50px] w-[50px] sm:w-[70px] sm:h-[70px] cover rounded-full border-2 border-weasker-grey"
                      />

                      <div>
                        <span className="text-weasker-grey">Community</span>
                        <h2>{(item.community as Community).singularName}</h2>
                        <InternalLink
                          newTab={true}
                          style={"blue"}
                          className="hover:underline"
                          href={`/community/${
                            (item.community as Community).path
                          }`}
                          element={
                            <span className="text-xs">
                              Visit Community Page
                            </span>
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
                                  {(item.community as Community).singularName}
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
                              {(item.community as Community).singularName}
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
                              Remove community
                            </span>
                            <div
                              onClick={() => handleModalOpen("remove")}
                              className="flex flex-row gap-1 items-center text-red-600 font-semibold hover:cursor-pointer"
                            >
                              <IoTrashOutline />
                              <span>REMOVE COMMUNITY</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {modalIsOpen && activeModal == "remove" && (
                    <Modal onclick={handleModalClose}>
                      <RemoveCommunityComp
                        userCommunities={user.communities}
                        removeCommunity={expandedCommunity}
                      />
                    </Modal>
                  )}
                </WideBox>
              </WideBox>
            );
          })
        ) : (
          <WideBox className="p-3 sm:p-5">
            <>No Approved Communities</>
          </WideBox>
        )}
      </div>
    </div>
  );
};
