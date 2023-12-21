import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { PortableTextBlock } from "sanity";
import { service } from "../../types/service-type";
import { badge } from "../../types/badge-type";
import { InternalLink } from "./links/InternalLink";
import ExternalLink from "./links/ExternalLink";
import parse from "html-react-parser";
import { defaultImages } from "@/utils/defaultImages";

interface AnswerProps {
  interviewSlug: string;
  question: boolean;
  text: string;
  images:
    | {
        image: { url: string };
      }[]
    | [];
  questionSlug: string;
  otherUsersAmount: number;
  user: {
    name: string;
    slug: string;
    services: service[];
    pfp: string | null;
    singularName: string;
    badgeSlug: string;
  };
}

const Answer: React.FC<AnswerProps> = ({
  text,
  images,
  questionSlug,
  user,
  question,
  interviewSlug,
  otherUsersAmount,
}) => {
  return (
    <div
      className="flex flex-col gap-3 pb-10 border rounded-[7px] mb-5 p-5 shadow-md"
      id={user.slug}
    >
      <div className="flex flex-row gap-3 sm:gap-5 items-center">
        <InternalLink
          element={
            <Image
              width={50}
              height={50}
              src={user.pfp || defaultImages.defaultUserImage}
              alt={user.name}
              className="rounded-full"
              style={{ objectFit: "cover", width: "50px", height: "50px" }}
            />
          }
          href={`/user/${user.slug}`}
          eventName="ClickUserImage"
          target={user.name}
          locationOnPage={question ? user.name : questionSlug}
        />
        <div className="flex flex-col">
          <span className="text-base sm:text-xl font-semibold">
            <InternalLink
              href={`/user/${user.slug}`}
              element={user.name}
              eventName="ClickUserName"
              target={user.name}
              className="text-tl-dark-blue"
              locationOnPage={question ? user.name : questionSlug}
            />
          </span>
          <span className="flex flex-row text-sm sm:text-base font-normal">
            <InternalLink
              href={`/badge/${user.badgeSlug}`}
              element={user.singularName}
              eventName="ClickBadgeName"
              className="text-tl-dark-blue"
              target={user.singularName}
              locationOnPage={question ? user.name : questionSlug}
            />
            &nbsp;at&nbsp;
            <ExternalLink
              href={user.services[0].url}
              element={user.services[0].name}
              eventName="ClickUserService"
              target={user.services[0].name}
              locationOnPage={question ? user.name : questionSlug}
            />
          </span>
        </div>
      </div>
      <div className="m-auto sm:ml-[70px] font-light flex-col flex gap-5 sm:w-[80%]">
        {parse(text)}
        <div className="flex flex-row gap-2 flex-wrap ">
          {images?.map((image, index) => (
            <ExternalLink
              element={
                <Image
                  key={index}
                  alt={`image by ${user.name} - ${user.singularName}`}
                  width={100}
                  height={100}
                  style={{
                    objectFit: "cover",
                    width: "100px",
                    height: "100px",
                  }}
                  src={image.image.url}
                />
              }
              href={image.image.url}
              eventName="ClickImage"
              target={question ? user.name + index : questionSlug + index}
              locationOnPage={question ? user.name : questionSlug}
            />
          ))}
        </div>
      </div>
      <div className="sm:ml-[70px]">
        {question ? (
          <InternalLink
            element="Read full interview"
            href={`/interview/${user.badgeSlug}/${user.slug}/${interviewSlug}`}
            eventName="ClickInterviewPage"
            target="Read full interview"
            locationOnPage={question ? user.name : questionSlug}
          />
        ) : (
          <InternalLink
            href={`/question/${user.badgeSlug}/${interviewSlug}/${questionSlug}`}
            element={`Read ${otherUsersAmount}
            ${otherUsersAmount == 1 ? "other answer" : "other answers"}`}
            eventName="ClickReadMoreAnswers"
            target="Read more answers"
            locationOnPage={question ? user.name : questionSlug}
          />
        )}
      </div>
    </div>
  );
};

export default Answer;
