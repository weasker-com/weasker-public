"use client";

import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface ModalProps {
  children: React.JSX.Element;
  onclick?: (
    event: React.MouseEvent<HTMLDivElement> | React.MouseEvent<SVGElement>
  ) => void;
}

const Modal: React.FC<ModalProps> = ({ children, onclick }) => {
  return (
    <>
      <div
        className="fixed flex content-center top-0 left-0 w-screen z-10 h-screen bg-black opacity-75 p-auto offset"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          if (onclick) {
            onclick(e);
          }
        }}
      ></div>
      <div className="fixed flex flex-col z-20 w-screen sm:w-[500px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {children}
        <IoIosCloseCircleOutline
          size={30}
          className="absolute right-1 top-1 hover:cursor-pointer"
          onClick={(event: React.MouseEvent<SVGElement>) => {
            if (onclick) {
              onclick(event);
            }
          }}
        />
      </div>
    </>
  );
};

export default Modal;
