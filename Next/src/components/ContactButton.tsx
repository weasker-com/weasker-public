"use client";

import { useState } from "react";
import Modal from "./ui/Modal";
import ContactComp from "./elements/ContactComp";
import { User } from "@/payload/payload-types";

interface ContactButtonProps {
  userName: string;
  links: { [key: string]: string | null };
  user: User;
}

const ContactButton = ({ userName, links, user }: ContactButtonProps) => {
  const handleModalClose = () => {
    setModalIsOpen(false);
  };
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <>
      <span
        className="flex flex-row hover:cursor-pointer hover:underline"
        onClick={() => setModalIsOpen(true)}
      >
        <>contact</>
      </span>
      {modalIsOpen && (
        <Modal onclick={handleModalClose}>
          <ContactComp user={user} userName={userName} links={links} />
        </Modal>
      )}
    </>
  );
};

export default ContactButton;
