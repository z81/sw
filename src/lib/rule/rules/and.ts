import { isError } from "../result/error";
import { Ok, isOk } from "../result/ok";
import { RuleResult } from "../result/result";
import { Rule } from "../rule";

export const and =
  <T extends Rule[]>(...rules: T) =>
  (code: string): RuleResult => {
    const result: Ok[] = [];
    // let len = 0;
    let str = code;

    for (const rule of rules) {
      const res = rule(str);

      if (isOk(res)) {
        if (!res.skip) {
          result.push(res);
        }

        str = str.slice(res.length);
        // len += res.length;
      }

      if (isError(res)) {
        return res;
      }
    }

    // console.log(result, code.length - str.length, str);

    return {
      value: result,
      type: "AND",
      length: code.length - str.length,
      status: "OK",
    };
  };
