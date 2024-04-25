import type { AfterChangeHook } from "payload/dist/collections/config/types";
import { getPayloadClient } from "../../../payload-client";
import { User } from "@/payload/payload-types";
import _ from "lodash";

export const updateBadgeUsers: AfterChangeHook = async ({
  operation,
  doc,
  previousDoc,
}) => {
  if (operation === "update") {
    const previousDocBadges = previousDoc.userBadges.map((item) => {
      return item.badge?.id ? item.badge.id : item.badge;
    });
    const docBadges = doc.userBadges.map((item) => {
      return item.badge?.id ? item.badge.id : item.badge;
    });
    const payload = await getPayloadClient();
    const addedBadges = _.difference(docBadges, previousDocBadges);

    if (addedBadges.length > 0) {
      try {
        await Promise.all(
          addedBadges.map(async (item: string) => {
            const badgeDetails = await payload.findByID({
              collection: "badges",
              id: item,
              depth: 2,
            });

            const badgeUsersIds = badgeDetails?.users
              ? badgeDetails.users.map((item) => {
                  return (item as User).id;
                })
              : [];

            const badgeHasUser = badgeUsersIds.includes(doc.id);

            if (badgeHasUser) {
              return;
            }

            const updatedBadgeUsers = badgeDetails.users
              ? [
                  ...badgeDetails.users.map((user) => {
                    return (user as User).id;
                  }),
                  doc.id,
                ]
              : [doc.id];

            await payload.update({
              collection: "badges",
              id: item,
              data: {
                users: updatedBadgeUsers,
              },
            });
          })
        );
      } catch (error) {
        console.error("Error updating badge users", error);
      }
    }
  }
};
