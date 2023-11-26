import { PortableTextBlock } from "sanity";
import { service } from "./service-type";
import { badge } from "./badge-type";

export type InterviewPage = {
  interview: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
  };
  user: {
    name: string;
    slug: string;
    userBio: PortableTextBlock[];
    pfp: string;
    badges: badge[];
    services: service[];
  };
  questions: {
    number: number;
    question: string;
    mediumQuestion: string;
    slug: string;
    answer: {
      answers: {
        number: number;
        interviewAnswer: PortableTextBlock[];
        images: {
          url: string;
        }[];
        video: any;
      };
      seoTitle: string;
      seoDescription: string;
    };
  }[];

  otherUsers: {
    name: string;
    slug: string;
    pfp: string;
    badgeSlug: string;
  }[];
};
