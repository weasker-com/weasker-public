import { getPayloadClient } from "../../../payload-client";

export const perUserInterviews = async (data) => {
  if (data.user) {
    try {
      const payload = await getPayloadClient();
      const user = await payload.findByID({
        collection: "users",
        id: data.user,
        depth: 2,
      });

      const userBadgesArray = user.userBadges.map((userBadge) => {
        return userBadge.badge;
      });

      return {
        badge: {
          in: userBadgesArray,
        },
      };
    } catch (error) {
      console.error("Error fetching user or constructing badge filter", error);
      return {};
    }
  } else {
    return {};
  }
};
