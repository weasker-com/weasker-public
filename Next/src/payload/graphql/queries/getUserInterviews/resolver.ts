import payload from "payload";

interface ResolverArgs {
  slug: string;
}

export const Resolver = async (obj, args: ResolverArgs) => {
  if (!args.slug) {
    throw new Error("Missing badge slug");
  }

  const slug = args.slug;

  const user = await payload.find({
    collection: "interviews",
    depth: 0,
    sort: "-createdAt",
    where: {
      "questions.question.answers.user.seo.slug": {
        equals: slug,
      },
    },
  });
  return user;
};
