import { getPayloadClient } from "../../../payload-client";
import { AfterChangeHook } from "payload/dist/collections/config/types";

export const updateInterviewUsers: AfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  const payload = await getPayloadClient();

  const interviewId = doc.interview?.id ? doc.interview.id : doc.interview;

  if (operation === "create") {
    try {
      const updatedInterviewUsers = await payload.find({
        collection: "users-interviews",
        where: { interview: { equals: interviewId } },
      });

      const updateInterviewUsersIds = updatedInterviewUsers.docs.map((item) => {
        return item.id;
      });

      const updateInterview = await payload.update({
        collection: "interviews",
        id: interviewId,
        data: {
          userInterviews: updateInterviewUsersIds,
        },
      });

      if (updateInterview) {
        console.log("Success updating interview document");
      }
    } catch (error) {
      console.log("No success updating interview document", error);
    }
  }
  if (operation === "update") {
    if (interviewId !== previousDoc.interview) {
      try {
        const updatedNewInterviewUsers = await payload.find({
          collection: "users-interviews",
          where: { interview: { equals: interviewId } },
        });

        const updatedNewInterviewUsersIds = updatedNewInterviewUsers.docs.map(
          (item) => {
            return item.id;
          }
        );

        const updateNewInterview = await payload.update({
          collection: "interviews",
          id: interviewId,
          data: {
            userInterviews: updatedNewInterviewUsersIds,
          },
        });

        if (updateNewInterview) {
          console.log("success to update new interview document");
        }

        const updatedPreviousInterviewUsers = await payload.find({
          collection: "users-interviews",
          where: { interview: { equals: previousDoc.interview } },
        });

        const updatedPreviousInterviewUsersIds =
          updatedPreviousInterviewUsers.docs.map((item) => {
            return item.id;
          });

        const updatePreviousInterview = await payload.update({
          collection: "interviews",
          id: previousDoc.interview,
          data: {
            userInterviews: updatedPreviousInterviewUsersIds,
          },
        });

        if (updatePreviousInterview) {
          console.log("success to update previous interview document");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
