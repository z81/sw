import { isOk } from "../result/ok";
import { RuleResult } from "../result/result";
import { Rule } from "../rule";

export const key =
  <R extends Rule, T extends string>(type: T, rule: R) =>
  (code: string): RuleResult => {
    const res = rule(code);
    if (isOk(res)) {
      res.key = type;
    }

    return res;
  };
