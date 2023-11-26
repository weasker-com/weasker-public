export type RuleType = {
  max: (length: number) => RuleType;
  min: (length: number) => RuleType;
  integer: () => RuleType;
  required: () => RuleType;
  error: (message: string) => RuleType;
};
