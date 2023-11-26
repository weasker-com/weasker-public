import { PortableTextBlock } from "sanity";
import { service } from "./service-type";
import { badge } from "./badge-type";

export type QuestionPage = {
  questionDetails: {
    slug: string;
    question: string;
    longQuestion: string;
    shortQuestion: string;
    number: number;
    seoTitle: string;
    seoDescription: string;
  };
  interviewDetails: {
    name: string;
    slug: string;
    image: string;
    ogImage: string;
    badge: badge;
  };
  answersDetails: {
    user: {
      name: string;
      slug: string;
      userBio: PortableTextBlock[];
      pfp: string;
      badges: badge[];
      services: service[];
    };
    answers: {
      interviewAnswer: PortableTextBlock[];
      imagesSchema: {
        url: string;
      }[];
      number: number;
      video?: File;
    }[];
  }[];
  otherQuestions: {
    shortQuestion: string;
    slug: string;
    image: string;
  }[];
};
