import { PortableTextBlock } from "sanity";
import { service } from "./service-type";
import { badge } from "./badge-type";

export type User = {
  id: string;
  createdAt: Date;
  name: string;
  badges: badge[];
  pfp: string;
  services: service[];
  bio: PortableTextBlock[];
  seoTitle: string;
  seoDescription: string;

  interviews: { interview: { name: string; slug: string; image: string } }[];
};
