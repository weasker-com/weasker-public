export type QuestionPageMeta = {
  questionDetails: {
    question: string;
    longQuestion: string;
    shortQuestion: string;
    seoTitle: string | null;
    seoDescription: string | null;
  };
  interviewDetails: {
    ogImage: string;
    badge: {
      name: string;
      singularName: string;
      ogImage: string;
    };
  };
  answersAmount: number;
  usersDetails: {
    name: string;
    slug: string;
  }[];
};
