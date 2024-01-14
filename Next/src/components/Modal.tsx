"use client";

import { IoIosCloseCircleOutline } from "react-icons/io";

interface ModalProps {
  children: JSX.Element;
  onclick?: (
    event: React.MouseEvent<HTMLDivElement> | React.MouseEvent<SVGElement>
  ) => void;
}

const Modal: React.FC<ModalProps> = ({ children, onclick }) => {
  return (
    <>
      <div
        className="fixed top-0 left-0 w-screen z-10 h-screen bg-black opacity-75"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          if (onclick) {
            onclick(e);
          }
        }}
      ></div>
      <div className="fixed flex flex-col z-20 inset-y-auto inset-x-8 md:inset-x-48 lg:inset-x-96">
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
