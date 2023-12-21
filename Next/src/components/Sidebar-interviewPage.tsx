import Image from "next/image";
import { PortableTextBlock } from "sanity";
import { InternalLink } from "./links/InternalLink";

interface Sidebarprops {
  questions: singleQuestion[];
  otherUsers: user[];
  interviewSlug: string;
}

interface singleQuestion {
  number: number;
  question: string;
  slug: string;
  answer: {
    answers: {
      number: number;
      interviewAnswer: string;
      images:
        | {
            image: { url: string };
          }[]
        | [];
      video: any;
    };
    seoTitle: string;
    seoDescription: string;
  };
}

interface user {
  name: string;
  slug: string;
  pfp: string;
  userBadgeSlug: string;
}

const SidebarInterviewPage: React.FC<Sidebarprops> = ({
  questions,
  otherUsers,
  interviewSlug,
}) => {
  return (
    <div className="flex flex-col gap-10">
      <div className="sm:flex flex-col gap-5 hidden">
        <div className="text-lg font-semibold">Questions list</div>
        <ul className="flex flex-col gap-1">
          {questions
            .filter((item) => item.answer.answers)
            .sort((a, b) => a.number - b.number)
            .map((item, index) => (
              <InternalLink
                element={
                  <li
                    key={index}
                    className="flex flex-row gap-3 items-center leading-5 pb-3"
                  >
                    <div className="w-6 h-6">
                      <div className="w-6 h-6 flex flex-row items-center justify-center border rounded-full border-tl-light-blue text-tl-light-blue text-xs font-medium">
                        {index + 1}
                      </div>
                    </div>
                    {item.question}
                  </li>
                }
                href={`#${item.slug}`}
                className="text-tl-dark-blue text-sm"
                eventName="ClickTOC"
                target={item.question}
                locationOnPage="sidebar"
              />
            ))}
        </ul>
      </div>
      {otherUsers.length > 0 && (
        <div className="flex flex-col gap-5">
          <div className="text-lg font-semibold">Also answered</div>
          <ul className="flex flex-col gap-1">
            {otherUsers.map((item, index) => (
              <InternalLink
                element={
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
                }
                href={`/interview/${item.userBadgeSlug}/${item.slug}/${interviewSlug}`}
                className="text-tl-dark-blue text-sm"
                eventName="ClickUserName"
                target={item.name}
                locationOnPage="sidebar"
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SidebarInterviewPage;
