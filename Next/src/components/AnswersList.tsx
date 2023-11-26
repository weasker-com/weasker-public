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
    userBio: PortableTextBlock[];
    services: {
      name: string;
      url: string;
    }[];
    pfp: string;
    badges: badge[];
  };
  answers: {
    interviewAnswer: PortableTextBlock[];
    imagesSchema: {
      url: string;
    }[];
    number: number;
    video?: File;
  }[];
}

const AnswersList: React.FC<AnswersProps> = ({
  answers,
  questionSlug,
  interviewSlug,
}) => {
  return (
    <div>
      {answers.map((item, index) => (
        <Answer
          key={index}
          text={item.answers[0].interviewAnswer}
          images={item.answers[0].imagesSchema}
          questionSlug={questionSlug}
          user={item.user}
          question={true}
          interviewSlug={interviewSlug}
          otherUsersAmount={0}
        />
      ))}
    </div>
  );
};

export default AnswersList;
