"useClient";

import ListItem from "@/components/ListItem";
import getArticle from "@/helpers/getArticle";
import { Badge, Media } from "@/payload/payload-types";
import { CldImage } from "next-cloudinary";
import { User } from "payload/auth";
import { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";

interface BadgesTabProps {
  badges: User["userBadges"];
}

export const BadgesTab = ({ badges }: BadgesTabProps) => {
  const [expandedBadge, setExpandedBadge] = useState(null);
  const toggleBadgeExpansion = (badgeSlug: string) => {
    if (expandedBadge === badgeSlug) {
      setExpandedBadge(null);
    } else {
      setExpandedBadge(badgeSlug);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 lg:max-w-[1000px] mt-2 w-full">
      <div className="w-full flex flex-col gap-2">
        {Array.isArray(badges) && badges.length > 0 ? (
          badges.map((item, index) => {
            const isExpanded = expandedBadge === (item.badge as Badge).seo.slug;
            const article = getArticle((item.badge as Badge).singularName);
            return (
              <div
                key={index}
                className="flex flex-col bg-white mx-2 p-2 lg:px-10 lg:py-3 border gap-10"
              >
                <div
                  onClick={() =>
                    toggleBadgeExpansion((item.badge as Badge).seo.slug)
                  }
                  className="flex flex-row justify-between items-center hover:cursor-pointer"
                >
                  <div className="flex flex-row items-center content-center gap-3">
                    <CldImage
                      width={200}
                      height={200}
                      src={((item.badge as Badge).seo.image as Media).filename}
                      alt={(item.badge as Badge).pluralName}
                      className="h-[50px] w-[50px] sm:w-[70px] sm:h-[70px] cover  rounded-full border-2 border-weasker-grey"
                    />

                    <div>
                      <span className=" text-weasker-grey">Badge</span>
                      <h2>{(item.badge as Badge).singularName}</h2>
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
                        <label className="text-lg font-bold" htmlFor="About">
                          About (optional)
                        </label>
                        <span className="text-weasker-grey text-sm normal-case">
                          A brief description of your experience as {article}
                          &nbsp;
                          <span className="font-bold">
                            {(item.badge as Badge).singularName}
                          </span>
                        </span>
                        <textarea
                          id="about"
                          name="about"
                          className="text-weasker-grey text-sm border p-2 mt-3"
                        />
                      </div>
                      <div className="flex items-center sm:w-full px-auto"></div>
                    </div>

                    <div className="flex flex-row justify-between">
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-lg font-bold" htmlFor="services">
                          Services (optional)
                        </label>
                        <span className="text-weasker-grey text-sm normal-case">
                          Link to your services as {article}&nbsp;
                          <span className="font-bold">
                            {(item.badge as Badge).singularName}
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
                        <span className="text-base font-bold">Danger zone</span>
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
          })
        ) : (
          <ListItem
            location={"user"}
            name={"Looks like you don't have any badges yet"}
          />
        )}
      </div>
    </div>
  );
};
