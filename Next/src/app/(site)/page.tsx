import { fetchData } from "@/utils/payloadFetch";
import { homePageRes } from "../../../types/Responses";
import { notFound } from "next/navigation";
import HomePage from "@/components/pages/HomePage";

async function getData() {
  const query = `{
        Interviews {
          docs {
            name
            seo {
              slug
              excerpt
              image{url filename}
            }
            badge {
              singularName
              pluralName
              seo {
                slug
                image{url filename}
              }
            }
            questions {
              question {
                shortQuestion
                mediumQuestion
                seo {
                  slug
                }
                answers {
                  user {
                    seo{image{url filename}}
                    userName
                    seo {
                      slug
                    }
                  }
                  answer{richText_html video{url filename} images{image {url filename}}}
                }
              }
            }
          }
        }
        Badges {
          docs {
            pluralName
            singularName
            seo{slug image{url filename}}
          }
        }
        Users(where: { roles: { equals: endUser } }){
          docs{
            userName
            seo{slug image{url filename}}
          }
        }
      }
      `;

  const data: homePageRes | null = await fetchData({
    query,
    method: "POST",
    collection: "Interviews",
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

  return <HomePage data={data} />;
}
