import {
  CollectionBeforeChangeHook,
  CollectionAfterChangeHook,
} from "payload/types";
import slugify from "slugify";

export const populateCommunitySlugAndPath: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
}) => {
  if (data.pluralName) {
    data.slug = slugify(data.pluralName, { lower: true, strict: true });
  }

  // If this is an existing document, we can set the path directly
  if (originalDoc && originalDoc.id) {
    data.path = `${data.slug}/${originalDoc.id}`;
  }

  return data;
};

export const updateCommunityPath: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  // If the path is not set, set it using the doc ID
  if (!doc.path || doc.path !== `${doc.slug}/${doc.id}`) {
    await req.payload.update({
      collection: "communities",
      id: doc.id,
      data: {
        path: `${doc.slug}/${doc.id}`,
      },
    });
  }
};
