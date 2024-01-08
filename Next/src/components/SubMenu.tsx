"use client";
import React from "react";

interface SubMenuProps {
  children: JSX.Element[];
}

const SubMenu: React.FC<SubMenuProps> = ({ children }) => {
  const childElements = React.Children.map(children, (child, index) => {
    return (
      <li
        key={index}
        className={`sm:ml-2 lg:ml-0 sm:gap-1 capitalize 
         ${
           child.props.selected ? "text-tl-light-blue" : "text-[#253C4C]/70"
         }  hover:cursor-pointer hover:text-tl-light-blue`}
      >
        {child}
      </li>
    );
  });

  return (
    <>
      <div className="sticky top-0 z-10 h-max sm:py-5 border-b border-zinc-100 bg-white w-full">
        <ul
          className={`flex flex-row ${
            React.Children.count(children) > 3
              ? "justify-between"
              : "justify-start gap-5"
          } sm:justify-normal sm:gap-5 max-w-[1000px] mx-1 sm:mx-auto text-sm p-2 sm:p-0`}
        >
          {childElements}
        </ul>
      </div>
    </>
  );
};

export default SubMenu;
