import payload from "payload";

interface ResolverArgs {
  slug: string;
}

export const Resolver = async (obj, args: ResolverArgs) => {
  if (!args.slug) {
    throw new Error("Missing badge slug");
  }

  const slug = args.slug;

  const users = await payload.find({
    collection: "users",
    depth: 0,
    sort: "-createdAt",
    where: {
      "userBadges.badge.seo.slug": {
        equals: slug,
      },
    },
  });
  return users;
};
