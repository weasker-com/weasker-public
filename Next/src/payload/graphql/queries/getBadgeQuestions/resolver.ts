import payload from "payload";

interface ResolverArgs {
  slug: string;
}

export const Resolver = async (obj, args: ResolverArgs) => {
  if (!args.slug) {
    throw new Error("Missing badge slug");
  }

  const slug = args.slug;

  const questions = await payload.find({
    collection: "interviews",
    depth: 0,
    sort: "-createdAt",
    where: {
      "badge.seo.slug": {
        equals: slug,
      },
    },
  });
  return questions;
};
