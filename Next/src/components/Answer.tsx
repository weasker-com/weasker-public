"use client";
import "next-cloudinary/dist/cld-video-player.css";
import parse from "html-react-parser";
import { CldImage, CldVideoPlayer } from "next-cloudinary";
import { InternalLink } from "./links/InternalLink";
import { defaultImages } from "@/utils/defaultImages";
import { TbMessageShare, TbMessages } from "react-icons/tb";
import React, { Dispatch, SetStateAction, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

interface AnswerProps {
  interviewSlug: string;
  index: number;
  badgeSingularName: string;
  badgePluralName: string;
  badgeSlug: string;
  badgeImage: string | null;
  questionText: string;
  answerText: string;
  location: "interview" | "hp" | "question" | "allInterview";
  images:
    | {
        image: { url: string; filename: string };
      }[]
    | [];
  video: { url: string; filename: string } | null;
  questionSlug: string;
  otherUsersAmount: number;
  userName: string;
  userSlug: string;
  services?: { name: string; url: string }[] | [] | null;
  pfp: string | null;
  updatedAt?: string;
  usersImages?: { pfp: string; slug: string }[];
  onClickUserImage?: Dispatch<SetStateAction<string>>;
  chosenUserSlug?: string;
}

const Answer: React.FC<AnswerProps> = ({
  index,
  answerText,
  images,
  questionSlug,
  questionText,
  badgeSlug,
  badgeSingularName,
  badgePluralName,
  badgeImage,
  userName,
  userSlug,
  pfp,
  video,
  location,
  interviewSlug,
  otherUsersAmount,
  updatedAt,
  usersImages,
  onClickUserImage,
  chosenUserSlug,
}) => {
  const [imagesModalOpen, setImagesModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imagesArray, setImagesArray] = useState<
    { image: { url: string; filename: string } }[] | null
  >(null);

  const currentImageIndex = imagesArray?.findIndex((item) => {
    return item.image.filename === currentImage;
  });

  return (
    <>
      <div
        className="flex flex-col mb-2 mx-2 lg:mx-0 border rounded-t border-weasker-light-grey/50"
        id={location == "question" ? userSlug : questionSlug}
      >
        <>
          {location !== "question" && (
            <div className="flex flex-col w-full gap-3 rounded-t p-3 border-b border-weasker-light-grey/50 text-tl-dark-blue bg-white">
              {
                <div className="flex flex-row items-center gap-2 sm:gap-2">
                  {location == "hp" ? (
                    <CldImage
                      width={50}
                      height={50}
                      src={badgeImage || defaultImages.defaultBadgeImage}
                      alt={userName}
                      className="w-[40px] h-[40px] cover rounded-full border-2 border-weasker-grey"
                    />
                  ) : (
                    <div className="w-[40px] max-h-[40px]">
                      <div className="flex flex-row items-center justify-center w-[40px] max-h-[40px] border-2 border-tl-dark-blue rounded-full p-3 text-base text-tl-dark-blue">
                        {index}
                      </div>
                    </div>
                  )}
                  <h2 className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-weasker-grey">
                      Question for&nbsp;
                      <InternalLink
                        element={badgePluralName}
                        href={`/badge/${badgeSlug}`}
                        style="inherit"
                        eventName={"ClickBadgeName"}
                        target={badgePluralName}
                        locationOnPage={"Answer"}
                      />
                      &nbsp;
                    </span>
                    <span className="font-semibold">{questionText}</span>
                  </h2>
                </div>
              }
            </div>
          )}
        </>
        {location == "allInterview" && (
          <div className="flex flex-row gap-2 p-3 border-b border-weasker-light-grey/50 bg-white">
            {usersImages &&
              usersImages.map((item, index) => {
                return (
                  <CldImage
                    onClick={() => onClickUserImage!(item.slug)}
                    key={index}
                    width={80}
                    height={80}
                    src={item.pfp || defaultImages.defaultUserImage}
                    alt={userName}
                    className={`rounded-full cover w-[40px] h-[40px] border-2 border-weasker-grey hover:border-tl-light-blue delay-75 hover:cursor-pointer ${
                      chosenUserSlug == item.slug && "border-tl-light-blue"
                    }`}
                  />
                );
              })}
          </div>
        )}
        <div className="p-3 pb-5 bg-white rounded-t">
          <div className="w-max">
            <InternalLink
              element={
                <div className="">
                  <div className="flex flex-row gap-2 items-center">
                    <CldImage
                      width={80}
                      height={80}
                      src={pfp || defaultImages.defaultUserImage}
                      alt={userName}
                      className="rounded-full cover w-[40px] h-[40px] border-2 border-weasker-grey"
                    />
                    <div className="flex flex-col">
                      <div className="text-tl-dark-blue">{userName}</div>
                      <div className="text-sm text-weasker-grey">
                        {badgeSingularName}
                      </div>
                    </div>
                  </div>
                </div>
              }
              href={`/user/${
                location == "allInterview" ? chosenUserSlug : userSlug
              }`}
              eventName="ClickUserImage"
              target={userName}
              locationOnPage={questionSlug}
            />
          </div>
          <div className="flex-col sm:ml-8 my-2 flex gap-5 px-1 sm:px-5">
            {video && (
              <CldVideoPlayer width="1920" height="1080" src={video.url} />
            )}
            <div className="max-w-[800px]">{parse(answerText)}</div>
            {images.length > 0 && (
              <div className="flex flex-row gap-2 flex-wrap">
                {images.map(
                  (image, index) =>
                    image.image?.filename && (
                      <CldImage
                        onClick={() => {
                          setCurrentImage(image.image.filename);
                          setImagesArray(images);
                          setImagesModalOpen(true);
                        }}
                        key={index}
                        alt={`image by ${userName} - ${badgeSingularName}`}
                        width={200}
                        height={200}
                        className="h-[100px] w-[100px] cover hover:cursor-pointer"
                        src={image.image.filename}
                      />
                    )
                )}
                {imagesModalOpen && currentImage && imagesArray && (
                  <>
                    <div
                      className="fixed top-0 left-0 w-screen z-10 h-screen bg-black opacity-75"
                      onClick={() => setImagesModalOpen(false)}
                    ></div>
                    <div className="fixed flex flex-col items-center z-20 min-w-fit max-h-[100vh] lg:max-h-[90vh] inset-y-[20%] inset-x-[5%] md:inset-x-[10%] md:inset-y-[5%] lg:inset-x-[20%] bg-black p-5 lg:p-10 rounded-t">
                      <CldImage
                        width={1000}
                        height={1000}
                        src={currentImage}
                        alt={"name"}
                        className="h-[100%] w-auto rounded-t"
                      />
                      <IoIosCloseCircleOutline
                        size={20}
                        className="absolute right-1 top-1 sm:right-2 sm:top-2 text-white hover:cursor-pointer"
                        onClick={() => setImagesModalOpen(false)}
                      />
                      {imagesArray.length > 1 && (
                        <FaRegArrowAltCircleRight
                          size={20}
                          className="absolute right-1 sm:right-2 top-1/2 text-white hover:cursor-pointer"
                          onClick={() => {
                            if (currentImageIndex !== undefined) {
                              const nextIndex =
                                (currentImageIndex + 1) % imagesArray.length;
                              setCurrentImage(
                                imagesArray[nextIndex].image.filename
                              );
                            }
                          }}
                        />
                      )}
                      {imagesArray.length > 1 && (
                        <FaRegArrowAltCircleLeft
                          size={20}
                          className="absolute left-1 sm:left-2 top-1/2 text-white hover:cursor-pointer"
                          onClick={() => {
                            if (currentImageIndex !== undefined) {
                              const prevIndex =
                                (currentImageIndex - 1 + imagesArray.length) %
                                imagesArray.length;
                              setCurrentImage(
                                imagesArray[prevIndex].image.filename
                              );
                            }
                          }}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-start sm:items-center text-weasker-grey gap-5">
              {updatedAt && (
                <div className="first-letter:uppercase">
                  {formatDistanceToNow(updatedAt, { addSuffix: true })}
                </div>
              )}
              <div className="flex flex-row gap-5">
                {location !== "interview" && (
                  <>
                    <InternalLink
                      element={
                        <span className="flex flex-row gap-1 items-center">
                          <TbMessageShare />
                          Full interview
                        </span>
                      }
                      href={`/interview/${badgeSlug}/${
                        location == "allInterview" ? chosenUserSlug : userSlug
                      }/${interviewSlug}`}
                      eventName="ClickInterviewPage"
                      target="Read full interview"
                      locationOnPage={questionSlug}
                      style={"blue"}
                    />
                  </>
                )}

                {otherUsersAmount > 0 &&
                  location !== "question" &&
                  location !== "allInterview" && (
                    <div>
                      <InternalLink
                        href={`/question/${badgeSlug}/${interviewSlug}/${questionSlug}`}
                        style={"blue"}
                        element={
                          <span className="flex flex-row gap-1 items-center">
                            <TbMessages />
                            {otherUsersAmount}
                            {otherUsersAmount == 1
                              ? " other answer"
                              : " other answers"}
                          </span>
                        }
                        eventName="ClickReadMoreAnswers"
                        target="Read more answers"
                        locationOnPage={questionSlug}
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Answer;
