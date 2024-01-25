export const revalidate = 0;
import { notFound } from "next/navigation";
import { getMeUser } from "@/utils/getMeUser";
import AccountPage from "@/components/pages/AccountPage";
import { fetchData } from "@/utils/payloadFetch";
import { userPageRes } from "../../../../types/Responses";

async function getData() {
  const data = await getMeUser();
  if (!data) {
    return null;
  }
  return data;
}

async function getUserContent(userSlug: string) {
  const query = `
  {
    Users(where: { seo__slug: { equals: "${userSlug}" } }) {
      docs {
        userName
        id
        seo {
          slug
          title
          description
          excerpt
          image {
            url
            filename
          }
        }
        userBadges {
          bio
          services {
            name
            url
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
        }
      }
    }
    UserInterviews( slug: "${userSlug}"){
      docs{
        name
        seo{slug excerpt image{url filename}}
        badge{pluralName singularName seo{slug}}
        questions{question{shortQuestion}}
    }
    }
  }
  `;

  const data: userPageRes | null = await fetchData({
    query,
    method: "POST",
    collection: "Users",
    mustHave: ["Users"],
  });

  if (!data) {
    return null;
  }
  return data;
}

export default async function Account() {
  const user = await getData();

  if (!user) {
    notFound();
  }

  const userContent = await getUserContent(user.seo.slug);

  if (!userContent) {
    notFound();
  }

  return <AccountPage data={userContent} />;
}
