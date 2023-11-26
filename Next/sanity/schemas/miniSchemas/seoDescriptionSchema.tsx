type RuleType = {
  max: (length: number, message: string) => RuleType;
  warning: () => RuleType;
};

export const seoDescriptionSchema = {
  name: "seoDescription",
  title: "SEO description",
  type: "string",
  validation: (Rule: RuleType) =>
    Rule.max(150, "SEO Title cannot be more than 150 characters").warning(),
  of: [
    {
      type: "block",
    },
  ],
  description: "SEO description, must be under 150 characters",
};
