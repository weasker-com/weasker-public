import payload from "payload";

interface ResolverArgs {
  badgeSlug: string;
  interviewSlug: string;
}

export const Resolver = async (obj, args: ResolverArgs) => {
  if (!args.badgeSlug) {
    throw new Error("Missing badge slug");
  }

  const interviewSlug = args.interviewSlug;
  const badgeSlug = args.badgeSlug;

  const interview = await payload.find({
    collection: "interviews",
    depth: 0,
    sort: "-createdAt",
    where: {
      and: [
        {
          "badge.seo.slug": {
            equals: badgeSlug,
          },
        },
        {
          "seo.slug": {
            equals: interviewSlug,
          },
        },
      ],
    },
  });
  return interview;
};
