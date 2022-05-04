import { Ok } from "./ok";
import { RuleResult } from "./result";

export type Error<E extends unknown = unknown, T extends unknown = unknown> = {
  error: E;
  type: T;
  status: "ERROR";
};

export const isError = (value: RuleResult): value is Ok => typeof value === "object" && value.status === "ERROR";
