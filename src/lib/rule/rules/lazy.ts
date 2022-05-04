import { RuleResult } from "../result/result";
import { Rule } from "../rule";

export const lazy =
  <R extends Rule>(rule: () => R) =>
  (code: string): RuleResult => {
    return rule()(code);
  };
