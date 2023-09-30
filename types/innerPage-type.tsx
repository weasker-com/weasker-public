import { PortableTextBlock } from "sanity";

export type InnerPage = {
  name: string;
  image: string;
  excerpt: string;
  content: PortableTextBlock[];
  seo: {
    title: string;
    description: string;
    image: string;
  };
};
