import capitalize from "@/helpers/capitalize";
import { Metadata } from "next";
import { fetchData } from "@/utils/payloadFetch";
import { notFound } from "next/navigation";
import InterviewPage from "./InterviewPage";
import InterviewAllPage from "./InterviewAllPage";

import {
  Badge,
  Interview as InterviewType,
  Media,
  User,
  UsersInterview,
} from "@/payload/payload-types";
import { EditInterview } from "./EditInterview";
import { getMeUser } from "@/utils/getMeUser";
import NoAuth from "@/components/NoAuth";
import { defaultImages } from "@/utils/defaultImages";

type Props = {
  params: { badge: string; user: string; interview: string };
};

type EditInterviewProps = {
  params: { badge: string; user: string; interview: string };
  user: User;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = `{
    UsersInterviews(where: {
        AND: [
          {
            badgeSlug: {equals:"${params.badge}"},
          },
          {
            interviewSlug: {equals:"${params.interview}"},
          },
        ],
      },) {
      docs {
        id
        userSlug
        user{
          id
          userName
           seo {
          slug
          excerpt
          image {
            filename
            url
          }
        }
           userBadges {
          links{linkOne linkTwo linkThree linkFour linkFive}
          bio
          badge {
            singularName
            pluralName
            seo{
              slug
            }
          }
        }
        }
        badge {
          singularName
          pluralName
        }
        interview{
        name
        id
        badge {
          id
          singularName
          pluralName
          seo {
            slug
            image {
              filename
              url
            }
          }
        }
        seo {
          slug
          image {
            filename
            url
          }
        }
        questions {
          question {
            shortQuestion
            mediumQuestion
            longQuestion
            seo{slug image{url filename}}
            seo {
              slug
            }
          }
        }
      }
      answers {
        answer {
          updatedAt
          questionSlug
          images {
            image {
              filename
            }
          }
          textAnswer
          video{filename url}
        }
      }
      }
    }
  }`;

  const data: { data: { UsersInterviews: { docs: UsersInterview[] } } } | null =
    await fetchData({
      query,
      method: "POST",
      collection: "UsersInterviews",
      mustHave: ["UsersInterviews"],
    });

  if (!data) {
    return {};
  }

  const interview = data.data.UsersInterviews.docs[0]
    .interview as InterviewType;
  const badge = data.data.UsersInterviews.docs[0].badge as Badge;
  const usersInterviews = data.data.UsersInterviews.docs;

  const slugA = params.badge;
  const slugB = params.user;
  const slugC = params.interview;

  if (params.user == "edit") {
    return {};
  }

  const slugsToKeywords = interview.questions
    .map((item) => item.question.seo.slug.replace(/-/g, " "))
    .join(", ");

  if (params.user == "all") {
    const metaTitle =
      usersInterviews.length > 1
        ? capitalize(`${usersInterviews.length} ${interview.name}`)
        : capitalize(`${interview.name}`);

    const metaDescription = `${badge.pluralName} ${slugsToKeywords}`;

    const authors = usersInterviews.map((item) => {
      return {
        name: (item.user as User).displayName || (item.user as User).userName,
        url: `https://www.weasker.com/user/${(item.user as User).seo.slug}`,
      };
    });

    const ogImage = `${process.env.SITE_URL}/api/og?img=${
      (interview.seo.image as Media).url
    }&title=${metaTitle}`;

    return {
      title: metaTitle,
      description: metaDescription,
      authors: authors,
      openGraph: {
        images: [ogImage],
        type: "website",
        url: `https://www.weasker.com/interview/${slugA}/${slugB}/${slugC}/`,
        title: metaTitle,
        description: metaDescription,
        siteName: process.env.SITE_NAME,
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        siteId: "1743914690978164736",
        creator: process.env.SITE_NAME,
        creatorId: "1743914690978164736",
        images: [ogImage],
      },
    };
  } else {
    const relevantInterview = usersInterviews.filter((item) => {
      return item.userSlug == params.user;
    })[0];

    const user = relevantInterview?.user as User;

    if (!user) {
      return {};
    }

    const metaTitle = capitalize(
      `${user.displayName || user.userName}: ${interview.name}`
    );

    const metaDescription =
      user.seo.excerpt ||
      `${badge.singularName} ${
        user.displayName || user.userName
      } about ${slugsToKeywords}`;

    const authors = usersInterviews.map((item) => {
      return {
        name: (item.user as User).displayName || (item.user as User).userName,
        url: `https://www.weasker.com/user/${(item.user as User).seo.slug}`,
      };
    });

    const ogImage = `${process.env.SITE_URL}/api/og?img=${
      (interview.seo.image as Media).url
    }&title=${metaTitle}&smallImg=${
      (user.seo.image as Media)?.url || defaultImages.defaultUserImage
    }`;

    return {
      title: metaTitle,
      description: metaDescription,
      authors: authors,
      alternates: {
        canonical: `https://www.weasker.com/interview/${slugA}/all/${slugC}`,
      },
      openGraph: {
        images: [ogImage],
        type: "website",
        url: `https://www.weasker.com/interview/${slugA}/${slugB}/${slugC}/`,
        title: metaTitle,
        description: metaDescription,
        siteName: process.env.SITE_NAME,
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        siteId: "1743914690978164736",
        creator: process.env.SITE_NAME,
        creatorId: "1743914690978164736",
        images: [ogImage],
      },
    };
  }
}

