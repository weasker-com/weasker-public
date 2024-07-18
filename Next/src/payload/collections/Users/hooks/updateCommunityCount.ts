import { CollectionBeforeChangeHook } from "payload/types";

export const updateCommunityCount: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
}) => {
  if (data.communities && originalDoc?.communities) {
    const originalCommunitiesLength = originalDoc.communities.length;
    const newCommunitiesLength = data.communities.length;

    if (originalCommunitiesLength !== newCommunitiesLength) {
      data.communityCount = newCommunitiesLength;
    }
  } else if (data.communities) {
    data.communityCount = data.communities.length;
  }
  return data;
};
