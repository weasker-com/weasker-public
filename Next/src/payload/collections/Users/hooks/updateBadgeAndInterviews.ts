import type { AfterDeleteHook } from "payload/dist/collections/config/types";
import { getPayloadClient } from "../../../payload-client";
import { User } from "@/payload/payload-types";

export const updateBadgeAndInterviews: AfterDeleteHook = async ({ doc }) => {
  try {
    const payload = await getPayloadClient();

    const userId = doc?.id ? doc.id : doc;

    const userBadges = await payload.find({
      collection: "badges",
      where: {
        users: { contains: userId },
      },
    });

    const deleteUserFromBadges = userBadges.docs.map(async (item) => {
      const badgeId = item?.id ? item.id : item;
      const updatedBadgeList = item.users.filter((user) => {
        return user !== userId;
      });

      const updatedBadgeListIds = updatedBadgeList.map((item) => {
        return (item as User).id;
      });

      return payload.update({
        collection: "badges",
        id: badgeId as string,
        data: {
          users: updatedBadgeListIds,
        },
        depth: 2,
      });
    });

    await Promise.all(deleteUserFromBadges);

    console.log("success deleting user from badges");

    const deleteInterviews = await payload.delete({
      collection: "users-interviews",
      where: {
        user: { equals: userId },
      },
    });

    if (deleteInterviews) {
      console.log("success deleting user interviews");
    }
  } catch (error) {
    console.log("Failed to delete user from badges", error);
  }
};
