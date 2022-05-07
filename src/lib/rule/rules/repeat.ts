import { Ok, isOk } from "../result/ok";
import { GetRuleRusult } from "../result/result";
import { Rule } from "../rule";

export const repeat =
  <T extends Rule[]>(...rules: T) =>
  (code: string) => {
    const result: Ok[] = [];
    let str = code;

    while (true) {
      for (const rule of rules) {
        const res = rule(str);

        if (!isOk(res) || str.length === 0) {
          if (result.length === 1) {
            return result[0] as ReturnType<T[0]>;
          }

          return result.length > 0
            ? {
                type: "REPEAT",
                value: result as GetRuleRusult<T>,
                length: result.reduce((a, b) => a + b.length, 0),
                status: "OK",
              } as const
            : {
                type: "REPEAT",
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                error: `Excepted some ${res.error}`,
                status: "ERROR",
              } as const;
        }

        const last = result[result.length - 1];
        if (last?.type === res.type && typeof res.value === "string") {
          if (typeof res.value === "string") {
            last.value += res.value;
          } else {
            if (last.value) {
              last.value = [last.value];
            }

            if (Array.isArray(last.value)) {
              last.value.push(res.value);
            }
          }
          last.length += res.length;
        } else {
          result.push(res);
        }

        str = str.slice(res.length);
      }
    }
  };
