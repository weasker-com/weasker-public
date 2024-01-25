"use client";
import { useAuth } from "../../providers/Auth/Auth";
import { toSentence } from "@/helpers/toSentence";
import { userPageRes } from "../../../types/Responses";
import { defaultImages } from "@/utils/defaultImages";
import ListItem from "../ListItem";
import Hero from "../Hero";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { BsUiChecks } from "react-icons/bs";
import SubMenu from "../SubMenu";
import { LiaMicrophoneSolid, LiaUserCheckSolid } from "react-icons/lia";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { CldImage } from "next-cloudinary";
import { Media } from "@/payload/payload-types";
import getArticle from "@/helpers/getArticle";
import { PiShieldCheckLight } from "react-icons/pi";

interface AccountPageProps {
  data: userPageRes;
}

const AccountPage: React.FC<AccountPageProps> = (data) => {
  const { user } = useAuth();
  const userAccount = data.data.data.Users.docs[0];
  const params = userAccount.seo.slug;
  const userExcerpt = userAccount.seo.excerpt;
  const badges = userAccount.userBadges;
  const interviews = data.data.data.UserInterviews.docs;
  const userName = userAccount.userName;
  const services = badges.flatMap((badge) => {
    return badge.services.map((service) => {
      return {
        name: service.name,
        url: service.url,
      };
    });
  });

  const badgesSingularNamesArray = userAccount.userBadges.map((item) => {
    return item.badge.singularName;
  });

  const badgesSingularNames = toSentence(badgesSingularNamesArray);
  const pfp = userAccount.seo.image?.filename;

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsTab: string | null = searchParams.get("tab");
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string | null>(searchParamsTab);
  const [expandedBadge, setExpandedBadge] = useState(null);

  const toggleBadgeExpansion = (badgeSlug: string) => {
    if (expandedBadge === badgeSlug) {
      setExpandedBadge(null);
    } else {
      setExpandedBadge(badgeSlug);
    }
  };

  useEffect(() => {
    setActiveTab(searchParamsTab);
  }, [searchParamsTab]);

  const handleTabSelect = (slug: string) => {
    router.push(`${pathname}?tab=${slug}`);
  };

  if (user?.seo?.slug == userAccount?.seo?.slug)
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
              handleTabSelect("settings");
            }}
            className={`flex flex-row items-center gap-1 ${
              (activeTab == "settings" || activeTab == null) &&
              "text-tl-light-blue"
            }`}
          >
            <IoMdInformationCircleOutline size={20} /> Settings
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
        {(activeTab == "settings" || activeTab == null) && (
          <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2 w-full">
            <div className="flex flex-col w-full bg-white flex-grow p-5 lg:p-10 gap-5">
              <h2 className="text-lg">Settings</h2>
              <div className="flex flex-col gap-10">
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col w-full">
                    <div className="text-base font-bold">Email address</div>
                    <span className="text-weasker-grey text-sm">
                      {user.email}
                    </span>
                  </div>
                  <div className="sm:w-full">
                    <button className="mx-auto border border-tl-light-blue text-tl-light-blue rounded-lg py-2 px-5">
                      Change
                    </button>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col w-full">
                    <div className="text-base font-bold">Change password</div>
                    <span className="text-weasker-grey text-sm">
                      Password must be at least 8 characters long
                    </span>
                  </div>
                  <div className="sm:w-full">
                    <button className="mx-auto border border-tl-light-blue text-tl-light-blue rounded-lg py-2 px-5">
                      Change
                    </button>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col w-full">
                    <label
                      className="text-base font-bold"
                      htmlFor="displayName"
                    >
                      Display name (optional)
                    </label>
                    <span className="text-weasker-grey text-sm">
                      Set a display name. This does not change your username.
                    </span>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      className="text-weasker-grey text-sm border p-2 mt-3"
                      placeholder={"Display name (optional)"}
                    />
                  </div>
                  <div className="flex items-center sm:w-full px-auto"></div>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col w-full">
                    <label
                      className="text-base font-bold"
                      htmlFor="displayName"
                    >
                      About
                    </label>
                    <span className="text-weasker-grey text-sm">
                      A brief description of yourself shown on your profile.
                    </span>
                    <textarea
                      id="displayName"
                      name="displayName"
                      className="text-weasker-grey text-sm border p-2 mt-3"
                      placeholder={
                        "A brief description of yourself shown on your profile."
                      }
                    />
                  </div>
                  <div className="flex items-center sm:w-full px-auto"></div>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col w-full">
                    <label
                      className="text-base font-bold"
                      htmlFor="displayName"
                    >
                      Profile image
                    </label>
                    <span className="text-weasker-grey text-sm">
                      Images must be .png or .jpg format
                    </span>
                    <span className="text-weasker-grey text-sm">
                      Ideal size 400*400 px
                    </span>
                    <div className="border w-full p-2">
                      {(user.seo.image as Media)?.cloudinary?.public_id && (
                        <CldImage
                          width={200}
                          height={200}
                          src={(user.seo.image as Media).cloudinary.public_id}
                          alt={userName}
                          className="w-[100px] h-[100px] cover rounded-full border-2 border-tl-light-blue"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center sm:w-full px-auto"></div>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col w-full">
                    <span className="text-base font-bold">Danger zone</span>
                    <hr />
                    <div className="flex flex-row justify-between mt-2">
                      <span className="text-weasker-grey text-sm">
                        Delete account
                      </span>
                      <div className="flex flex-row gap-1 items-center text-red-600">
                        <IoTrashOutline />
                        <span className="">DELETE ACCOUNT</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center sm:w-full px-auto"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab == "badges" && (
          <div className="flex flex-col sm:flex-row gap-3 lg:max-w-[1000px] mt-2 w-full">
            <div className="w-full flex flex-col gap-2">
              {badges.map((item) => {
                const isExpanded = expandedBadge === item.badge.seo.slug;
                const article = getArticle(item.badge.singularName);
                return (
                  <div className="flex flex-col bg-white mx-2 p-2 lg:px-10 lg:py-3 border gap-10">
                    <div
                      onClick={() => toggleBadgeExpansion(item.badge.seo.slug)}
                      className="flex flex-row justify-between items-center hover:cursor-pointer"
                    >
                      <div className="flex flex-row items-center content-center gap-3">
                        <CldImage
                          width={200}
                          height={200}
                          src={item.badge.seo.image.filename}
                          alt={item.badge.pluralName}
                          className="h-[50px] w-[50px] sm:w-[70px] sm:h-[70px] cover  rounded-full border-2 border-weasker-grey"
                        />

                        <div>
                          <span className=" text-weasker-grey">Badge</span>
                          <h2>{item.badge.singularName}</h2>
                        </div>
                      </div>

                      {!isExpanded ? (
                        <div className="text-tl-light-blue">Expand</div>
                      ) : (
                        <div className="text-tl-light-blue">Close</div>
                      )}
                    </div>
                    {isExpanded && (
                      <div className="flex flex-col gap-5">
                        <div className="flex flex-row justify-between">
                          <div className="flex flex-col w-full gap-1">
                            <label
                              className="text-lg font-bold"
                              htmlFor="displayName"
                            >
                              About (optional)
                            </label>
                            <span className="text-weasker-grey text-sm normal-case">
                              A brief description of your experience as{" "}
                              {article}&nbsp;
                              <span className="font-bold">
                                {item.badge.singularName}
                              </span>
                            </span>
                            <textarea
                              id="displayName"
                              name="displayName"
                              className="text-weasker-grey text-sm border p-2 mt-3"
                            />
                          </div>
                          <div className="flex items-center sm:w-full px-auto"></div>
                        </div>

                        <div className="flex flex-row justify-between">
                          <div className="flex flex-col gap-1 w-full">
                            <label
                              className="text-lg font-bold"
                              htmlFor="displayName"
                            >
                              Services (optional)
                            </label>
                            <span className="text-weasker-grey text-sm normal-case">
                              Link to your services as {article}&nbsp;
                              <span className="font-bold">
                                {item.badge.singularName}
                              </span>
                            </span>
                            <input
                              id="serviceLink"
                              name="serviceLink"
                              className="text-weasker-grey text-sm border p-2 mt-3"
                              placeholder={"https://www.exmple.com/my-gig-1"}
                            />
                            <input
                              id="serviceLink"
                              name="serviceLink"
                              className="text-weasker-grey text-sm border p-2 mt-3"
                              placeholder={"https://www.exmple.com/my-gig-2"}
                            />
                            <input
                              id="serviceLink"
                              name="serviceLink"
                              className="text-weasker-grey text-sm border p-2 mt-3"
                              placeholder={"https://www.exmple.com/my-gig-3"}
                            />
                            <input
                              id="serviceLink"
                              name="serviceLink"
                              className="text-weasker-grey text-sm border p-2 mt-3"
                              placeholder={"https://www.exmple.com/my-gig-4"}
                            />
                            <input
                              id="serviceLink"
                              name="serviceLink"
                              className="text-weasker-grey text-sm border p-2 mt-3"
                              placeholder={"https://www.exmple.com/my-gig-5"}
                            />
                          </div>
                          <div className="flex items-center sm:w-full px-auto"></div>
                        </div>
                        <div className="flex flex-row justify-between">
                          <div className="flex flex-col w-full">
                            <span className="text-base font-bold">
                              Danger zone
                            </span>
                            <hr />
                            <div className="flex flex-row justify-between mt-2">
                              <span className="text-weasker-grey text-sm">
                                Remove badge
                              </span>
                              <div className="flex flex-row gap-1 items-center text-red-600 font-semibold">
                                <IoTrashOutline />
                                <span className="">REMOVE BADGE</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center sm:w-full px-auto"></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {activeTab == "interviews" && (
          <div className="flex flex-col sm:flex-row gap-3 lg:max-w-[1000px] mt-2 w-full mt-2">
            <div className="flex flex-col w-full">
              {interviews.length > 0 ? (
                interviews.map((item) => {
                  return (
                    <div className="flex flex-col bg-white mx-2 p-2 lg:px-10 lg:py-3 border gap-10">
                      <div
                        onClick={() =>
                          toggleBadgeExpansion(item.badge.seo.slug)
                        }
                        className="flex flex-row justify-between items-center hover:cursor-pointer"
                      >
                        <div className="flex flex-row items-center content-center gap-3">
                          <CldImage
                            width={200}
                            height={200}
                            src={item.seo.image.filename}
                            alt={item.name}
                            className="h-[50px] w-[50px] sm:w-[70px] sm:h-[70px] cover  rounded-full border-2 border-weasker-grey"
                          />

                          <div>
                            <span className=" text-weasker-grey">
                              Interview
                            </span>
                            <h2>{item.badge.singularName}</h2>
                          </div>
                        </div>

                        <div className="text-tl-light-blue">Edit</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <ListItem
                  location={"user"}
                  name={"Looks like you didn't answer any interviews yet"}
                />
              )}
            </div>
          </div>
        )}
      </>
    );
};

export default AccountPage;
