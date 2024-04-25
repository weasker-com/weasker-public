import { LiaMicrophoneSolid } from "react-icons/lia";
import {
  PiShareFatThin,
  PiShieldCheckLight,
  PiSignOut,
  PiUsersThreeLight,
} from "react-icons/pi";
import { PiUserCircleGearThin } from "react-icons/pi";
import { LiaUserCheckSolid } from "react-icons/lia";
import { PiQuestionThin } from "react-icons/pi";
import { PiChatTeardropTextLight } from "react-icons/pi";
import { PiTextAlignLeftThin } from "react-icons/pi";
import { PiArrowSquareIn } from "react-icons/pi";
import { FaCheckCircle } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { IoImageOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { VscSaveAs } from "react-icons/vsc";
import { BiMessageSquareError } from "react-icons/bi";
import { GrLanguage } from "react-icons/gr";
import { FaExternalLinkAlt } from "react-icons/fa";
import { SlClock } from "react-icons/sl";

export const badgeIcon = (size: number) => <PiShieldCheckLight size={size} />;
export const interviewIcon = (size: number) => (
  <LiaMicrophoneSolid size={size} />
);
export const profileIcon = (size: number) => (
  <PiUserCircleGearThin size={size} />
);

export const badgersIcon = (size: number) => <LiaUserCheckSolid size={size} />;
export const questionsIcon = (size: number) => <PiQuestionThin size={size} />;
export const usersIcon = (size: number) => <PiUsersThreeLight size={size} />;
export const shareIcon = (size: number) => <PiShareFatThin size={size} />;
export const contactIcon = (size: number) => (
  <PiChatTeardropTextLight size={size} />
);

export const answerIcon = (size: number) => <PiTextAlignLeftThin size={size} />;

export const externalLinkIcon = (size: number) => (
  <FaExternalLinkAlt size={size} />
);

export const internalLinkIcon = (size: number) => (
  <PiArrowSquareIn size={size} />
);

export const successIcon = (size: number, className?: string) => (
  <FaCheckCircle size={size} className={`${className}`} />
);

export const editIcon = (size: number, className?: string) => (
  <FiEdit3 size={size} className={`${className}`} />
);

export const logoutIcon = (size: number, className?: string) => (
  <PiSignOut size={size} className={`${className}`} />
);

export const videoIcon = (size: number, className?: string) => (
  <MdOutlineVideoLibrary size={size} className={`${className}`} />
);

export const imageIcon = (size: number, className?: string) => (
  <IoImageOutline size={size} className={`${className}`} />
);

export const closeIcon = (size: number, className?: string) => (
  <IoCloseOutline size={size} className={`${className}`} />
);

export const rightArrowIcon = (size: number, className?: string) => (
  <MdKeyboardArrowRight size={size} className={`${className}`} />
);

export const leftArrowIcon = (size: number, className?: string) => (
  <MdKeyboardArrowLeft size={size} className={`${className}`} />
);

export const notSavedIcon = (size: number, className?: string) => (
  <VscSaveAs size={size} className={`${className}`} />
);

export const infoIcon = (size: number, className?: string) => (
  <BiMessageSquareError size={size} className={`${className}`} />
);

export const availableAtIcon = (size: number, className?: string) => (
  <GrLanguage size={size} className={`${className}`} />
);

export const pendingIcon = (size: number, className?: string) => (
  <SlClock size={size} className={`${className}`} />
);
