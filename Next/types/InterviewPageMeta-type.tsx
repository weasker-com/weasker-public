export type InterviewPageMeta = {
  interview: {
    name: string;
    image: string;
    seoTitle: string | null;
    seoDescription: string | null;
    ogImage: string;
    badgeName: string;
    badgeSingularName: string;
  };
  user: {
    name: string;
    pfp: string;
    ogImage: string;
  };
};
