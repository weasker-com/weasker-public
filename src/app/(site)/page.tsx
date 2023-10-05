import HeroHP from "@/components/Hero-hp";
import RecentQuestions from "@/components/RecentQuestions";
import Search from "@/components/Search";

export default function Home() {
  return (
    <>
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
