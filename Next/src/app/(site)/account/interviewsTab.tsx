import ListItem from "@/components/ListItem";
import { Badge, Interview, Media } from "@/payload/payload-types";
import { CldImage } from "next-cloudinary";

interface InterviewsTabProps {
  interviews: Interview[];
}

export const InterviewsTab = ({ interviews }: InterviewsTabProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 lg:max-w-[1000px] mt-2 w-full mt-2">
      <div className="flex flex-col w-full">
        {interviews.length > 0 ? (
          interviews.map((item, index) => {
            return (
              <div
                key={index}
                className="flex flex-col bg-white mx-2 p-2 lg:px-10 lg:py-3 border gap-10"
              >
                <div className="flex flex-row justify-between items-center hover:cursor-pointer">
                  <div className="flex flex-row items-center content-center gap-3">
                    <CldImage
                      width={200}
                      height={200}
                      src={(item.seo.image as Media).filename}
                      alt={item.name}
                      className="h-[50px] w-[50px] sm:w-[70px] sm:h-[70px] cover  rounded-full border-2 border-weasker-grey"
                    />

                    <div>
                      <span className=" text-weasker-grey">Interview</span>
                      <h2>{(item.badge as Badge).singularName}</h2>
                    </div>
                  </div>

                  <div className="text-tl-light-blue">Edit</div>
                </div>
              </div>
            );
          })
        ) : (
          <ListItem
            location={"user"}
            name={"Looks like you didn't answer any interviews yet"}
          />
        )}
      </div>
    </div>
  );
};
