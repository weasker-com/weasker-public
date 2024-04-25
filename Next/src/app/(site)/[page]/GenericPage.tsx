import parse from "html-react-parser";
import React from "react";
import { WideBox } from "@/components/ui/boxes";
import { Page } from "@/payload/payload-types";

interface GenericPageProps {
  data: { data: { Pages: { docs: Page[] } } };
  params: { page: string };
}

const GenericPage: React.FC<GenericPageProps> = (data) => {
  const page = data?.data.data.Pages.docs[0];
  const title = page.name;
  const excerpt = page.seo.excerpt;
  const content = page.richText_html;

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2 w-full">
      <div className="lg:w-[70%] flex flex-col w-full">
        <div className="flex flex-col gap-2 w-full">
          <WideBox className="p-3 sm:p-5 sm:p-10">
            <div className="text-5xl smallCaps font-black">{title}</div>
            <span className="text-sm">{excerpt && parse(excerpt)}</span>
          </WideBox>
          <WideBox className="p-3 sm:p-5 sm:p-10">
            <div className="w-full">
              <div className="text-page">{content && parse(content)}</div>
            </div>
          </WideBox>
        </div>
      </div>
    </div>
  );
};

export default GenericPage;
