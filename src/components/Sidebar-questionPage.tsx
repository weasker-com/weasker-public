import { PortableTextBlock } from "sanity";
import { badge } from "../../types/badge-type";
import { service } from "../../types/service-type";
import Image from "next/image";
import Link from "next/link";
import SocialShareButtons from "./SocialShareButtons";

interface Sidebarprops {
  users: singleUser[];
  otherQuestions: singleQuestion[];
  badge: badge;
}

interface singleUser {
  name: string;
  slug: string;
  userBio: PortableTextBlock[];
  pfp: string;
  badges: badge[];
  services: service[];
}

interface singleQuestion {
  shortQuestion: string;
  slug: string;
  image: string;
}

const SidebarQuestionPage: React.FC<Sidebarprops> = ({
  users,
  otherQuestions,
  badge,
}) => {
  return (
    <div className="flex flex-col gap-10">
      <SocialShareButtons />
      <div className="sm:flex flex-col gap-5 hidden">
        <div className="text-lg font-semibold">Answered</div>
        <ul className="flex flex-col gap-1">
          {users.map((item, index) => (
            <a className="text-tl-dark-blue text-sm" href={`#${item.slug}`}>
              <li
                key={index}
                className="flex flex-row gap-3 items-center leading-5 pb-3"
              >
                <Image
                  width={24}
                  height={24}
                  src={item.pfp}
                  alt={item.name}
                  className="rounded-full"
                  style={{
                    objectFit: "cover",
                    width: "24px",
                    height: "24px",
                  }}
                />
                {item.name}
              </li>
            </a>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-5">
        <div className="text-lg font-semibold">We also asked</div>
        <ul className="flex flex-col gap-1">
          {otherQuestions.slice(0, 10).map((item, index) => (
            <Link
              className="text-tl-dark-blue text-sm"
              href={`/question/${badge.slug}/${item.slug}`}
            >
              <li
                key={index}
                className="flex flex-row gap-3 items-center leading-5 pb-3"
              >
                <Image
                  width={24}
                  height={24}
                  src={item.image}
                  alt={item.shortQuestion}
                  className="rounded-full"
                  style={{
                    objectFit: "cover",
                    width: "24px",
                    height: "24px",
                  }}
                />
                {item.shortQuestion}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarQuestionPage;
