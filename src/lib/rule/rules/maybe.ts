import { isOk } from "../result/ok";
import { Rule } from "../rule";

export const maybe =
  <T extends Rule>(rule: T) =>
  (code: string) => {
    const res = rule(code);

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
