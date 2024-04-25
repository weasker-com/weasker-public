import { getPayloadClient } from "../../../payload-client";
import { AfterChangeHook } from "payload/dist/collections/config/types";

export const updateBadgeInterviews: AfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  const payload = await getPayloadClient();

  if (operation === "create") {
    try {
      const updatedBadgeInterviews = await payload.find({
        collection: "interviews",
        where: { badge: { equals: doc.badge } },
      });

      const updatedBadgeInterviewsIds = updatedBadgeInterviews.docs.map(
        (item) => {
          return item.id;
        }
      );

      const updateBadge = await payload.update({
        collection: "badges",
        id: doc.badge,
        data: {
          interviews: updatedBadgeInterviewsIds,
        },
      });

      if (updateBadge) {
        console.log("success");
      }
    } catch (error) {
      console.log("No success");
    }
  }
  if (operation === "update") {
    if (doc.badge !== previousDoc.badge) {
      try {
        const updatedNewBadgeInterviews = await payload.find({
          collection: "interviews",
          where: { badge: { equals: doc.badge } },
        });

        const updatedNewBadgeInterviewsIds = updatedNewBadgeInterviews.docs.map(
          (item) => {
            return item.id;
          }
        );

        const updateNewBadge = await payload.update({
          collection: "badges",
          id: doc.badge,
          data: {
            interviews: updatedNewBadgeInterviewsIds,
          },
        });

        if (updateNewBadge) {
          console.log("success to update new badge");
        }

        const updatedPreviousBadgeInterviews = await payload.find({
          collection: "interviews",
          where: { badge: { equals: previousDoc.badge } },
        });

        const updatedPreviousBadgeInterviewsIds =
          updatedPreviousBadgeInterviews.docs.map((item) => {
            return item.id;
          });

        const updatePreviousBadge = await payload.update({
          collection: "badges",
          id: previousDoc.badge,
          data: {
            interviews: updatedPreviousBadgeInterviewsIds,
          },
        });

        if (updatePreviousBadge) {
          console.log("success to update previous badge");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
