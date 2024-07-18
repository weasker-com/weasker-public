import { useAuth } from "../../../providers/Auth/Auth";
import { InternalLink } from "@/components/links/InternalLink";
import { Question, User, Media, Community } from "@/payload/payload-types";
import { ImageAndText } from "@/components/elements/ImageAndText";
import { formatDistanceToNow } from "date-fns";
import Hero from "@/components/Hero";
import { WideBox } from "@/components/ui/boxes";
import { badgeIcon } from "@/utils/defaultIcons";

export const QuestionsTab = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] w-full">
      <div className="lg:w-[70%] flex flex-col w-full gap-3">
        <div className="flex flex-col gap-5 w-full">
          {user.questionCount < 1 ? (
            <WideBox className="p-3 sm:p-5">
              <div>You did not ask any questions yet</div>
            </WideBox>
          ) : (
            user.questions.map((item: Question, index) => {
              const questionObject = item;
              return (
                <Hero
                  key={index}
                  title={
                    <ImageAndText
                      image={
                        ((questionObject.user as User).image as Media).filename
                      }
                      alt={`image of ${(questionObject.user as User).userName}`}
                      title={
                        <InternalLink
                          href={`/question/${questionObject.path}`}
                          element={
                            <h2 className="text-base md:text-3xl hover:text-tl-light-blue">
                              {questionObject.question}
                            </h2>
                          }
                        />
                      }
                      imageClassName="w-11 h-11"
                      preTitle={
                        <div
                          className={`flex flex-row gap-2 flex-wrap text-xs font-normal sm:text-sm sm:font-medium text-weasker-grey `}
                        >
                          {questionObject.communities.map(
                            (item: Community, index) => {
                              return (
                                <InternalLink
                                  key={index}
                                  href={`/community/${item.path}`}
                                  element={
                                    <span className="flex flex-row gap-1 items-center hover:text-tl-light-blue">
                                      {badgeIcon(15)} {item.pluralName}
                                    </span>
                                  }
                                />
                              );
                            }
                          )}
                          &nbsp;
                        </div>
                      }
                    />
                  }
                  longTitle={true}
                  about={
                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-normal">
                        {questionObject.description}
                      </div>
                      <div className="text-xs sm:text-sm mt-5 flex flex-row justify-around sm:justify-start sm:gap-7">
                        <span>
                          {formatDistanceToNow(questionObject.updatedAt, {
                            addSuffix: true,
                          })}
                        </span>
                        <InternalLink
                          href={`/question/${questionObject.path}`}
                          element={
                            <span className="flex flex-row hover:text-tl-light-blue">
                              {questionObject.answersSum} answers
                            </span>
                          }
                        />
                        <span className="flex flex-row">
                          {questionObject.upvotesSum} upvotes
                        </span>
                      </div>
                    </div>
                  }
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
