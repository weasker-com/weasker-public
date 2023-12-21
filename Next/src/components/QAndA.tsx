import { PortableTextBlock } from "sanity";
import Question from "./Question";
import Answer from "./Answer";
import { service } from "../../types/service-type";
import { badge } from "../../types/badge-type";

interface qAndA {
  questions: singleQuestion[];
  userDetails: userDetailsProps;
  interviewSlug: string;
}

interface singleQuestion {
  number: number;
  question: string;
  slug: string;
  answer: {
    answers: {
      number: number;
      interviewAnswer: string;
      images:
        | {
            image: { url: string };
          }[]
        | [];
      video: any;
      otherUsersAmount: number;
    };
    seoTitle: string;
    seoDescription: string;
  };
}

interface userDetailsProps {
  name: string;
  userBio: string;
  slug: string;
  services: service[];
  pfp: string | null;
  singularName: string;
  badgeSlug: string;
}

const QAndA: React.FC<qAndA> = ({ questions, userDetails, interviewSlug }) => {
  return questions
    .filter((item) => item.answer.answers)
    .sort((a, b) => a.number - b.number)
    .map((item, index) => (
      <div key={index} id={item.slug} className="flex flex-col gap-8">
        <Question slug={item.slug} text={item.question} id={index + 1} />
        <Answer
          text={item.answer.answers!.interviewAnswer}
          images={item.answer.answers.images}
          user={userDetails}
          questionSlug={item.slug}
          question={false}
          interviewSlug={interviewSlug}
          otherUsersAmount={item.answer.answers.otherUsersAmount}
        />
      </div>
    ));
};

export default QAndA;
