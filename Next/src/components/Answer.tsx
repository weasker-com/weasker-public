"use client";
import parse from "html-react-parser";
import { CldImage, CldVideoPlayer } from "next-cloudinary";
import { InternalLink } from "./links/InternalLink";
import ExternalLink from "./links/ExternalLink";
import { defaultImages } from "@/utils/defaultImages";
import "next-cloudinary/dist/cld-video-player.css";
import { TbMessageShare, TbMessages } from "react-icons/tb";

interface AnswerProps {
  interviewSlug: string;
  index: number;
  badgeSingularName: string;
  badgePluralName: string;
  badgeSlug: string;
  badgeImage: string | null;
  questionText: string;
  answerText: string;
  location: "interview" | "hp" | "question";
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
  services: { name: string; url: string }[] | [] | null;
  pfp: string | null;
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
}) => {
  return (
    <>
      <div
        className="flex flex-col mb-2 mx-2 lg:mx-0 border rounded-t border-weasker-light-grey/50"
        id={location == "question" ? userSlug : questionSlug}
      >
        <>
          {(location == "hp" || location == "interview") && (
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
        <div className="p-3 pb-5 bg-white">
          <div className="w-max">
            <InternalLink
              element={
                <div className="">
                  <div className="flex flex-row gap-2 items-center">
                    <CldImage
                      width={50}
                      height={50}
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
              href={`/user/${userSlug}`}
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
                {images.map((image, index) => (
                  <ExternalLink
                    element={
                      <CldImage
                        key={index}
                        alt={`image by ${userName} - ${badgeSingularName}`}
                        width={200}
                        height={200}
                        style={{
                          objectFit: "cover",
                          width: "100px",
                          height: "100px",
                        }}
                        src={image.image.filename}
                      />
                    }
                    href={image.image.url}
                    eventName="ClickImage"
                    target={questionSlug + index}
                    locationOnPage={questionSlug}
                  />
                ))}
              </div>
            )}
            <div className="flex flex-row items-center text-weasker-grey gap-5">
              {location !== "interview" && (
                <>
                  <InternalLink
                    element={
                      <span className="flex flex-row gap-1 items-center">
                        <TbMessageShare />
                        Full interview
                      </span>
                    }
                    href={`/interview/${badgeSlug}/${userSlug}/${interviewSlug}`}
                    eventName="ClickInterviewPage"
                    target="Read full interview"
                    locationOnPage={questionSlug}
                    style={"blue"}
                  />
                </>
              )}

              {otherUsersAmount > 0 && location !== "question" && (
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
    </>
  );
};

export default Answer;
