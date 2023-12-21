import { fetchData } from "@/utils/payloadFetch";
import { homePageRes } from "../../../../types/PageRes";

async function getData() {
  const query = `{
        Interviews {
          docs {
            seo {
              slug
            }
            badge {
              seo {
                slug
              }
            }
            questions {
              question {
                shortQuestion
                seo {
                  slug
                }
                answers {
                  user {
                    seo{image{url}}
                    userName
                    seo {
                      slug
                    }
                  }
                  answer{richText_html video{url} images{image {url}}}
                }
              }
            }
          }
        }
      }
      `;

  const data: homePageRes | null = await fetchData(query, "POST", "Interviews");

  if (!data) {
    return null;
  }

  return data;
}

export default async function Home() {
  const data = await getData();

  return (
    <div className="flex flex-row w-[80%] mx-auto gap-5">
      <div className="flex flex-col w-[70%] border"></div>
      <div className="flex flex-col w-[30%] border">right</div>
    </div>
  );
}
