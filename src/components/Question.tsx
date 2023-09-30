interface QuestionProps {
  text: string;
  id: number;
  slug: string;
}

const Question: React.FC<QuestionProps> = ({ text, id, slug }) => {
  return (
    <div className="flex flex-row gap-3 sm:gap-5 items-center">
      <div className="w-12 max-h-12">
        <div className="flex flex-row items-center justify-center w-12 max-h-12 border rounded-full p-3 border-tl-light-blue text-tl-light-blue text-xl sm:text-3xl font-thin">
          {id}
        </div>
      </div>
      <h2 className="font-semibold">{text}</h2>
    </div>
  );
};

export default Question;
