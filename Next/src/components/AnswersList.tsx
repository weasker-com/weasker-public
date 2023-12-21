import React from "react";
import Answer from "./Answer";
import { PortableTextBlock } from "sanity";
import { badge } from "../../types/badge-type";

interface AnswersProps {
  answers: singleAnswer[];
  questionSlug: string;
  interviewSlug: string;
}

interface singleAnswer {
  user: {
    name: string;
    slug: string;
    services: {
      name: string;
      url: string;
    }[];
    pfp: string;
    singularName: string;
    badgeSlug: string;
  };
  answer: {
    text: string;
    images:
      | {
          image: { url: string };
        }[]
      | [];
    number: number;
    video: string | null | undefined;
  };
}

const AnswersList: React.FC<AnswersProps> = ({
  answers,
  questionSlug,
  interviewSlug,
}) => {
  return (
    <div>
      {answers.map((item, index) => {
        const answer = item.answer;
        const answerText = answer.text;
        const answerImages = answer.images;
        const user = item.user;

        return (
          <Answer
            key={index}
            text={answerText}
            images={answerImages}
            questionSlug={questionSlug}
            user={user}
            question={true}
            interviewSlug={interviewSlug}
            otherUsersAmount={0}
          />
        );
      })}
    </div>
  );
};

export default AnswersList;
