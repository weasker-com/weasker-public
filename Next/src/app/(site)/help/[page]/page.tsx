import { Metadata } from "next";
import capitalize from "@/helpers/capitalize";
import { fetchData } from "@/utils/payloadFetch";
import { defaultImages } from "../../../../utils/defaultImages";
import { notFound } from "next/navigation";
import { Media, Page as PageType } from "@/payload/payload-types";
import HelpPage from "./helpPage";

type Props = {
  params: { page: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = `{
      Pages(
        where: {
          AND: [
            { seo__slug: { equals: "${params.page}" } }
            { category: { equals: help } }
          ]
        }
      ) {
        docs {
          name
          seo {
            title
            description
            image {
              url
              filename
            }
          }
        }
      }
    }
    `;
  const data: { data: { Pages: { docs: PageType[] } } } | null =
    await fetchData({
      query,
      method: "POST",
      collection: "Pages",
      mustHave: ["Pages"],
    });

  if (!data) {
    return {};
  }

  const seoMeta = data.data.Pages.docs[0];
  const pageName = seoMeta.name;
  const image =
    (seoMeta.seo.image as Media)?.url || defaultImages.weaskerLogoUrl;
  const seoTitle = seoMeta.seo.title;
  const seoDescription = seoMeta.seo.description;

  const metaTitle = capitalize(seoTitle ? seoTitle : `${pageName} | weasker`);
  const metaDescription = seoDescription
    ? seoDescription
    : `${capitalize(
        pageName
      )} - We interview experts from all fields and compare their answers, compiling diverse and reliable information`;

  const ogImage = `${process.env.SITE_URL}/api/og?img=${image}&preTitle=${process.env.SITE_NAME}.com&title=${pageName}`;
  const slug = params.page;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      images: [ogImage],
      type: "website",
      url: `https://www.weasker.com/help/${slug}`,
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

async function getData(
  pageSlug: string
): Promise<{ data: { Pages: { docs: PageType[] } } } | null> {
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
        }
      }
    }
  }
  `;
  const res: { data: { Pages: { docs: PageType[] } } } | null = await fetchData(
    {
      query,
      method: "POST",
      collection: "Pages",
      mustHave: ["Pages"],
    }
  );
  return res;
}

export default async function Page({ params }: Props) {
  const pageParam = params.page;
  const data = await getData(pageParam);

  if (!data) {
    notFound();
  }

  return <HelpPage data={data} params={params} />;
}
