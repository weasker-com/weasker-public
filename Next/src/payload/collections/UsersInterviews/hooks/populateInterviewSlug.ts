import { ValidationError } from "payload/errors";
import { getPayloadClient } from "../../../payload-client";
import { CollectionBeforeChangeHook } from "payload/types";

export const populateInterviewSlug: CollectionBeforeChangeHook = async ({
  data,
}) => {
  try {
    const payload = await getPayloadClient();
    const interview = await payload.findByID({
      collection: "interviews",
      id: data.interview,
    });

    data.interviewSlug = interview.seo.slug;

    return data;
  } catch (error) {
    console.log(error);
    throw new ValidationError([
      {
        message: "Error: data.interviewSlug was not updated",
        field: data.interviewSlug,
      },
    ]);
  }
};
