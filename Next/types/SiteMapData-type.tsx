export type SiteMapData = {
  questions: {
    questionSlug: string;
    badgeSlug: string;
    updated: string;
  }[];
  interviews: {
    userSlug: string;
    badgeSlug: string;
    interviewSlug: string;
    updated: string;
  }[];
  users: {
    userSlug: string;
    updated: string;
  }[];
  badges: {
    badgeSlug: string;
    updated: string;
  }[];
  pages: {
    pageSlug: string;
    updated: string;
  }[];
};
