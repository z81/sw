import { isOk } from "../result/ok";
import { RuleResult } from "../result/result";
import { Rule } from "../rule";

export const maybe =
  <T extends Rule>(rule: T) =>
  (code: string): RuleResult => {
    const res = rule(code);

    return isOk(res)
      ? res
      : ({
          value: "",
          type: "MAYBE" as const,
          length: 0,
          status: "OK",
          skip: true,
        } as const);
  };
