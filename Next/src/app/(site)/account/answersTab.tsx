import { WideBox } from "@/components/ui/boxes";
import { useAuth } from "../../../providers/Auth/Auth";
import { InternalLink } from "@/components/links/InternalLink";
import {
  Question,
  Answer as AnswerType,
  User,
  Media,
} from "@/payload/payload-types";
import { ImageAndText } from "@/components/elements/ImageAndText";
import { formatDistanceToNow } from "date-fns";
import { defaultImages } from "@/utils/defaultImages";
import Answer from "@/components/Answer";

export const AnswersTab = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] w-full">
      <div className="lg:w-[70%] flex flex-col w-full gap-3">
        {user.answerCount < 1 ? (
          <WideBox className="p-3 sm:p-5">
            <div>This user answered no questions yet</div>
          </WideBox>
        ) : (
          user.answers.map((item: AnswerType, index) => {
            const questionObject = item.question as Question;

            return (
              <WideBox className="p-5 w-full" key={index}>
                <div className="flex flex-col gap-5 w-full">
                  <div className="flex flex-col gap-5 w-full pb-5 sm:pt-5  border-b">
                    <InternalLink
                      href={`/question/${questionObject.path}`}
                      style="blue-hover"
                      element={
                        <ImageAndText
                          title={
                            <h2 className="text-base md:text-3xl hover:text-tl-light-blue md:ml-11">
                              {questionObject.question}
                            </h2>
                          }
                          alt={""}
                          imageClassName="w-11 h-11"
                        />
                      }
                    />

                    <div className="flex flex-col gap-2 md:ml-11">
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
                          style="blue-hover"
                          element={
                            <span className="flex flex-row">
                              {questionObject.answers.length} answers
                            </span>
                          }
                        />

                        <span className="flex flex-row">
                          {questionObject.upvotesSum} upvotes
                        </span>
                      </div>
                    </div>
                  </div>

                  <ImageAndText
                    alt={`${
                      (item.user as User).displayName ||
                      (item.user as User).userName
                    }
                      }`}
                    preTitle={
                      <div className="flex flex-row gap-1 content-center font-normal text-base">
                        <span className="">
                          {(item.user as User).displayName ||
                            (item.user as User).userName}
                          &nbsp;
                        </span>
                      </div>
                    }
                    image={
                      (user.image as Media)?.filename ||
                      defaultImages.defaultUserImage
                    }
                    defaultImage={defaultImages.defaultUserImage}
                    imageClassName="w-11 h-11"
                  />
                  <Answer
                    key={index}
                    answer={item}
                    alt={`Image uploaded by ${
                      (item.user as User).userName
                    } for the question: ${
                      (item.question as Question).question
                    }`}
                  />
                  <div className="flex flex-row text-sm gap-10 sm:px-5">
                    {item.updatedAt &&
                      formatDistanceToNow(item.updatedAt, {
                        addSuffix: true,
                      })}{" "}
                    <span className="">{item.upvotesSum} upvotes</span>
                  </div>
                </div>
              </WideBox>
            );
          })
        )}
      </div>
    </div>
  );
};
