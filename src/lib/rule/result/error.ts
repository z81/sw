import { RuleResult } from "./result";

export type Error<E extends unknown = unknown, T extends unknown = unknown> = {
  error: E;
  type: T;
  status: "ERROR";
};

export const isError = (value: RuleResult): value is Error<unknown, string> => typeof value === "object" && value.status === "ERROR";
