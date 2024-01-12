import payload from "payload";

interface ResolverArgs {
  slug: string;
}

export const Resolver = async (obj, args: ResolverArgs, { req }, info) => {
  if (!args.slug) {
    throw new Error("Missing badge slug");
  }

  const slug = args.slug;

  const user = await payload.find({
    collection: "users",
    depth: 0,
    sort: "-createdAt",
    where: {
      "seo.slug": {
        equals: slug,
      },
    },
  });
  return user;
};
