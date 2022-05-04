import { RuleTypes } from "../ruleTypes";
import { RuleResult } from "./result";

export type Ok<V extends unknown = unknown, T extends RuleTypes = RuleTypes> = {
  value: V;
  type: T;
  key?: string;
  length: number;
  status: "OK";
  skip?: boolean;
  priority?: number;
};

export const isOk = (value: RuleResult): value is Ok => typeof value === "object" && value.status === "OK";
