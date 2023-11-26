import HeroHP from "@/components/Hero-hp";
import {
  getInnerPage,
  getInnerPageMeta,
} from "../../../../sanity/sanity-utils";
import { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import capitalize from "@/helpers/capitalize";

type Props = {
  params: { page: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = await getInnerPageMeta(params.page);

  const metaTitle = capitalize(
    meta.seoTitle ? meta.seoTitle : `${meta.name} | weasker`
  );

  const metaDescription = meta.seoDescription
    ? meta.seoDescription
    : `${capitalize(
        meta.name
      )} - We interview experts from all fields and compare their answers, compiling diverse and reliable information`;

  const ogImage = meta.ogImage || meta.image;
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
      siteName: "weasker",
    },
  };
}

async function getData(pageParam: string) {
  const res = await getInnerPage(pageParam);
  if (!res) {
    throw new Error("Failed to fetch data");
  }
  return res;
}

export default async function About({ params }: Props) {
  const pageParam = params.page;

  const data = await getData(pageParam);

  if (!data) {
    return "no page";
  }

  const title = data.name;
  const excerpt = data.excerpt;
  const content = data.content;

  return (
    <>
      <HeroHP h1a="" h1b={title} excerpt={excerpt} />
      <text className="md:max-w-[60%] mx-auto">
        <PortableText value={content} />
      </text>
    </>
  );
}
