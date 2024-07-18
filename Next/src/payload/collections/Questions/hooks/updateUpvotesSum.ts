import { CollectionBeforeChangeHook } from "payload/types";

export const updateUpvotesSum: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
}) => {
  if (data.upvotes && originalDoc?.upvotes) {
    const originalUpvotesLength = originalDoc.upvotes.length;
    const newUpvotesLength = data.upvotes.length;

    if (originalUpvotesLength !== newUpvotesLength) {
      data.upvotesSum = newUpvotesLength;
    }
  } else if (data.upvotes) {
    // If there are no original upvotes but there are new upvotes
    data.upvotesSum = data.upvotes.length;
  }
  return data;
};
