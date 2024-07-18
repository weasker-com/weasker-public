import React from "react";

import {
  Badge,
  User,
  Interview,
  UsersInterview,
} from "@/payload/payload-types";
import { TextAreaInput, TextInput } from "@/components/ui/inputs";
import { BigButton } from "@/components/ui/buttons";

interface ClientPageProps {
  data: {
    data: {
      Badges: { docs: Badge[] };
      Users: { docs: User[] };
      Interviews: { docs: Interview[] };
      UsersInterviews: { docs: UsersInterview[] };
    };
  } | null;
}

const ClientPage: React.FC<ClientPageProps> = (data) => {
  console.log("data", data);
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-5 w-full px-10 mx-auto">
        <div className="max-w-min">
          <h1 className="text-[40px] md:text-[70px] leading-[3rem] md:leading-[6rem] font-black">
            Ask Experts From Verified Communities
          </h1>
        </div>
        <div className="w-full md:pl-5">
          <div className="border border-tl-dark-blue/20 rounded px-2 py-5 md:p-10">
            <form className="flex flex-col gap-3">
              <TextAreaInput
                name={`question`}
                label={`Your question`}
                labelClassName="text-lg capitalize"
                placeHolder={`How to...`}
                // value={serviceLinks[name] || ""}
                // onChange={(e) => handleLinkChange(e, name)}
                // onBlur={() => handleLinkBlur(name)}
                // saved={serviceLinksSaved[name] || false}
                // errorMessage={serviceLinksErrorMessage[name]}
              />
              <TextInput
                type="text"
                name={`question`}
                label={`Search for communities`}
                labelClassName="text-lg capitalize"
                placeHolder={`Search`}
                // value={serviceLinks[name] || ""}
                // onChange={(e) => handleLinkChange(e, name)}
                // onBlur={() => handleLinkBlur(name)}
                // saved={serviceLinksSaved[name] || false}
                // errorMessage={serviceLinksErrorMessage[name]}
              />

              <BigButton
                text="Ask"
                className="text-2xl font-bold bg-tl-light-blue w-full sm:text-2xl"
              />
            </form>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default ClientPage;
