import type { AfterChangeHook } from "payload/dist/collections/config/types";
import { getPayloadClient } from "../../../payload-client";
import _, { difference } from "lodash";

export const handleBadgeRemoval: AfterChangeHook = async ({
  operation,
  doc,
  previousDoc,
}) => {
  if (operation === "update") {
    const prevUserBadges = previousDoc.userBadges.map((item) => {
      return item.badge;
    });

    const currentUserBadges = doc.userBadges.map((item) => {
      return item.badge?.id ? item.badge?.id : item.badge;
    });

    const removedBadges = _.difference(prevUserBadges, currentUserBadges);
    if (removedBadges.length > 0) {
      try {
        const removedBadge = difference(prevUserBadges, currentUserBadges)[0];

        const payload = await getPayloadClient();

        const user = doc.id;

        const deleteUserBadgeInterviews = await payload.delete({
          collection: "users-interviews",
          where: {
            badge: { equals: removedBadge },
            user: { equals: user },
          },
          depth: 2,
        });

        if (deleteUserBadgeInterviews) {
          console.log(
            "Success deleting user interviews",
            deleteUserBadgeInterviews
          );
        }

        const updatedBadgeUsers = await payload.find({
          collection: "users",
          where: {
            "userBadges.badge": {
              equals: removedBadge,
            },
          },
        });

        const updatedBadgeUsersIds = updatedBadgeUsers.docs.map((item) => {
          return item.id;
        });

        const updateBadgeUsers = await payload.update({
          collection: "badges",
          id: removedBadge as string,
          data: {
            users: updatedBadgeUsersIds,
          },
        });

        if (updateBadgeUsers) {
          console.log("Success updating badge users");
        }
      } catch (error) {
        console.log("Failed to delete user interviews or badge users", error);
      }
    }
  }
};
