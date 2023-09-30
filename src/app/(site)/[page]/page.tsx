import HeroHP from "@/components/Hero-hp";
import { getInnerPage } from "../../../../sanity/sanity-utils";
import { PortableText } from "@portabletext/react";

type Props = {
  params: { page: string };
};

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
