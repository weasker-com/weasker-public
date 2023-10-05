import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { PortableTextBlock } from "sanity";
import { service } from "../../types/service-type";
import { badge } from "../../types/badge-type";

interface AnswerProps {
  interviewSlug: string;
  question: boolean;
  text: PortableTextBlock[];
  images?: { url: string }[];
  questionSlug: string;
  otherUsersAmount: number;
  user: {
    name: string;
    slug: string;
    userBio: PortableTextBlock[];
    services: service[];
    pfp: string;
    badges: badge[];
  };
}

const Answer: React.FC<AnswerProps> = ({
  text,
  images,
  questionSlug,
  user,
  question,
  interviewSlug,
  otherUsersAmount,
}) => {
  return (
    <div className="flex flex-col gap-3 pb-10 " id={user.slug}>
      <div className="flex flex-row gap-3 sm:gap-5 items-center">
        <Link href={`/user/${user.slug}`}>
          <Image
            width={50}
            height={50}
            src={user.pfp}
            alt={user.name}
            className="rounded-full"
            style={{ objectFit: "cover", width: "50px", height: "50px" }}
          />
        </Link>
        <div className="flex flex-col">
          <h2 className="text-base sm:text-xl font-semibold">
            <Link className="text-tl-dark-blue" href={`/user/${user.slug}`}>
              {user.name}
            </Link>
          </h2>
          <h3 className="flex flex-row text-sm sm:text-base font-normal">
            <a
              className="text-tl-dark-blue"
              href={`/badge/${user.badges[0].slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {user.badges[0].singularName}
            </a>
            &nbsp;at&nbsp;
            <Link href={user.services[0].url}>{user.services[0].name}</Link>
          </h3>
        </div>
      </div>
      <div className="m-auto sm:ml-[70px] font-light flex-col flex gap-5 sm:w-[80%]">
        <PortableText value={text} />

        <div className="flex flex-row gap-2 flex-wrap ">
          {images?.map((image, index) => (
            <a href={image.url} target="_blank" rel="noopener noreferrer">
              <Image
                key={index}
                alt={`image by ${user.name} - ${user.badges[0].singularName}`}
                width={100}
                height={100}
                style={{
                  objectFit: "cover",
                  width: "100px",
                  height: "100px",
                }}
                src={image.url}
              />
            </a>
          ))}
        </div>
      </div>
      <div className="sm:ml-[70px]">
        {question ? (
          <Link
            href={`/interview/${user.badges[0].slug}/${user.slug}/${interviewSlug}`}
          >
            Read full interview
          </Link>
        ) : (
          <Link href={`/question/${user.badges[0].slug}/${questionSlug}`}>
            Read {otherUsersAmount}{" "}
            {otherUsersAmount == 1 ? "other answer" : "other answers"}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Answer;
