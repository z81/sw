import { isError } from "../result/error";
import { Ok, isOk } from "../result/ok";
import { GetRuleRusult } from "../result/result";
import { Rule } from "../rule";

export const and =
  <T extends Rule[]>(...rules: T) =>
  (code: string) => {
    const result: Ok[] = [];
    let str = code;

    for (const rule of rules) {
      const res = rule(str);

      if (isOk(res)) {
        if (!res.skip) {
          result.push(res);
        }

        str = str.slice(res.length);
      }

      if (isError(res)) {
        return res as GetRuleRusult<T>;
      }
    }

    return {
      value: result as GetRuleRusult<T>,
      type: "AND",
      length: code.length - str.length,
      status: "OK",
    } as const;
  };
