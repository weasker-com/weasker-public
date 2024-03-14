import { getPayloadClient } from "../../../payload-client";
import { AfterChangeHook } from "payload/dist/collections/config/types";

export const updateUserInterviews: AfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  const payload = await getPayloadClient();

  const userId = doc.user?.id ? doc.user.id : doc.user;

  if (operation === "create") {
    try {
      const updatedUserInterviews = await payload.find({
        collection: "users-interviews",
        where: { user: { equals: userId } },
      });

      const updatedUserInterviewsIds = updatedUserInterviews.docs.map(
        (item) => {
          return item.id;
        }
      );

      const updateUser = await payload.update({
        collection: "users",
        id: userId,
        data: {
          userInterviews: updatedUserInterviewsIds,
        },
      });

      if (updateUser) {
        console.log("success updating user document");
      }
    } catch (error) {
      console.log("No success updating user document:", error);
    }
  }
  if (operation === "update") {
    if (userId !== previousDoc.user) {
      try {
        const updatedNewUserInterviews = await payload.find({
          collection: "users-interviews",
          where: { user: { equals: userId } },
        });

        const updatedNewUserInterviewsIds = updatedNewUserInterviews.docs.map(
          (item) => {
            return item.id;
          }
        );

        const updateNewUser = await payload.update({
          collection: "users",
          id: doc.user,
          data: {
            userInterviews: updatedNewUserInterviewsIds,
          },
        });

        if (updateNewUser) {
          console.log("success to update new user document");
        }

        const updatedPreviousUserInterviews = await payload.find({
          collection: "users-interviews",
          where: { user: { equals: previousDoc.user } },
        });

        const updatedPreviousUserInterviewsIds =
          updatedPreviousUserInterviews.docs.map((item) => {
            return item.id;
          });

        const updatePreviousUser = await payload.update({
          collection: "users",
          id: previousDoc.user,
          data: {
            userInterviews: updatedPreviousUserInterviewsIds,
          },
        });

        if (updatePreviousUser) {
          console.log("success to update previous user document");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
