import { ValidationError } from "payload/errors";
import { getPayloadClient } from "../../../payload-client";
import { CollectionBeforeChangeHook } from "payload/types";

export const populateBadgeSlug: CollectionBeforeChangeHook = async ({
  data,
}) => {
  try {
    const payload = await getPayloadClient();
    const badge = await payload.findByID({
      collection: "badges",
      id: data.badge,
    });

    data.badgeSlug = badge.seo.slug;

    return data;
  } catch (error) {
    console.log(error);
    throw new ValidationError([
      {
        message: "Error: data.badgeSlug was not updated",
        field: data.badgeSlug,
      },
    ]);
  }
};
