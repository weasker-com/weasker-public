import { fetchData } from "@/utils/payloadFetch";
import { notFound } from "next/navigation";
import ClientPage from "./HomePage/ClientPage";
import {
  Badge,
  Interview,
  UsersInterview,
  User,
} from "@/payload/payload-types";

async function getData() {
  const query = `{
    UsersInterviews {
      docs {
        answersAmount
        id
        user {
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
            links {
              linkOne
              linkTwo
              linkThree
              linkFour
              linkFive
            }
            bio
            badge {
              singularName
              seo {
                slug
              }
            }
          }
        }
        interview {
          userInterviews {
            answersAmount
            answers {
              answer {
                textAnswer
              }
            }
          }
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
            video {
              filename
            }
          }
        }
      }
    }
    Interviews(where: { id: { not_equals: "65f6cf1f935129013b4e4c7f" } },limit: 50) {
      docs {
        userInterviews{id answersAmount}
        name
        seo {
          excerpt
          slug
          image {
            url
            filename
          }
        }
        badge {
          pluralName
          singularName
          seo {
            excerpt
            slug
            image {
              url
              filename
            }
          }
        }
        questions {
          question {
            shortQuestion
            seo {
              slug
            }
          }
        }
      }
    }
    Badges(where: { id: { not_equals: "65f6cb63935129013b4e491a" } },limit: 50) {
      limit
      docs {
        users{id}
        interviews {
          id
        }
        pluralName
        singularName
        seo {
          slug
          image {
            url
            filename
          }
        }
      }
    }
    Users(where: { roles: { equals: endUser } }, limit: 50) {
      limit
      docs {
        userInterviews {
          id
        }
        userBadges {
          badge {
            singularName
          }
        }
        userName
        seo {
          slug
          image {
            url
            filename
          }
        }
      }
    }
  }  
      `;

  const data: {
    data: {
      Badges: { docs: Badge[] };
      Users: { docs: User[] };
      Interviews: { docs: Interview[] };
      UsersInterviews: { docs: UsersInterview[] };
    };
  } | null = await fetchData({
    query,
    method: "POST",
    collection: "Interviews",
    cache: true,
  });

  if (!data) {
    return null;
  }

  return data;
}

export default async function Home() {
  const data = await getData();

  if (!data) {
    notFound();
  }

  return <ClientPage data={data} />;
}
