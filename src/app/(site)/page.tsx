import Head from "next/head";
import HeroHP from "@/components/Hero-hp";
import RecentQuestions from "@/components/RecentQuestions";
import logo from "@/../public/logo/tl-logo-17-09.svg";
import Search from "@/components/Search";

export default function Home() {
  return (
    <>
      <Head>
        <title className="capitalize">weasker | Interviewing Experts</title>
        <meta
          name="description"
          content="We interview various experts using the same set of questions, providing our readers with a diverse range of answers to explore."
          key="desc"
        />
        <meta property="og:title" content="weasker | Interviewing Experts" />
        <meta
          property="og:description"
          content="We interview various experts using the same set of questions, providing our readers with a diverse range of answers to explore."
        />
        <meta property="og:image" content={logo} />
      </Head>
      <HeroHP
        h1a="We ask experts"
        h1b="questions for beginners"
        excerpt="We ask the same set of questions to various experts, offering our readers a diverse range of answers to explore."
      />
      <Search />
      <div className="md:w-[60%] mx-auto">
        <h2>We recently asked</h2>
        <RecentQuestions />
      </div>
    </>
  );
}
