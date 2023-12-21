import HeroHP from "@/components/Hero-hp";
import { Metadata } from "next";
import capitalize from "@/helpers/capitalize";
import { fetchData } from "@/utils/payloadFetch";
import { pageRes, pageSeoRes } from "../../../../types/PageRes";
import parse from "html-react-parser";
import { defaultImages } from "../../../utils/defaultImages";

type Props = {
  params: { page: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = `{
      Pages(where: { seo__slug: { equals: "${params.page}" } }) {
        docs {
          name
          seo {
            title
            description
            image {
              url
            }
            keywords {
              keyword
            }
          }
        }
      }
    }
    `;
  const data: pageSeoRes | null = await fetchData(query, "POST", "Pages");

  if (!data) {
    return {};
  }

  const seoMeta = data.data.Pages.docs[0];
  const pageName = seoMeta.name;
  const image = seoMeta.seo.image;
  const seoTitle = seoMeta.seo.title;
  const seoDescription = seoMeta.seo.description;

  const metaTitle = capitalize(seoTitle ? seoTitle : `${pageName} | weasker`);
  const metaDescription = seoDescription
    ? seoDescription
    : `${capitalize(
        pageName
      )} - We interview experts from all fields and compare their answers, compiling diverse and reliable information`;

  const ogImage = defaultImages.defaultOgImage;
  const slug = params.page;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      images: [ogImage],
      type: "website",
      url: `https://www.weasker.com/${slug}`,
      title: metaTitle,
      description: metaDescription,
      siteName: process.env.SITE_NAME,
    },
  };
}

async function getData(pageSlug: string): Promise<pageRes | null> {
  const query = `{
    Pages(where: { seo__slug: { equals: "${pageSlug}" } }) {
      docs {
        name
        richText_html
        seo {
          title
          description
          excerpt
          image {
            url
          }
          keywords {
            keyword
          }
        }
      }
    }
  }
  `;
  const res: pageRes | null = await fetchData(query, "POST", "Pages");
  return res;
}

export default async function Page({ params }: Props) {
  const pageParam = params.page;
  const data = await getData(pageParam);

  if (!data) {
    return "no page";
  }

  const page = data?.data.Pages.docs[0];
  const title = page.name;
  const excerpt = page.seo.excerpt;
  const content = page.richText_html;

  return (
    <>
      <HeroHP h1a="" h1b={title} excerpt={excerpt} />
      <text className="md:max-w-[60%] mx-auto">
        {content && parse(content)}
      </text>
    </>
  );
}
