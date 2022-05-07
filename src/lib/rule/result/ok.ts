import { RuleResult } from "./result";

export type Ok<V extends unknown = unknown, T extends string = string> = {
  value: V;
  type: T;
  key?: string;
  length: number;
  status: "OK";
  skip?: boolean;
};

export const isOk = (value: RuleResult): value is Ok => typeof value === "object" && value.status === "OK";
