import { CollectionBeforeChangeHook } from "payload/types";
import slugify from "slugify";
import { ValidationError } from "payload/errors";
import { getPayloadClient } from "../../../payload-client";
import { Community } from "@/payload/payload-types";

export const populatePathField: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
}) => {
  try {
    if (data.question) {
      data.questionSlug = slugify(data.question, { lower: true, strict: true });
    }

    const payload = await getPayloadClient();

    let communitiesSlugs: string[] = [];

    if (
      data.communities &&
      Array.isArray(data.communities) &&
      data.communities.length > 0
    ) {
      const communitiesResult = await payload.find({
        collection: "communities",
        where: {
          id: {
            in: data.communities,
          },
        },
      });

      // Type cast the returned documents to unknown first, then to Community[]
      const communities = communitiesResult.docs as unknown as Community[];

      communitiesSlugs = communities.map((community) =>
        slugify(community.pluralName, { lower: true, strict: true })
      );

      // Join the slugs with "-" and update the communitiesSlug field
      data.communitiesSlug = communitiesSlugs.join("-");
    }

    if (data.questionSlug && communitiesSlugs.length > 0 && originalDoc.id) {
      data.path = `${data.communitiesSlug}/${data.questionSlug}/${originalDoc.id}`;
    } else {
      throw new Error("Insufficient data to generate path");
    }

    return data;
  } catch (error) {
    console.log(error);
    throw new ValidationError([
      {
        message: "Error: path was not populated",
        field: "path",
      },
    ]);
  }
};