async function getDataAllInterviews({ params }: Props) {
  const query = `{
    Interviews
    (
      where: { seo__slug: { equals:"${params.interview}" } }
    ) 
      {
      docs {
          name
          id
          badge {
            terms
            id
            singularName
            pluralName
            seo {
              slug
              image {
                filename
                url
              }
            }
          }
          seo {
            slug
            image {
              filename
              url
            }
          }
          questions {
            question {
              shortQuestion
              mediumQuestion
              longQuestion
              seo {
                slug
                image {
                  url
                  filename
                }
              }
              seo {
                slug
              }
            }
          }
        }
    }
    UsersInterviews(
      limit: 100
      where: {
        AND: [
          {
            badgeSlug: {equals:"${params.badge}"},
          },
          {
            interviewSlug: {equals:"${params.interview}"},
          },
        ],
      },) {
      docs {
        id
        user{
          id
          userName
           seo {
          slug
          image {
            filename
            url
          }
        }
           userBadges {
          links{linkOne linkTwo linkThree linkFour linkFive}
          bio
          badge {
            terms
            singularName
            seo{
              slug
            }
          }
        }
        }
      answers {
        answer {
          updatedAt
          questionSlug
          images {
            image {
              filename
            }
          }
          textAnswer
          video{filename url}
        }
      }
      }
    }
  }`;

  const data: {
    data: {
      Interviews: { docs: InterviewType[] };
      UsersInterviews: { docs: UsersInterview[] };
    };
  } | null = await fetchData({
    query: query,
    method: "POST",
    collection: "UsersInterviews",
    // mustHave: ["Interviews"],
  });

  if (!data) {
    return null;
  }
  return data;
}

async function getDataSingleInterview({ params }: Props) {
  const query = `{
    UsersInterviews(where: {
        AND: [
          {
            userSlug: {equals:"${params.user}"},
          },
          {
            interviewSlug: {equals:"${params.interview}"},
          },
          {
            badgeSlug: {equals:"${params.badge}"},
          },
        ],
      },) {
      docs {
        answersAmount
        id
        user{
          id
          userName
           seo {
          slug
          image {
            filename
            url
          }
        }
           userBadges {
          links{linkOne linkTwo linkThree linkFour linkFive}
          bio
          badge {
            terms
            singularName
            seo{
              slug
            }
          }
        }
        }
        interview{
        name
        id
        badge {
          terms
          id
          singularName
          pluralName
          seo {
            slug
            image {
              filename
              url
            }
          }
        }
        seo {
          slug
          image {
            filename
            url
          }
        }
        questions {
          question {
            shortQuestion
            mediumQuestion
            longQuestion
            seo{slug image{url filename}}
            seo {
              slug
            }
          }
        }
      }
      answers {
        answer {
          updatedAt
          questionSlug
          images {
            image {
              filename
            }
          }
          textAnswer
          video{filename url}
        }
      }
      }
    }
  }`;

  const data: { data: { UsersInterviews: { docs: UsersInterview[] } } } | null =
    await fetchData({
      query: query,
      method: "POST",
      collection: "UsersInterviews",
      mustHave: ["UsersInterviews"],
    });

  if (!data) {
    return null;
  }
  return data;
}

