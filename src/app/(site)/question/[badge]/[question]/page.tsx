import Head from "next/head";
import Link from "next/link";
import { getQuestionPage } from "../../../../../../sanity/sanity-utils";
import Hero from "@/components/Hero";
import AnswersList from "@/components/AnswersList";
import SidebarQuestionPage from "@/components/Sidebar-questionPage";

type Props = {
  params: { badge: string; question: string };
};

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
  const badgeImage = data.interviewDetails.badge.image;
  const interviewImage = data.interviewDetails.image;
  const questionText = data.questionDetails.question;
  const questionSlug = data.questionDetails.slug;
  const shortQuestionText = data.questionDetails.shortQuestion;
  const longQuestionText = data.questionDetails.longQuestion;
  const answers = data.answersDetails;
  const userList = data.answersDetails.map((detail) => detail.user);
  const otherQuestions = data.otherQuestions;
  const metaTitle = data.questionDetails.seoTitle;
  const metaDescription = data.questionDetails.seoDescription;
  const ogImage = data.interviewDetails.ogImage;

  return (
    <>
      <Head>
        <title className="capitalize">
          {metaTitle ? metaTitle : `${badgeName}: ${shortQuestionText}`}
        </title>
        <meta
          name="description"
          content={
            metaDescription
              ? metaDescription
              : `We asked ${answers.length} ${
                  answers.length == 1 ? badgeSingularNameName : badgeName
                }: ${questionText}`
          }
          key="desc"
        />
        <meta
          property="og:title"
          className="capitalize"
          content={metaTitle ? metaTitle : `${badgeName}: ${shortQuestionText}`}
        />
        <meta
          property="og:description"
          content={
            metaDescription
              ? metaDescription
              : `We asked ${answers.length} ${
                  answers.length == 1 ? badgeSingularNameName : badgeName
                }: ${questionText}`
          }
        />
        <meta property="og:image" content={ogImage || badgeImage} />
      </Head>
      <Hero
        services={badgeName}
        h1a={
          <div className="flex flex-row items-center flex-wrap">
            we asked&nbsp;{answers.length}&nbsp;
            <Link
              className="flex flex-rox items-center"
              href={`/badge/${badgeSlug}`}
            >
              {answers.length == 1 ? badgeSingularNameName : badgeName}
            </Link>
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
