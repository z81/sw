import { Ok, isOk } from "../result/ok";
import { RuleResult } from "../result/result";
import { Rule } from "../rule";

export const repeat =
  <T extends Rule[]>(...rules: T) =>
  (code: string): RuleResult => {
    const result: Ok[] = [];
    let str = code;

    while (true) {
      for (const rule of rules) {
        const res = rule(str);

        if (!isOk(res)) {
          if (result.length === 1) {
            return result[0];
          }

          return result.length > 0
            ? {
                type: "REPEAT",
                value: result,
                length: result.reduce((a, b) => a + b.length, 0),
                status: "OK",
              }
            : {
                type: "REPEAT",
                error: "No items",
                status: "ERROR",
              };
        }

        const last = result[result.length - 1];
        if (last?.type === res.type && typeof res.value === "string") {
          if (typeof res.value === "string") {
             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            last.value += res.value;
          } else {
            if (last.value) {
              last.value = [last.value];
            }
            last.value.push(res.value);
          }
          last.length += res.length;
        } else {
          result.push(res);
        }

        str = str.slice(res.length);
      }
    }
  };
