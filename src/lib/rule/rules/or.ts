import { isOk } from "../result/ok";
import { Error } from "../result/error";
import { Rule } from "../rule";
import { GetRuleRusult } from "../result/result";

export const or =
  <T extends Rule[]>(...rules: T) =>
  (code: string) => {
    const errors: Error[] = [];

    for (const rule of rules) {
      const res = rule(code);
      if (isOk(res)) {
        return res as GetRuleRusult<T>;
      }
      errors.push(res);
    }

    return {
      type: "OR",
      status: "ERROR",
      error: `Excepted some ${errors.map((e) => e.type)} found "${code.substring(0, 5)}"`,
    } as const;
  };
