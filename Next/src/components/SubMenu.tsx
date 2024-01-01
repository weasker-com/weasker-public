"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";
import { IoIosCloseCircleOutline } from "react-icons/io";

type HeroProps = {
  location: "badge" | "interview" | "hp" | "question" | "user";
  menu: {
    name: JSX.Element | string;
    slug: string;
    url?: string;
    modal?: JSX.Element;
    tab?: JSX.Element;
  }[];
};

const SubMenu = ({ location, menu }: HeroProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsTab: string | null = searchParams.get("tab");
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<JSX.Element | undefined>(
    menu.find((item) => item.tab)?.tab
  );

  const [slug, setSlug] = useState<string | null>(searchParamsTab);

  const handleTabClick = (slug: string) => {
    router.push(`${pathname}?tab=${slug}`);
    setSlug(slug);
  };

  useEffect(() => {
    if (searchParamsTab) {
      const activeItem = menu.find((item) => item.slug === searchParamsTab);
      if (activeItem) {
        setActiveTab(activeItem.tab);
      }
    }
  }, [searchParamsTab]);

  const [activeModal, setActiveModal] = useState<JSX.Element | null>(
    menu.find((item) => item.modal)?.modal || null
  );

  const handleModalClick = (modal: JSX.Element, slug: string) => {
    setActiveModal(modal);
    setSlug(slug);
  };

  return (
    <>
      <div className="sticky top-0 z-10 h-max sm:py-5 border-b border-zinc-100 bg-white w-full">
        <ul
          className={`flex flex-row ${
            menu.length > 3 ? "justify-between" : "justify-start gap-5"
          } sm:justify-normal sm:gap-5 max-w-[1000px] mx-1 sm:mx-auto text-sm p-2 sm:p-0`}
        >
          {menu.map((item) => {
            return (
              <>
                <li
                  className={`flex flex-row items-center sm:ml-2 lg:ml-0 sm:gap-1 hover:cursor-pointer capitalize ${
                    slug === item.slug
                      ? "text-tl-light-blue"
                      : "text-[#253C4C]/70"
                  }  hover:text-tl-light-blue`}
                  onClick={() => {
                    item.tab && handleTabClick(item.slug);
                    item.modal && handleModalClick(item.modal, item.slug);
                  }}
                >
                  {item.name}
                </li>
                {item.modal && slug == item.slug && (
                  <>
                    <div
                      className="fixed top-0 left-0 w-screen z-10 h-screen bg-black opacity-75"
                      onClick={() => setSlug(searchParamsTab)}
                    ></div>
                    <div className="fixed flex flex-col z-20 min-w-fit min-h-fit inset-y-32 inset-x-8 md:inset-x-48 lg:inset-x-96 ">
                      {activeModal}
                      <IoIosCloseCircleOutline
                        size={30}
                        className="absolute right-1 top-1 hover:cursor-pointer"
                        onClick={() => setSlug(searchParamsTab)}
                      />
                    </div>
                  </>
                )}
              </>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2 mx-auto">
        {(location === "badge" || "user") && activeTab}
      </div>
    </>
  );
};

export default SubMenu;