async function getUser() {
  const data = await getMeUser();
  if (!data) {
    return null;
  }
  return data;
}

async function getDataEditInterview({ params, user }: EditInterviewProps) {
  const query = `{
    UsersInterviews(where: {
        AND: [
          {
            userSlug: {equals:"${user.seo.slug}"},
          },
          {
            interviewSlug: {equals:"${params.interview}"},
          },
          {
            badgeSlug: {equals:"${params.badge}"},
          },
        ],
      },) {
      docs {
        id
        user{
          id
          userName
           seo {
          slug
          excerpt
          image {
            filename
            url
          }
        }
           userBadges {
          links{linkOne linkTwo linkThree linkFour linkFive}
          bio
          badge {
            singularName
            seo{
              slug
            }
          }
        }
        }
        interview{
        name
        id
        badge {
          id
          singularName
          pluralName
          seo {
            image {
              filename
              url
            }
          }
        }
        seo {
          slug
          image {
            filename
            url
          }
        }
        questions {
          question {
            shortQuestion
            mediumQuestion
            longQuestion
            seo{slug image{url filename}}
            seo {
              slug
            }
          }
        }
      }
      answers {
        answer {
          updatedAt
          questionSlug
          images {
            image {
              id
              filename
            }
          }
          textAnswer
          video{filename id url}
        }
      }
      }
    }
  }`;

  const data: { data: { UsersInterviews: { docs: UsersInterview[] } } } | null =
    await fetchData({
      query: query,
      method: "POST",
      collection: "UsersInterviews",
      mustHave: ["UsersInterviews"],
    });

  if (!data) {
    return null;
  }
  return data;
}

export default async function Interview({ params }: Props) {
  if (params.user == "all") {
    const data = await getDataAllInterviews({ params });
    if (!data) {
      notFound();
    }
    return <InterviewAllPage data={data} params={params} />;
  }

  if (params.user == "edit") {
    const user = await getUser();
    if (user) {
      const userHasBadge = user.userBadges.some((item) => {
        return (item.badge as Badge).seo.slug == params.badge;
      });
      const userTookInterview = user.userInterviews
        ? user.userInterviews.some((item) => {
            return (item as UsersInterview).interviewSlug == params.interview;
          })
        : false;

      const relevantInterview = user.userBadges.flatMap((item) => {
        return (item.badge as Badge).interviews.filter((interview) => {
          return (interview as InterviewType).seo.slug == params.interview;
        });
      });

      const interviewData = {
        data: {
          UsersInterviews: {
            docs: [
              {
                answers: [],
                id: "65e48ca3ab05da4700df041f",
                interview: relevantInterview[0] as InterviewType,
                user: user,
              },
            ],
          },
        },
      };

      const validBadgeInterview = (
        user.userBadges.find(
          (item) => (item.badge as Badge).seo.slug === params.badge
        )?.badge as Badge
      ).interviews.some(
        (interview) =>
          (interview as InterviewType).seo.slug === params.interview
      );

      if (userTookInterview) {
        const data = await getDataEditInterview({ params, user });
        if (!data) {
          return notFound();
        }
        return (
          <EditInterview
            data={data}
            params={params}
            operation={"update"}
            user={user}
          />
        );
      } else if (userHasBadge && validBadgeInterview) {
        return (
          <EditInterview
            //@ts-ignore
            data={interviewData}
            params={params}
            operation={"create"}
            user={user}
          />
        );
      } else return notFound();
    } else {
      return <NoAuth />;
    }
  }

  const data = await getDataSingleInterview({ params });
  if (!data) {
    notFound();
  }

  const answersAmount = data.data.UsersInterviews.docs[0].answersAmount;

  if (answersAmount < 1) {
    return notFound();
  }

  return <InterviewPage data={data} params={params} />;
}
