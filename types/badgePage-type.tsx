import { service } from "./service-type";

export type BadgePage = {
  badgeDetails: {
    name: string;
    singularName: string;
    image: string;
    slug: string;
    excerpt: string;
    seoTitle: string;
    seoDescription: string;
  };
  usersDetails: {
    name: string;
    image: string;
    slug: string;
    services: service[];
  }[];
  questions: {
    shortQuestion: string;
    slug: string;
    image: string;
  }[];
};
