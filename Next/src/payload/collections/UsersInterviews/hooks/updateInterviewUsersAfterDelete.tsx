import { getPayloadClient } from "../../../payload-client";
import { AfterDeleteHook } from "payload/dist/collections/config/types";

export const updateInterviewUsersAfterDelete: AfterDeleteHook = async ({
  doc,
}) => {
  const payload = await getPayloadClient();
  try {
    const interviewId = doc.interview?.id ? doc.interview.id : doc.interview;
    const updatedInterviewUsers = await payload.find({
      collection: "users-interviews",
      where: { interview: { equals: interviewId } },
    });

    const updatedInterviewUsersIds = updatedInterviewUsers.docs.map((item) => {
      return item.id;
    });

    const updateInterview = await payload.update({
      collection: "interviews",
      id: interviewId,
      data: {
        userInterviews: updatedInterviewUsersIds,
      },
    });

    if (updateInterview) {
      console.log("success updating interviews users after deletion");
    }
  } catch (error) {
    console.log("No success updating interview users after deletion");
  }
};
