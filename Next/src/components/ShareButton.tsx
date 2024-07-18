"use client";

import { shareIcon } from "@/utils/defaultIcons";
import SocialShareButtons from "./SocialShareButtons";
import { useState } from "react";
import Modal from "./ui/Modal";
import { WhiteBox } from "./ui/boxes";

const ShareButton = () => {
  const handleModalClose = () => {
    setModalIsOpen(false);
  };
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <>
      <span
        className="flex flex-row hover:cursor-pointer hover:text-tl-light-blue"
        onClick={() => setModalIsOpen(true)}
      >
        <>share {shareIcon(20)}</>
      </span>
      {modalIsOpen && (
        <Modal onclick={handleModalClose}>
          <WhiteBox>
            <SocialShareButtons />
          </WhiteBox>
        </Modal>
      )}
    </>
  );
};

export default ShareButton;
