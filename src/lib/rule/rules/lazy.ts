import { Rule } from "../rule";

export const lazy = (rule: () => Rule) => (code: string) => {
  return rule()(code) as ReturnType<Rule>;
};
