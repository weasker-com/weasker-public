import { getPayloadClient } from "../../../payload-client";
import { AfterDeleteHook } from "payload/dist/collections/config/types";

export const updateBadgeInterviewsAfterDelete: AfterDeleteHook = async ({
  doc,
}) => {
  const payload = await getPayloadClient();
  try {
    const badgeId = doc.badge.id;

    const updatedBadgeInterviews = await payload.find({
      collection: "interviews",
      where: { badge: { equals: badgeId } },
    });

    const updatedBadgeInterviewsIds = updatedBadgeInterviews.docs.map(
      (item) => {
        return item.id;
      }
    );

    const updateBadge = await payload.update({
      collection: "badges",
      id: badgeId,
      data: {
        interviews: updatedBadgeInterviewsIds,
      },
    });

    if (updateBadge) {
      console.log("success updating badge interview after deletion");
    }
  } catch (error) {
    console.log("No success updating badge interview after deletion");
  }
};
