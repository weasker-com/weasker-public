import { ValidationError } from "payload/errors";
import { getPayloadClient } from "../../../payload-client";
import { CollectionBeforeChangeHook } from "payload/types";

export const populateUserSlug: CollectionBeforeChangeHook = async ({
  data,
}) => {
  try {
    const payload = await getPayloadClient();
    const user = await payload.findByID({
      collection: "users",
      id: data.user,
    });

    data.userSlug = user.seo.slug;

    return data;
  } catch (error) {
    console.log(error);
    throw new ValidationError([
      {
        message: "Error: data.userSlug was not updated",
        field: data.userSlug,
      },
    ]);
  }
};
