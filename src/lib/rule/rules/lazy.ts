import { Rule } from "../rule";
import { Ctx } from "../context";

export const lazy = (rule: () => Rule) => (code: string, ctx: Ctx) => {
  return rule()(code, ctx) as ReturnType<Rule>;
};
