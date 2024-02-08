import { defaultImages } from "@/utils/defaultImages";
import { pageRes } from "../../../types/Responses";
import Hero from "../Hero";
import parse from "html-react-parser";
import React from "react";

interface GeericPageProps {
  data: pageRes;
  params: { page: string };
}

const GenericPage: React.FC<GeericPageProps> = (data) => {
  const page = data?.data.data.Pages.docs[0];
  const title = page.name;
  const excerpt = page.seo.excerpt;
  const content = page.richText_html;

  return (
    <>
      <Hero
        title={title}
        preTitle={"weasker.com"}
        image={defaultImages.weaskerLogo}
        location={"page"}
      />
      <text className="max-w-[90%] sm:max-w-[60%] mx-auto flex flex-col gap-5 mt-5">
        {excerpt && parse(excerpt)}
        {content && parse(content)}
      </text>
    </>
  );
};

export default GenericPage;
