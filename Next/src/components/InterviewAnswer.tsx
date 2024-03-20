import { formatDistanceToNow } from "date-fns";
import {
  Interview,
  Media,
  User,
  UsersInterview,
} from "../payload/payload-types";
import { leftArrowIcon, rightArrowIcon } from "../utils/defaultIcons";
import { ImageAndText } from "./elements/ImageAndText";
import { WideBox } from "./ui/boxes";
import Answer from "./Answer";
import { defaultImages } from "../utils/defaultImages";
import { InternalLink } from "./links/InternalLink";
import { useCallback, useLayoutEffect, useRef } from "react";

function getElementOffset(el: HTMLElement | Element | null) {
  let left = 0;
  let top = 0;

  while (
    el instanceof HTMLElement &&
    !isNaN(el.offsetLeft) &&
    !isNaN(el.offsetTop)
  ) {
    left += el.offsetLeft - el.scrollLeft;
    top += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: top, left: left };
}

export type InterviewAnswerProps = {
  badgeSlug: string;
  badgeName: string;
  currentUser: User;
  relevantAnswers: Array<{
    user: User;
    answer: UsersInterview["answers"][number]["answer"];
  }>;
  questionNumber: number;
  question: Interview["questions"][number];
  // eslint-disable-next-line no-unused-vars
  onChangeUser: (user: User) => void;
  onGoToPrevUser: () => void;
  onGoToNextUser: () => void;
  // eslint-disable-next-line no-unused-vars
  onContactUser: (user: User) => void;
};

const InterviewAnswer = ({
  badgeSlug,
  badgeName,
  currentUser,
  questionNumber,
  relevantAnswers,
  question,
  onChangeUser,
  onGoToPrevUser,
  onGoToNextUser,
  onContactUser,
}: InterviewAnswerProps) => {
  // Keep a ref to the container so we can measure its position on the page
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollPositionRef = useRef<number | undefined>(undefined);
  const lastContainerPositionRef = useRef<number | undefined>(undefined);
  const userChangedAtRef = useRef<number | undefined>(undefined);

  const currentAnswer =
    relevantAnswers.filter(
      (answer) => answer.user.seo.slug === currentUser.seo.slug
    )[0] || relevantAnswers[0];

  // Every time before we change the user, we want to save the scroll position
  // before doing so, so that we can account for the layout shift that happens
  // after all InterviewAnswers rerender
  const savelastScrollPosition = useCallback(() => {
    lastScrollPositionRef.current = document.documentElement.scrollTop;
    lastContainerPositionRef.current = getElementOffset(
      containerRef.current
    ).top;
    userChangedAtRef.current = Date.now();
  }, []);

  useLayoutEffect(() => {
    const lastScrollPosition = lastScrollPositionRef.current;
    const lastScrollPositionSavedAt = userChangedAtRef.current;
    const lastContainerPosition = lastContainerPositionRef.current;
    if (
      typeof lastScrollPosition !== "number" ||
      typeof lastScrollPositionSavedAt !== "number" ||
      typeof lastContainerPosition !== "number"
    ) {
      return;
    }

    // If the user changed than 300ms ago, we don't want to adjust the scroll position
    if (Date.now() - lastScrollPositionSavedAt > 300) {
      return;
    }

    const currentContainerPosition = getElementOffset(containerRef.current).top;

    document.documentElement.scrollTop =
      lastScrollPosition + currentContainerPosition - lastContainerPosition;
  }, [currentUser]);

  return (
    <WideBox className="p-5" id={question.question.seo.slug}>
      <div ref={containerRef} className="flex flex-col gap-5 w-full">
        <div>
          <ImageAndText
            number={questionNumber}
            title={<h2>{question.question.shortQuestion}</h2>}
          />
        </div>
        {relevantAnswers.length > 1 && (
          <div className="relative flex items-center w-full">
            <div
              onClick={() => {
                savelastScrollPosition();
                onGoToPrevUser();
              }}
            >
              {leftArrowIcon(20)}
            </div>
            <div className="flex overflow-x-scroll scrollbar-hide w-full no-scrollbar">
              <div className="flex space-x-2">
                {relevantAnswers.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      savelastScrollPosition();
                      onChangeUser(item.user);
                    }}
                    className="flex-shrink-0"
                  >
                    <ImageAndText
                      imageClassName="w-11 h-11 rounded-full"
                      selected={item.user.seo.slug === currentUser.seo.slug}
                      image={(item.user.seo.image as Media)?.filename}
                      defaultImage={defaultImages.defaultUserImage}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                savelastScrollPosition();
                onGoToNextUser();
              }}
            >
              {rightArrowIcon(20)}
            </div>
          </div>
        )}

        {currentAnswer && (
          <>
            <div>
              <ImageAndText
                image={(currentAnswer.user.seo.image as Media)?.filename}
                defaultImage={defaultImages.defaultUserImage}
                imageClassName="w-11 h-11"
                preTitle={
                  <InternalLink
                    className="hover:underline max-w-max"
                    href={`/user/${currentAnswer.user.seo.slug}`}
                    element={
                      <span>
                        {currentUser.displayName || currentAnswer.user.userName}
                      </span>
                    }
                  />
                }
                title={
                  <span className="text-xs">
                    <InternalLink
                      className="hover:underline"
                      href={`/badge/${badgeSlug}`}
                      element={badgeName}
                    />{" "}
                    &#8226;{" "}
                    {formatDistanceToNow(currentAnswer.answer.updatedAt, {
                      addSuffix: true,
                    })}{" "}
                    &#8226;{" "}
                    <span
                      className="hover:cursor-pointer hover:underline text-tl-light-blue"
                      onClick={() => {
                        onContactUser(currentAnswer.user);
                      }}
                    >
                      Available at
                    </span>
                  </span>
                }
              />
            </div>
            <div>
              <Answer answer={currentAnswer.answer} />
            </div>
          </>
        )}
      </div>
    </WideBox>
  );
};

export default InterviewAnswer;
