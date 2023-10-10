import { getRecentQuestions } from "../../sanity/sanity-utils";
import Image from "next/image";
import { InternalLink } from "./links/InternalLink";

async function getData() {
  const res = await getRecentQuestions();
  if (!res) {
    throw new Error("Failed to fetch data");
  }
  return res;
}

export default async function RecentQuestions() {
  const data = await getData();

  if (!data) {
    return null;
  }

  return (
    <div>
      {data.map((item, index) => (
        <div
          key={index}
          className="flex flex-row w-full gap-2 sm:gap-5 my-5 sm:my-8 items-center capitalize"
        >
          <InternalLink
            element={
              <div className="w-[65px]">
                <Image
                  style={{
                    width: "65px",
                    height: "65px",
                    borderRadius: "100px",
                  }}
                  src={item.interview.interviewQuestion.image}
                  alt={item.interview.interviewQuestion.text}
                  width={65}
                  height={65}
                ></Image>
              </div>
            }
            href={`/question/${item.badge.slug}/${item.interview.interviewQuestion.slug}`}
            eventName="ClickQuestionPage"
            target={item.interview.interviewQuestion.text}
            locationOnPage="recent questions"
          />
          <div className="flex flex-col">
            <InternalLink
              element={
                <>
                  <Image
                    src={item.badge.image}
                    alt={item.interview.interviewQuestion.text}
                    width={20}
                    height={20}
                    style={{
                      height: "20px",
                      borderRadius: "100px",
                    }}
                  ></Image>
                  <span className="text-sm">{item.badge.name}</span>
                </>
              }
              className="text-tl-dark-blue flex flex-row items-center gap-1"
              href={`/badge/${item.badge.slug}`}
              eventName="ClickBadgeName"
              target={item.badge.name}
              locationOnPage="recent questions"
            />
            <InternalLink
              element={<p>{item.interview.interviewQuestion.text}</p>}
              href={`/question/${item.badge.slug}/${item.interview.interviewQuestion.slug}`}
              eventName="ClickQuestionPage"
              target={item.interview.interviewQuestion.text}
              locationOnPage="recent questions"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
