import payload from "payload";

interface ResolverArgs {
  badgeSlug: string;
  interviewSlug: string;
  questionSlug: string;
}

export const Resolver = async (obj, args: ResolverArgs) => {
  if (!args.badgeSlug) {
    throw new Error("Missing badge slug");
  }

  const badgeSlug = args.badgeSlug;
  const interviewSlug = args.interviewSlug;

  const question = await payload.find({
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
        {
          "seo.slug": {
            equals: interviewSlug,
          },
        },
      ],
    },
  });
  return question;
};
