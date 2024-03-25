"use client";

import { closeIcon } from "../../utils/defaultIcons";
import React from "react";

interface ModalProps {
  children: React.JSX.Element;
  onclick?: (
    // eslint-disable-next-line
    event: React.MouseEvent<HTMLDivElement> | React.MouseEvent<SVGElement>
  ) => void;
}

const Modal: React.FC<ModalProps> = ({ children, onclick }) => {
  return (
    <>
      <div
        className="fixed flex content-center top-0 left-0 w-screen z-20 h-screen bg-black opacity-75 p-auto offset "
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          if (onclick && e.target === e.currentTarget) {
            onclick(e);
          }
        }}
      ></div>
      <div className="fixed flex flex-col z-40 w-screen sm:w-[500px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto max-h-screen">
        {children}
        <div
          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            if (onclick) {
              onclick(event);
            }
          }}
          className="absolute right-6 top-2 hover:cursor-pointer bg-white rounded-full"
        >
          {closeIcon(20)}
        </div>
      </div>
    </>
  );
};

export default Modal;
