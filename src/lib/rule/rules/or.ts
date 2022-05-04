import { isOk } from "../result/ok";
import { Error } from "../result/error";
import { RuleResult } from "../result/result";
import { Rule } from "../rule";

export const or =
  <T extends Rule[]>(...rules: T) =>
  (code: string): RuleResult => {
    const errors: Error[] = [];

    for (const rule of rules) {
      const res = rule(code);
      if (isOk(res)) {
        return res;
      }
      errors.push(res);
    }

    return {
      type: "OR",
      status: "ERROR",
      error: `Excepted some ${errors.map((e) => e.type)} found "${code.substring(0, 5)}"`,
    } as const;
  };
