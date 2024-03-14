import payload from "payload";

interface ResolverArgs {
  userSlug: string;
  interviewSlug: string;
}

export const Resolver = async (obj, args: ResolverArgs) => {
  if (!args.badgeSlug) {
    throw new Error("Missing badge slug");
  }

  const userSlug = args.userSlug;
  const interviewSlug = args.interviewSlug;

  const userInterview = await payload.find({
    collection: "users-interviews",
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
