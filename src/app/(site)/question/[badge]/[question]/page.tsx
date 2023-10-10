import Link from "next/link";
import {
  getQuestionPage,
  getQuestionPageMeta,
} from "../../../../../../sanity/sanity-utils";
import Hero from "@/components/Hero";
import AnswersList from "@/components/AnswersList";
import SidebarQuestionPage from "@/components/Sidebar-questionPage";
import { Metadata } from "next";
import capitalize from "@/helpers/capitalize";
import { QAPage, WithContext } from "schema-dts";
import { toPlainText } from "@portabletext/react";
import { InternalLink } from "@/components/links/InternalLink";

type Props = {
  params: { badge: string; question: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = await getQuestionPageMeta(params.badge, params.question);

  const metaTitle = capitalize(
    meta.questionDetails.seoTitle
      ? meta.questionDetails.seoTitle
      : `We asked ${meta.answersAmount} ${meta.interviewDetails.badge.name}: ${meta.questionDetails.shortQuestion}`
  );

  const metaDescription = meta.questionDetails.seoDescription
    ? meta.questionDetails.seoDescription
    : `${meta.questionDetails.longQuestion}`;

  const ogImage =
    meta.interviewDetails.ogImage || meta.interviewDetails.badge.ogImage;
  const slugA = params.badge;
  const slugB = params.question;

  const authors = meta.usersDetails.map((item, index) => {
    return { name: item.name, url: `https://www.weasker/user/${item.slug}` };
  });

  return {
    title: metaTitle,
    description: metaDescription,
    authors: authors,
    openGraph: {
      images: [ogImage],
      type: "website",
      url: `https://www.weasker.com/question/${slugA}/${slugB}`,
      title: metaTitle,
      description: metaDescription,
      siteName: "weasker",
    },
  };
}

async function getData(badgeParam: string, questionParam: string) {
  const res = await getQuestionPage(badgeParam, questionParam);
  if (!res) {
    throw new Error("Failed to fetch data");
  }
  return res;
}

export default async function Question({ params }: Props) {
  const data = await getData(params.badge, params.question);

  if (!data) {
    return "no question";
  }

  const interviwSlug = data.interviewDetails.slug;
  const badgeSlug = data.interviewDetails.badge.slug;
  const badge = data.interviewDetails.badge;
  const badgeName = data.interviewDetails.badge.name;
  const badgeSingularNameName = data.interviewDetails.badge.singularName;
  const interviewImage = data.interviewDetails.image;
  const questionText = data.questionDetails.question;
  const questionSlug = data.questionDetails.slug;
  const shortQuestionText = data.questionDetails.shortQuestion;
  const longQuestionText = data.questionDetails.longQuestion;
  const answers = data.answersDetails;
  const userList = data.answersDetails.map((detail) => detail.user);
  const otherQuestions = data.otherQuestions;

  const jsonLd: WithContext<QAPage> = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: questionText,
      text: longQuestionText,
      answerCount: answers.length,
      suggestedAnswer: answers.map((item, index) => {
        return {
          "@type": "Answer",
          text: toPlainText(item.answers[0].interviewAnswer),
          url: `https://www.weasker.com/question/${params.badge}/${params.question}#${item.user.slug}`,
        };
      }),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        services={badgeName}
        h1a={
          <div className="flex flex-row items-center flex-wrap">
            we asked&nbsp;{answers.length}&nbsp;
            <InternalLink
              element={answers.length == 1 ? badgeSingularNameName : badgeName}
              className="flex flex-rox items-center"
              href={`/badge/${badgeSlug}`}
              eventName="ClickBadgeName"
              target={badgeName}
              locationOnPage="hero"
            />
          </div>
        }
        h1b={questionText}
        excerpt={longQuestionText}
        featuredImageSrc={interviewImage}
        featuredImageAlt={`${badgeName} answer: ${shortQuestionText}`}
        featuredImageUrl={`/badge/${badgeSlug}`}
      />
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-20">
        <div className="md:max-w-[70%] flex flex-col gap-10">
          <AnswersList
            answers={answers}
            questionSlug={questionSlug}
            interviewSlug={interviwSlug}
          />
        </div>
        <div>
          <SidebarQuestionPage
            users={userList}
            otherQuestions={otherQuestions}
            badge={badge}
          />
        </div>
      </div>
    </>
  );
}
