import Image from "next/image";
import { service } from "../../types/service-type";
import { InternalLink } from "./links/InternalLink";
import ExternalLink from "./links/ExternalLink";
import parse from "html-react-parser";
import { defaultImages } from "@/utils/defaultImages";

interface AnswerProps {
  interviewSlug: string;
  badgeSingularName: string;
  badgePluralName: string;
  badgeSlug: string;
  badgeImage: string | null;
  questionText: string;
  location: "interview" | "hp" | "question";
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
    services: service[] | null;
    pfp: string | null;
  };
}

const Answer: React.FC<AnswerProps> = ({
  text,
  images,
  questionSlug,
  questionText,
  badgeSlug,
  badgeSingularName,
  badgePluralName,
  badgeImage,
  user,
  location,
  interviewSlug,
  otherUsersAmount,
}) => {
  return (
    <div
      className="flex flex-col gap-3 border rounded-[7px] mb-5 shadow-md pb-5"
      id={user.slug}
    >
      {location == "hp" && (
        <>
          <InternalLink
            element={
              <div className="flex flex-col w-full gap-3 rounded-t-lg p-4 bg-gradient-to-r from-[#00453E] to-[#195851]/75">
                {
                  <div className="flex flex-row items-center gap-5">
                    <Image
                      width={50}
                      height={50}
                      src={badgeImage || defaultImages.defaultBadgeImage}
                      alt={user.name}
                      className="rounded-full"
                      style={{
                        objectFit: "cover",
                        width: "50px",
                        height: "50px",
                      }}
                    />
                    <h2 className="flex flex-col text-white">
                      <span className="sm:text-lg font-light">
                        {badgePluralName}
                      </span>
                      <span className="font-semibold">{questionText}</span>
                    </h2>
                  </div>
                }
              </div>
            }
            href={`/question/${badgeSlug}/${interviewSlug}/${questionSlug}`}
            eventName={"ClickQuestionPage"}
            target={questionSlug}
            locationOnPage={questionSlug}
          />
        </>
      )}
      <div className="px-2 md:p-5">
        <InternalLink
          element={
            <div className="relative h-20">
              <div className="absolute left-0 top-0 flex flex-row gap-2 font-bold items-center text-tl-dark-blue">
                <Image
                  width={50}
                  height={50}
                  src={user.pfp || defaultImages.defaultUserImage}
                  alt={user.name}
                  className="rounded-full"
                  style={{
                    objectFit: "cover",
                    width: "50px",
                    height: "50px",
                  }}
                />
                {user.name}
              </div>

              <div className="absolute left-9 top-9 flex flex-row items-center">
                <div className="flex flex-row items-center gap-2">
                  <Image
                    width={30}
                    height={30}
                    src={badgeImage || defaultImages.defaultBadgeImage}
                    alt={user.name}
                    className="rounded-full"
                    style={{
                      objectFit: "cover",
                      width: "30px",
                      height: "30px",
                    }}
                  />
                  {badgeSingularName}
                </div>
                {user.services && (
                  <>
                    &nbsp;at&nbsp;
                    <ExternalLink
                      href={user.services[0].url}
                      element={user.services[0].name}
                      eventName="ClickUserService"
                      target={user.services[0].name}
                      locationOnPage={
                        location == "question" ? user.name : questionSlug
                      }
                    />
                  </>
                )}
              </div>
            </div>
          }
          href={`/user/${user.slug}`}
          eventName="ClickUserImage"
          target={user.name}
          locationOnPage={location == "question" ? user.name : questionSlug}
        />
        <div className="absolute left-9 top-9 flex flex-row items-center">
          {user.services && (
            <>
              &nbsp;at&nbsp;
              <ExternalLink
                href={user.services[0].url}
                element={user.services[0].name}
                eventName="ClickUserService"
                target={user.services[0].name}
                locationOnPage={
                  location == "question" ? user.name : questionSlug
                }
              />
            </>
          )}
        </div>

        <div className="font-light flex-col flex gap-5 px-1 md:px-5">
          <div className={`${location == "hp" && "italic"}`}>{parse(text)}</div>
          {images.length > 0 && (
            <div className="flex flex-row gap-2 flex-wrap">
              {images.map((image, index) => (
                <ExternalLink
                  element={
                    <Image
                      key={index}
                      alt={`image by ${user.name} - ${badgeSingularName}`}
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
                  target={
                    location == "question"
                      ? user.name + index
                      : questionSlug + index
                  }
                  locationOnPage={
                    location == "question" ? user.name : questionSlug
                  }
                />
              ))}
            </div>
          )}
          <div className="text-tl-dark-blue flex flex-row items-center gap-4">
            {location !== "interview" && (
              <>
                <InternalLink
                  element={
                    <span className="text-weasker-grey text-sm">
                      Full interview
                    </span>
                  }
                  href={`/interview/${badgeSlug}/${user.slug}/${interviewSlug}`}
                  eventName="ClickInterviewPage"
                  target="Read full interview"
                  locationOnPage={
                    location == "question" ? user.name : questionSlug
                  }
                />
              </>
            )}
            {location !== "question" && (
              <>
                <div className="mx-2 text-weasker-grey">•</div>
                <InternalLink
                  href={`/question/${badgeSlug}/${interviewSlug}/${questionSlug}`}
                  element={
                    <span className="text-weasker-grey text-sm">
                      {otherUsersAmount}
                      {otherUsersAmount == 1 ? " More answer" : " More answers"}
                    </span>
                  }
                  eventName="ClickReadMoreAnswers"
                  target="Read more answers"
                  locationOnPage={questionSlug}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Answer;
