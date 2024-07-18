import { CollectionBeforeChangeHook } from "payload/types";
import slugify from "slugify";

export const populateUserSlugAndPath: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
}) => {
  if (data.userName) {
    data.slug = slugify(data.userName, { lower: true, strict: true });
  }

  if (data.slug && originalDoc._id) {
    data.path = `${data.slug}/${originalDoc._id}`;
  }

  return data;
};
