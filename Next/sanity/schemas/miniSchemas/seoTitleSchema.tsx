type RuleType = {
  max: (length: number, message: string) => RuleType;
  warning: () => RuleType;
};

export const seoTitleSchema = {
  name: "seoTitle",
  title: "SEO title",
  type: "string",
  validation: (Rule: RuleType) =>
    Rule.max(60, "SEO Title cannot be more than 60 characters").warning(),
  description: "SEO title, must be under 60 characters",
};
