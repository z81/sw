import { isOk } from "../result/ok";
import { Rule } from "../rule";
import { Ctx } from "../context";

export const maybe =
  <T extends Rule>(rule: T) =>
  (code: string, ctx: Ctx) => {
    const res = rule(code, ctx);

    return isOk(res)
      ? res as ReturnType<T>
      : ({
          value: "",
          type: "MAYBE",
          length: 0,
          status: "OK",
          skip: true,
        } as const);
  };
